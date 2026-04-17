/**
 * IssueIngestionService
 * Fetches issues from GitHub Search API, enriches them with repo metadata
 * and skill profiles, then upserts into MongoDB.
 */

import EnrichedIssue from "../models/enrichedIssue.model.js";
import { buildIssueSkillProfile, loadTaxonomy } from "./skillExtraction.service.js";

const GITHUB_API = "https://api.github.com";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";

// ─── Rate limit state ───
let rateLimitRemaining = 60;
let rateLimitReset = 0;

/**
 * Build GitHub API request headers.
 */
function getHeaders() {
	const headers = {
		Accept: "application/vnd.github.v3+json",
		"User-Agent": "GitMatch-IssueBot",
	};
	if (GITHUB_TOKEN) {
		headers.Authorization = `token ${GITHUB_TOKEN}`;
	}
	return headers;
}

/**
 * Make a GitHub API request with rate-limit awareness.
 */
async function githubFetch(url) {
	// Check if we're rate limited
	if (rateLimitRemaining <= 1 && Date.now() / 1000 < rateLimitReset) {
		console.warn("[INGESTION] Rate limit reached, skipping request");
		return null;
	}

	try {
		const response = await fetch(url, { headers: getHeaders() });

		// Update rate limit tracking
		rateLimitRemaining = parseInt(response.headers.get("x-ratelimit-remaining") || "60", 10);
		rateLimitReset = parseInt(response.headers.get("x-ratelimit-reset") || "0", 10);

		if (response.status === 403 || response.status === 429) {
			console.warn(`[INGESTION] Rate limited. Remaining: ${rateLimitRemaining}. Reset at: ${new Date(rateLimitReset * 1000).toISOString()}`);
			return null;
		}

		if (!response.ok) {
			console.error(`[INGESTION] GitHub API error: ${response.status} for ${url}`);
			return null;
		}

		return await response.json();
	} catch (err) {
		console.error(`[INGESTION] Fetch error: ${err.message}`);
		return null;
	}
}

/**
 * Determines repo scale based on stars and contributor count.
 */
function classifyRepoScale(stars, forks) {
	if (stars > 1000 || forks > 200) return "large";
	if (stars > 50 || forks > 10) return "medium";
	return "small";
}

/**
 * Fetch repo metadata from GitHub (cached per repo for the session).
 */
const repoCache = new Map();

async function fetchRepoMetadata(repoFullName) {
	if (repoCache.has(repoFullName)) {
		return repoCache.get(repoFullName);
	}

	const data = await githubFetch(`${GITHUB_API}/repos/${repoFullName}`);
	if (!data) return null;

	const repoMeta = {
		fullName: data.full_name,
		owner: data.owner?.login,
		name: data.name,
		stars: data.stargazers_count || 0,
		forks: data.forks_count || 0,
		language: data.language || "",
		languages: data.language ? [data.language] : [],
		topics: data.topics || [],
		openIssues: data.open_issues_count || 0,
		contributors: 0, // would need a separate API call
		hasContribGuide: false, // would need contents API
		license: data.license?.spdx_id || "",
		scale: classifyRepoScale(data.stargazers_count || 0, data.forks_count || 0),
	};

	repoCache.set(repoFullName, repoMeta);
	return repoMeta;
}

/**
 * Check if an issue should be filtered out (low quality / irrelevant).
 */
function shouldFilterIssue(item, repoData) {
	// Skip pull requests
	if (item.pull_request) return true;

	// Skip locked issues
	if (item.locked) return true;

	// Skip issues with too many assignees
	if (item.assignees && item.assignees.length > 5) return true;

	// Skip repos with < 5 stars (likely personal/spam)
	if (repoData && repoData.stars < 5) return true;

	// Skip if title is suspiciously short
	if (!item.title || item.title.length < 5) return true;

	return false;
}

/**
 * Process a single GitHub search result into an enriched issue.
 */
