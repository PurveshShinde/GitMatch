/**
 * Issues Controller
 * Handles all issue recommendation API endpoints.
 */

import User from "../models/user.model.js";
import EnrichedIssue from "../models/enrichedIssue.model.js";
import IssueFeedback from "../models/issueFeedback.model.js";
import { buildSkillVector } from "../services/userProfile.service.js";
import { rankIssuesForUser } from "../services/issueMatching.service.js";
import { ingestIssues, getIssueCount } from "../services/issueIngestion.service.js";
import issueCache from "../services/issueCache.service.js";
import { errorHandler } from "../utils/error.js";

/**
 * GET /api/issues/recommended
 * Returns ranked, paginated issue recommendations for the authenticated user.
 */
export const getRecommended = async (req, res, next) => {
	try {
		const userId = req.user.id;

		// 1. Fetch user and their onboarding data
		const user = await User.findById(userId);
		if (!user) return next(errorHandler(404, "User not found"));

		if (!user.isOnboarded || !user.onboardingData) {
			return next(errorHandler(400, "Please complete onboarding before viewing recommendations."));
		}

		// 2. Parse query filters
		const filters = {
			page: Math.max(1, parseInt(req.query.page) || 1),
			limit: Math.min(50, Math.max(1, parseInt(req.query.limit) || 20)),
			skills: req.query.skills ? req.query.skills.split(",").map(s => s.trim().toLowerCase()) : null,
			issueType: req.query.issueType || null,
			difficulty: req.query.difficulty || null,
			repoScale: req.query.repoScale || null,
			minMatchScore: parseFloat(req.query.minMatchScore) || 0.1,
			sort: req.query.sort || "relevance",
		};

		// 3. Check cache
		const cached = issueCache.get(userId, filters);
		if (cached) {
			return res.status(200).json({
				success: true,
				data: cached,
				cached: true,
			});
		}

		// 4. Build user skill vector
		const userVector = buildSkillVector(user.onboardingData);
		
		// Unverified users get unpersonalized issues sorted by newest
		const isVerified = !!user.githubUsername;
		if (!isVerified) {
			userVector.skills = {};
			filters.sort = "newest";
			filters.minMatchScore = 0;
		}

		// 5. Build MongoDB query for pre-filtering
		const mongoFilter = buildMongoFilter(filters, userVector);

		// 6. Fetch enriched issues from DB
		let enrichedIssues = await EnrichedIssue.find(mongoFilter)
			.sort({ enrichedAt: -1 })
			.limit(500) // Cap for performance
			.lean();

		// 7. If no issues in DB, trigger a quick ingestion
		if (enrichedIssues.length === 0) {
			console.log("[ISSUES] No enriched issues found. Triggering quick ingestion...");
			await ingestIssues({ perPage: 15 });
			enrichedIssues = await EnrichedIssue.find(mongoFilter)
				.sort({ enrichedAt: -1 })
				.limit(500)
				.lean();
		}

		// 8. Fetch user feedback for personalization
		const feedbackDocs = await IssueFeedback.find({ userId }).lean();
		const feedbackMap = new Map();
		for (const fb of feedbackDocs) {
			if (!feedbackMap.has(fb.issueId)) {
				feedbackMap.set(fb.issueId, { actions: [] });
			}
			feedbackMap.get(fb.issueId).actions.push(fb.action);
		}

		// 9. Rank issues
		let ranked = rankIssuesForUser(userVector, enrichedIssues, feedbackMap);

		// 10. Apply minimum match score filter
		ranked = ranked.filter(r => r.matchScore.overall >= filters.minMatchScore);

		// 11. Apply sort
		if (filters.sort === "newest") {
			ranked.sort((a, b) => new Date(b.issue.issueCreatedAt) - new Date(a.issue.issueCreatedAt));
		} else if (filters.sort === "difficulty_asc") {
			ranked.sort((a, b) => (a.issue.skillProfile?.difficultyScore || 0) - (b.issue.skillProfile?.difficultyScore || 0));
		}
		// "relevance" is already the default sort from rankIssuesForUser

		// 12. Paginate
		const total = ranked.length;
		const totalPages = Math.ceil(total / filters.limit);
		const start = (filters.page - 1) * filters.limit;
		const paginatedIssues = ranked.slice(start, start + filters.limit);

		// 13. Build response
		const responseData = {
			issues: paginatedIssues,
			pagination: {
				page: filters.page,
				limit: filters.limit,
				total,
				totalPages,
			},
			userProfile: {
				skills: Object.keys(userVector.skills),
				seniorityTier: userVector.meta.seniorityTier,
				preferredIssueTypes: userVector.meta.preferredIssueTypes,
				preferredRepoScale: userVector.meta.preferredRepoScale,
			},
			meta: {
				cachedAt: new Date().toISOString(),
				totalIssuesIndexed: await getIssueCount(),
			},
		};

		// 14. Cache the result
		issueCache.set(userId, filters, responseData);

		return res.status(200).json({
			success: true,
			data: responseData,
			cached: false,
		});
	} catch (error) {
		console.error("[ISSUES] Error in getRecommended:", error.message);
		return next(error);
	}
};

