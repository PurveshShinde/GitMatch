/**
 * IssueMatchingService
 * The core ranking engine. Computes multi-signal similarity between
 * a user's skill vector and each enriched issue.
 */

/**
 * Rank enriched issues against a user's skill vector.
 *
 * @param {{ skills: Object, meta: Object }} userVector
 * @param {Array} enrichedIssues - Array of enriched issue documents
 * @param {Map} feedbackMap - Map of issueId → { actions: string[] }
 * @returns {Array<{ issue, matchScore, explanation }>} Ranked results
 */
export function rankIssuesForUser(userVector, enrichedIssues, feedbackMap = new Map()) {
	const scored = [];

	for (const issue of enrichedIssues) {
		// Skip issues the user has hidden
		const feedback = feedbackMap.get(issue.githubId);
		if (feedback && feedback.actions.includes("hide")) continue;

		const result = scoreIssue(userVector, issue, feedback);
		if (result.matchScore.overall >= 0.05) {
			scored.push(result);
		}
	}

	// Sort by overall score descending, then apply tie-breakers
	scored.sort((a, b) => {
		const diff = b.matchScore.overall - a.matchScore.overall;
		if (Math.abs(diff) > 0.01) return diff;

		// Tie-breakers
		// 1. Prefer fewer assignees
		if (a.issue.assignees !== b.issue.assignees) {
			return a.issue.assignees - b.issue.assignees;
		}
		// 2. Prefer newer issues
		const dateA = new Date(a.issue.issueCreatedAt || 0).getTime();
		const dateB = new Date(b.issue.issueCreatedAt || 0).getTime();
		return dateB - dateA;
	});

	return scored;
}

/**
 * Score a single issue against the user vector.
 */
function scoreIssue(userVector, issue, feedback) {
	const skillMatch = computeSkillMatch(userVector.skills, issue.skillProfile?.requiredSkills || []);
	const difficultyFit = computeDifficultyFit(userVector.meta.seniorityTier, issue.skillProfile?.difficultyScore ?? 0.5);
	const issueTypeFit = computeIssueTypeFit(userVector.meta.preferredIssueTypes, issue.skillProfile?.issueType);
	const repoScaleFit = computeRepoScaleFit(userVector.meta.preferredRepoScale, issue.repo?.scale);
	const availabilityFit = computeAvailabilityFit(userVector.meta.availabilityHours, issue.skillProfile?.estimatedHours ?? 5);
	const activityFit = computeActivityFit(userVector.meta.githubActivityLevel, issue.repo);
	const collaborationFit = computeCollaborationFit(userVector.meta, issue.repo);

	// Dynamic weights based on data availability
	const weights = userVector.meta.hasGithub
		? { skill: 0.35, difficulty: 0.20, type: 0.15, scale: 0.10, avail: 0.08, activity: 0.07, collab: 0.05 }
		: { skill: 0.50, difficulty: 0.25, type: 0.15, scale: 0.10, avail: 0.00, activity: 0.00, collab: 0.00 };

	let overall =
		weights.skill * skillMatch +
		weights.difficulty * difficultyFit +
		weights.type * issueTypeFit +
		weights.scale * repoScaleFit +
		weights.avail * availabilityFit +
		weights.activity * activityFit +
		weights.collab * collaborationFit;

	// Confidence multiplier
	const matchedSkills = getMatchedSkills(userVector.skills, issue.skillProfile?.requiredSkills || []);
	const avgConfidence = matchedSkills.length > 0
		? matchedSkills.reduce((sum, s) => sum + (userVector.skills[s]?.confidence || 0.5), 0) / matchedSkills.length
		: 0.5;
	overall *= avgConfidence;

	// Penalties
	const penalties = computePenalties(issue, feedback);
	overall += penalties.total;
	overall = Math.max(0, Math.min(1, overall));

	// Build explanation
	const explanation = buildExplanation(matchedSkills, userVector, issue, {
		skillMatch, difficultyFit, issueTypeFit, repoScaleFit
	});

	return {
		issue: formatIssueForResponse(issue),
		matchScore: {
			overall: Math.round(overall * 100) / 100,
			breakdown: {
				skillMatch: round(skillMatch),
				difficultyFit: round(difficultyFit),
				issueTypeFit: round(issueTypeFit),
				repoScaleFit: round(repoScaleFit),
				availabilityFit: round(availabilityFit),
				activityFit: round(activityFit),
				collaborationFit: round(collaborationFit),
			},
			confidence: round(avgConfidence),
			penalties,
		},
		explanation,
	};
}