async function processIssue(item) {
	const repoFullName = item.repository_url?.split("/").slice(-2).join("/");
	if (!repoFullName) return null;

	// Fetch repo metadata
	const repoData = await fetchRepoMetadata(repoFullName);
	if (!repoData) return null;

	// Quality filter
	if (shouldFilterIssue(item, repoData)) return null;

	// Build skill profile
	const skillProfile = buildIssueSkillProfile(
		{
			title: item.title,
			body: (item.body || "").slice(0, 2000),
			labels: item.labels || [],
			comments: item.comments || 0,
		},
		repoData
	);

	return {
		githubId: item.id,
		number: item.number,
		title: item.title,
		body: (item.body || "").slice(0, 2000),
		htmlUrl: item.html_url,
		state: item.state || "open",
		issueCreatedAt: item.created_at ? new Date(item.created_at) : new Date(),
		issueUpdatedAt: item.updated_at ? new Date(item.updated_at) : new Date(),
		repo: repoData,
		labels: (item.labels || []).map((l) => ({
			name: l.name,
			color: l.color,
		})),
		comments: item.comments || 0,
		assignees: item.assignees?.length || 0,
		isPR: false,
		skillProfile,
		enrichedAt: new Date(),
		enrichmentVersion: 1,
		isStale: false,
	};
}

/**
 * Fetch and ingest issues for a set of search queries.
 *
 * @param {Object} options
 * @param {string[]} options.languages - Languages to search for
 * @param {string[]} options.labels - Labels to search for
 * @param {number} options.perPage - Results per page (max 30)
 * @returns {{ ingested: number, skipped: number, errors: number }}
 */
export async function ingestIssues(options = {}) {
	const {
		languages = ["javascript", "python", "typescript", "go", "rust", "java", "c#", "php"],
		labels = ["good first issue", "help wanted"],
		perPage = 20,
	} = options;

	// Ensure taxonomy is loaded
	await loadTaxonomy();

	let ingested = 0;
	let skipped = 0;
	let errors = 0;

	for (const lang of languages) {
		for (const label of labels) {
			// Build search query
			const q = encodeURIComponent(
				`language:${lang} is:issue is:open label:"${label}"`
			);
			const url = `${GITHUB_API}/search/issues?q=${q}&sort=created&order=desc&per_page=${perPage}`;

			console.log(`[INGESTION] Fetching: lang=${lang}, label="${label}"`);

			const data = await githubFetch(url);
			if (!data || !data.items) {
				console.warn(`[INGESTION] No data for lang=${lang}, label="${label}"`);
				continue;
			}

			console.log(`[INGESTION] Processing ${data.items.length} items for lang=${lang}`);

			for (const item of data.items) {
				try {
					const enriched = await processIssue(item);
					if (!enriched) {
						skipped++;
						continue;
					}

					// Upsert by githubId
					await EnrichedIssue.findOneAndUpdate(
						{ githubId: enriched.githubId },
						{ $set: enriched },
						{ upsert: true, new: true }
					);
					ingested++;
				} catch (err) {
					// Handle duplicate key or other errors gracefully
					if (err.code === 11000) {
						skipped++;
					} else {
						console.error(`[INGESTION] Error processing issue ${item?.id}: ${err.message}`);
						errors++;
					}
				}
			}

			// Rate limit courtesy: small delay between queries
			await new Promise((r) => setTimeout(r, 500));
		}
	}

	// Mark old issues as stale
	const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
	await EnrichedIssue.updateMany(
		{ issueUpdatedAt: { $lt: thirtyDaysAgo }, isStale: false },
		{ $set: { isStale: true } }
	);

	console.log(`[INGESTION] ✓ Done. Ingested: ${ingested}, Skipped: ${skipped}, Errors: ${errors}`);
	return { ingested, skipped, errors };
}

/**
 * Get count of enriched issues in the database.
 */
export async function getIssueCount() {
	return EnrichedIssue.countDocuments({ state: "open", isStale: false });
}

/**
 * Clear the repo metadata cache (useful after reindex).
 */
export function clearRepoCache() {
	repoCache.clear();
}

export default { ingestIssues, getIssueCount, clearRepoCache };