/**
 * GET /api/issues/:githubId
 * Returns a single enriched issue with match score for current user.
 */
export const getIssueById = async (req, res, next) => {
	try {
		const { githubId } = req.params;
		const userId = req.user.id;

		const issue = await EnrichedIssue.findOne({ githubId: parseInt(githubId) }).lean();
		if (!issue) {
			return next(errorHandler(404, "Issue not found"));
		}

		const user = await User.findById(userId);
		let matchData = null;

		if (user && user.onboardingData) {
			const userVector = buildSkillVector(user.onboardingData);
			const feedbackDocs = await IssueFeedback.find({ userId, issueId: parseInt(githubId) }).lean();
			const feedbackMap = new Map();
			if (feedbackDocs.length > 0) {
				feedbackMap.set(parseInt(githubId), {
					actions: feedbackDocs.map(f => f.action),
				});
			}

			const [ranked] = rankIssuesForUser(userVector, [issue], feedbackMap);
			matchData = ranked || null;
		}

		return res.status(200).json({
			success: true,
			data: matchData || { issue },
		});
	} catch (error) {
		return next(error);
	}
};

/**
 * POST /api/issues/feedback
 * Records user interaction with a recommended issue.
 */
export const submitFeedback = async (req, res, next) => {
	try {
		const userId = req.user.id;
		const { issueId, action, matchScore } = req.body;

		if (!issueId || !action) {
			return next(errorHandler(400, "issueId and action are required"));
		}

		const validActions = ["click", "save", "hide", "open_github", "complete"];
		if (!validActions.includes(action)) {
			return next(errorHandler(400, `Invalid action. Must be one of: ${validActions.join(", ")}`));
		}

		// Upsert feedback (only one entry per user+issue+action)
		await IssueFeedback.findOneAndUpdate(
			{ userId, issueId, action },
			{
				$set: {
					userId,
					issueId,
					action,
					matchScore: matchScore || null,
				},
			},
			{ upsert: true, new: true }
		);

		// Invalidate user cache so next request reflects feedback
		issueCache.invalidateUser(userId);

		return res.status(200).json({
			success: true,
			message: "Feedback recorded",
		});
	} catch (error) {
		if (error.code === 11000) {
			// Duplicate — already recorded
			return res.status(200).json({ success: true, message: "Feedback already recorded" });
		}
		return next(error);
	}
};

/**
 * POST /api/issues/reindex
 * Triggers a re-ingestion of GitHub issues. Admin-only in production.
 */
export const reindexIssues = async (req, res, next) => {
	try {
		const { force } = req.body;

		// Check if we have enough issues already (skip if not forced)
		if (!force) {
			const count = await getIssueCount();
			if (count > 50) {
				return res.status(200).json({
					success: true,
					message: `Index already has ${count} issues. Use force=true to reindex.`,
					count,
				});
			}
		}

		// Run ingestion (this is async but we await it for the response)
		console.log("[ISSUES] Reindex triggered");
		const result = await ingestIssues({ perPage: 20 });

		// Invalidate all caches
		issueCache.invalidateAll();

		return res.status(200).json({
			success: true,
			message: "Reindex completed",
			result,
			totalIndexed: await getIssueCount(),
		});
	} catch (error) {
		console.error("[ISSUES] Reindex error:", error.message);
		return next(error);
	}
};

// ─── Helper: Build MongoDB pre-filter query ───

function buildMongoFilter(filters, userVector) {
	const query = {
		state: "open",
		isStale: false,
	};

	// Filter by specific skills if requested
	if (filters.skills && filters.skills.length > 0) {
		query["skillProfile.requiredSkills.skill"] = { $in: filters.skills };
	} else {
		// Pre-filter to issues that match at least one user skill
		const userSkillKeys = Object.keys(userVector.skills);
		if (userSkillKeys.length > 0) {
			query["skillProfile.requiredSkills.skill"] = { $in: userSkillKeys };
		}
	}

	// Filter by issue type
	if (filters.issueType) {
		query["skillProfile.issueType"] = filters.issueType;
	}

	// Filter by difficulty
	if (filters.difficulty) {
		query["skillProfile.difficulty"] = filters.difficulty;
	}

	// Filter by repo scale
	if (filters.repoScale) {
		query["repo.scale"] = filters.repoScale;
	}

	return query;
}