// ─── Individual Score Computations ───

function computeSkillMatch(userSkills, issueSkills) {
	if (!issueSkills || issueSkills.length === 0) return 0.3; // Default for untagged issues

	let matchSum = 0;
	let totalWeight = 0;

	for (const issueSkill of issueSkills) {
		const userSkill = userSkills[issueSkill.skill];
		totalWeight += issueSkill.weight;

		if (userSkill) {
			matchSum += userSkill.weight * issueSkill.weight;
		}
	}

	return totalWeight > 0 ? Math.min(1, matchSum / totalWeight) : 0.3;
}

function computeDifficultyFit(seniorityTier, difficultyScore) {
	// Map seniority tier to ideal difficulty score range
	const idealDifficulty = [0.15, 0.35, 0.55, 0.80][seniorityTier] || 0.35;
	const distance = Math.abs(idealDifficulty - difficultyScore);
	return Math.max(0, 1.0 - distance * 1.5);
}

function computeIssueTypeFit(preferredTypes, issueType) {
	if (!preferredTypes || preferredTypes.length === 0) return 0.7;
	if (!issueType || issueType === "other") return 0.5;
	return preferredTypes.includes(issueType) ? 1.0 : 0.4;
}

function computeRepoScaleFit(preferredScale, repoScale) {
	if (!preferredScale || !repoScale) return 0.6;
	if (preferredScale === repoScale) return 1.0;

	const scaleOrder = ["small", "medium", "large"];
	const prefIdx = scaleOrder.indexOf(preferredScale);
	const repoIdx = scaleOrder.indexOf(repoScale);
	return Math.abs(prefIdx - repoIdx) === 1 ? 0.6 : 0.3;
}

function computeAvailabilityFit(availableHours, estimatedHours) {
	if (!estimatedHours || !availableHours) return 0.7;
	const ratio = estimatedHours / availableHours;
	if (ratio <= 0.5) return 1.0;
	if (ratio <= 1.0) return 0.8;
	if (ratio <= 2.0) return 0.4;
	return 0.1;
}

function computeActivityFit(userActivityLevel, repo) {
	if (!userActivityLevel || !repo) return 0.6;
	// Estimate repo activity from open issues count
	const repoActivity = repo.openIssues > 100 ? 4 : repo.openIssues > 30 ? 3 : repo.openIssues > 5 ? 2 : 1;
	return Math.max(0, 1.0 - Math.abs(userActivityLevel - repoActivity) * 0.25);
}

function computeCollaborationFit(userMeta, repo) {
	if (!repo) return 0.5;

	let score = 0.5;

	// Team size fit: small repo → solo/pair, large repo → 6-10
	const scale = repo.scale || "medium";
	const teamSize = userMeta.preferredTeamSize || "3–5";

	if (scale === "small" && (teamSize === "Solo" || teamSize === "Pair")) score += 0.25;
	else if (scale === "medium" && (teamSize === "3–5" || teamSize === "Pair")) score += 0.25;
	else if (scale === "large" && (teamSize === "3–5" || teamSize === "6–10")) score += 0.25;

	// Check if repo likely supports async communication (most OSS does)
	if (userMeta.preferredCommunication?.includes("Async")) score += 0.15;

	return Math.min(1, score);
}

// ─── Penalty Computation ───

function computePenalties(issue, feedback) {
	const penalties = {
		staleness: 0,
		tooManyComments: 0,
		alreadyAssigned: 0,
		repeated: 0,
		total: 0,
	};

	// Staleness penalty
	if (issue.issueCreatedAt) {
		const daysSinceCreated = (Date.now() - new Date(issue.issueCreatedAt).getTime()) / (1000 * 60 * 60 * 24);
		if (daysSinceCreated > 180) penalties.staleness = -0.10;
		else if (daysSinceCreated > 60) penalties.staleness = -0.05;
	}

	// Too many comments
	if (issue.comments > 20) penalties.tooManyComments = -0.03;

	// Already assigned
	if (issue.assignees > 0) penalties.alreadyAssigned = -0.05;

	// Repeated view without interaction
	if (feedback && feedback.actions.includes("click") && !feedback.actions.includes("save") && !feedback.actions.includes("complete")) {
		penalties.repeated = -0.02;
	}

	penalties.total = penalties.staleness + penalties.tooManyComments + penalties.alreadyAssigned + penalties.repeated;
	return penalties;
}

// ─── Helper Functions ───

function getMatchedSkills(userSkills, issueSkills) {
	const matched = [];
	for (const issueSkill of issueSkills || []) {
		if (userSkills[issueSkill.skill]) {
			matched.push(issueSkill.skill);
		}
	}
	return matched;
}

function getMissingSkills(userSkills, issueSkills) {
	const missing = [];
	for (const issueSkill of issueSkills || []) {
		if (!userSkills[issueSkill.skill]) {
			missing.push(issueSkill.skill);
		}
	}
	return missing;
}

function buildExplanation(matchedSkills, userVector, issue, scores) {
	const reasons = [];

	// Skill match reason
	if (matchedSkills.length > 0) {
		const topSkills = matchedSkills.slice(0, 3).map(s => s.charAt(0).toUpperCase() + s.slice(1));
		reasons.push({
			icon: "skill",
			text: `Uses ${topSkills.join(", ")} – ${matchedSkills.length > 1 ? "your core skills" : "your skill"}`,
		});
	}

	// Difficulty reason
	const difficulty = issue.skillProfile?.difficulty || "intermediate";
	const experienceMap = { 0: "beginners", 1: "junior developers", 2: "mid-level developers", 3: "senior developers" };
	const expLabel = experienceMap[userVector.meta.seniorityTier] || "developers";
	if (scores.difficultyFit > 0.6) {
		reasons.push({
			icon: "difficulty",
			text: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} difficulty – good fit for ${expLabel}`,
		});
	}

	// Issue type reason
	const issueType = issue.skillProfile?.issueType;
	if (issueType && issueType !== "other" && scores.issueTypeFit >= 1.0) {
		const typeLabels = { bug: "Bug fix", feature: "Feature request", docs: "Documentation", optimization: "Optimization" };
		reasons.push({
			icon: "type",
			text: `${typeLabels[issueType] || issueType} – one of your preferred types`,
		});
	}

	// Repo scale reason
	if (scores.repoScaleFit > 0.6) {
		const scaleLabels = { small: "Small indie project", medium: "Medium-scale project", large: "Large OSS project" };
		reasons.push({
			icon: "scale",
			text: `${scaleLabels[issue.repo?.scale] || "Project"} – matches your preference`,
		});
	}

	// Primary reason summary
	const primaryReason = matchedSkills.length > 0
		? `Matches your ${matchedSkills.slice(0, 3).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" and ")} skills`
		: `Relevant to your ${userVector.meta.accountType} profile`;

	return {
		primaryReason,
		reasons,
		matchedSkills,
		missingSkills: getMissingSkills(userVector.skills, issue.skillProfile?.requiredSkills || []),
	};
}

function formatIssueForResponse(issue) {
	return {
		githubId: issue.githubId,
		number: issue.number,
		title: issue.title,
		htmlUrl: issue.htmlUrl,
		state: issue.state,
		issueCreatedAt: issue.issueCreatedAt,
		repo: {
			fullName: issue.repo?.fullName,
			stars: issue.repo?.stars,
			forks: issue.repo?.forks,
			language: issue.repo?.language,
			scale: issue.repo?.scale,
			license: issue.repo?.license,
		},
		labels: issue.labels,
		comments: issue.comments,
		assignees: issue.assignees,
		skillProfile: issue.skillProfile,
	};
}

function round(n) {
	return Math.round((n || 0) * 100) / 100;
}

export default { rankIssuesForUser };
