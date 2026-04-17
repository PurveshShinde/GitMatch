/**
 * SkillExtractionService
 * Extracts and normalizes skill tokens from issue text, labels, and repo metadata.
 * Maps everything through a canonical taxonomy for consistent matching.
 */

import SkillTaxonomy from "../models/skillTaxonomy.model.js";

// ─── In-memory taxonomy cache (loaded once from MongoDB) ───
let taxonomyCache = null;
let aliasMap = null; // alias → canonical

/**
 * Load taxonomy from MongoDB into memory.
 * Call this on server startup.
 */
export async function loadTaxonomy() {
	const docs = await SkillTaxonomy.find().lean();
	taxonomyCache = {};
	aliasMap = {};

	for (const doc of docs) {
		taxonomyCache[doc.canonical] = doc;
		// Map each alias to its canonical name
		for (const alias of doc.aliases || []) {
			aliasMap[alias.toLowerCase()] = doc.canonical;
		}
		// Also map the canonical itself
		aliasMap[doc.canonical] = doc.canonical;
	}

	console.log(`[SKILL EXTRACTION] ✓ Loaded ${docs.length} taxonomy entries`);
	return { taxonomyCache, aliasMap };
}

/**
 * Resolve a raw text token to its canonical skill name.
 * Returns null if not found in taxonomy.
 */
export function resolveToCanonical(rawToken) {
	if (!aliasMap) return null;
	const cleaned = rawToken.toLowerCase().trim().replace(/[^a-z0-9/.#+_-]/g, "");
	return aliasMap[cleaned] || null;
}

// ─── Stopwords for title/body parsing ───
const STOPWORDS = new Set([
	"fix", "add", "update", "remove", "the", "is", "a", "an", "in", "on",
	"for", "to", "of", "and", "or", "not", "with", "from", "by", "this",
	"that", "it", "be", "as", "at", "was", "are", "do", "does", "did",
	"has", "have", "had", "will", "would", "could", "should", "can",
	"may", "might", "must", "shall", "need", "use", "using", "used",
	"new", "bug", "issue", "error", "feature", "request", "support",
	"change", "changes", "create", "delete", "implement", "move", "make",
	"when", "where", "how", "what", "which", "who", "all", "each",
	"every", "some", "any", "no", "only", "just", "also", "than",
	"then", "now", "up", "out", "so", "if", "but", "about", "into",
	"after", "before", "between", "under", "over", "more", "less",
	"very", "too", "other", "another", "like", "get", "set",
]);

/**
 * Extract skill tokens from a text string (title or body).
 *
 * @param {string} text - Raw text to extract from
 * @param {string} source - Source label ("title" | "body")
 * @param {number} baseWeight - Base weight for extracted skills
 * @returns {Array<{ skill: string, weight: number, source: string }>}
 */
export function extractSkillsFromText(text, source, baseWeight) {
	if (!text || !aliasMap) return [];

	const found = [];
	const seen = new Set();

	// 1. Try multi-word matches first (e.g., "machine learning", "ruby on rails")
	const lowerText = text.toLowerCase();
	if (taxonomyCache) {
		for (const [canonical, entry] of Object.entries(taxonomyCache)) {
			for (const alias of entry.aliases || []) {
				if (alias.includes(" ") && lowerText.includes(alias) && !seen.has(canonical)) {
					found.push({ skill: canonical, weight: baseWeight, source });
					seen.add(canonical);
				}
			}
		}
	}

	// 2. Single-token matches
	const tokens = text
		.toLowerCase()
		.replace(/[^a-z0-9/.#+_\s-]/g, " ")
		.split(/\s+/)
		.filter((t) => t.length > 1 && !STOPWORDS.has(t));

	for (const token of tokens) {
		const canonical = resolveToCanonical(token);
		if (canonical && !seen.has(canonical)) {
			found.push({ skill: canonical, weight: baseWeight, source });
			seen.add(canonical);
		}
	}

	return found;
}

/**
 * Extract skills from GitHub issue labels.
 *
 * @param {Array<{ name: string }>} labels
 * @returns {{ skills: Array, issueType: string, difficulty: string, difficultyScore: number }}
 */
export function extractFromLabels(labels) {
	const skills = [];
	let issueType = "other";
	let difficulty = "intermediate";
	let difficultyScore = 0.5;
	const seen = new Set();

	for (const label of labels || []) {
		const name = (label.name || "").toLowerCase().trim();

		// Issue type detection
		if (name.includes("bug") || name === "type: bug") {
			issueType = "bug";
		} else if (
			name.includes("enhancement") ||
			name.includes("feature") ||
			name === "type: feature"
		) {
			issueType = "feature";
		} else if (
			name.includes("documentation") ||
			name.includes("docs")
		) {
			issueType = "docs";
		} else if (
			name.includes("performance") ||
			name.includes("optimization")
		) {
			issueType = "optimization";
		}

		// Difficulty detection
		if (
			name.includes("good first issue") ||
			name.includes("beginner") ||
			name.includes("easy") ||
			name.includes("starter") ||
			name.includes("first-timers-only") ||
			name.includes("good-first-issue")
		) {
			difficulty = "beginner";
			difficultyScore = 0.15;
		} else if (
			name.includes("intermediate") ||
			name.includes("medium")
		) {
			difficulty = "intermediate";
			difficultyScore = 0.5;
		} else if (
			name.includes("advanced") ||
			name.includes("hard") ||
			name.includes("complex") ||
			name.includes("expert")
		) {
			difficulty = "advanced";
			difficultyScore = 0.85;
		}

		// Skill extraction from label
		const canonical = resolveToCanonical(name);
		if (canonical && !seen.has(canonical)) {
			skills.push({ skill: canonical, weight: 0.8, source: "label" });
			seen.add(canonical);
		}

		// Also try extracting multi-word from label
		const extracted = extractSkillsFromText(name, "label", 0.7);
		for (const s of extracted) {
			if (!seen.has(s.skill)) {
				skills.push(s);
				seen.add(s.skill);
			}
		}
	}

	return { skills, issueType, difficulty, difficultyScore };
}

/**
 * Extract skills from repository metadata.
 *
 * @param {Object} repoData - { language, languages, topics }
 * @returns {Array<{ skill: string, weight: number, source: string }>}
 */
export function extractFromRepo(repoData) {
	const skills = [];
	const seen = new Set();

	// Primary language
	if (repoData.language) {
		const canonical = resolveToCanonical(repoData.language);
		if (canonical && !seen.has(canonical)) {
			skills.push({ skill: canonical, weight: 0.9, source: "repo_language" });
			seen.add(canonical);
		}
	}

	// Additional languages
	for (const lang of repoData.languages || []) {
		const canonical = resolveToCanonical(lang);
		if (canonical && !seen.has(canonical)) {
			skills.push({ skill: canonical, weight: 0.5, source: "repo_language" });
			seen.add(canonical);
		}
	}

	// Topics
	for (const topic of repoData.topics || []) {
		const canonical = resolveToCanonical(topic);
		if (canonical && !seen.has(canonical)) {
			skills.push({ skill: canonical, weight: 0.7, source: "repo_topic" });
			seen.add(canonical);
		}
	}

	return skills;
}

/**
 * Estimate issue difficulty from heuristics when no explicit label exists.
 *
 * @param {Object} issue - { comments, body, labels }
 * @returns {{ difficulty: string, difficultyScore: number }}
 */
export function estimateDifficulty(issue) {
	const bodyLen = (issue.body || "").length;
	const commentCount = issue.comments || 0;

	if (commentCount <= 2 && bodyLen < 500) {
		return { difficulty: "beginner", difficultyScore: 0.25 };
	} else if (commentCount <= 10) {
		return { difficulty: "intermediate", difficultyScore: 0.5 };
	} else {
		return { difficulty: "advanced", difficultyScore: 0.75 };
	}
}

/**
 * Estimate hours required based on difficulty.
 */
export function estimateHours(difficulty) {
	switch (difficulty) {
		case "beginner":
			return 3;
		case "intermediate":
			return 10;
		case "advanced":
			return 25;
		default:
			return 5;
	}
}

/**
 * Build the complete skill profile for an issue.
 *
 * @param {Object} issue - GitHub issue data
 * @param {Object} repoData - Repository metadata
 * @returns {Object} Skill profile
 */
export function buildIssueSkillProfile(issue, repoData) {
	const allSkills = [];
	const seen = new Set();

	// 1. Label-based extraction
	const labelResult = extractFromLabels(issue.labels);
	for (const s of labelResult.skills) {
		if (!seen.has(s.skill)) {
			allSkills.push(s);
			seen.add(s.skill);
		}
	}

	// 2. Title-based extraction
	const titleSkills = extractSkillsFromText(issue.title, "title", 0.6);
	for (const s of titleSkills) {
		if (!seen.has(s.skill)) {
			allSkills.push(s);
			seen.add(s.skill);
		}
	}

	// 3. Body-based extraction (limited)
	const bodyText = (issue.body || "").slice(0, 2000);
	const bodySkills = extractSkillsFromText(bodyText, "body", 0.3);
	for (const s of bodySkills) {
		if (!seen.has(s.skill)) {
			allSkills.push(s);
			seen.add(s.skill);
		}
	}

	// 4. Repo-based extraction
	const repoSkills = extractFromRepo(repoData);
	for (const s of repoSkills) {
		if (!seen.has(s.skill)) {
			allSkills.push(s);
			seen.add(s.skill);
		}
	}

	// Determine difficulty
	let { difficulty, difficultyScore } = labelResult;
	const hasExplicitDifficulty = difficultyScore !== 0.5;
	if (!hasExplicitDifficulty) {
		const estimated = estimateDifficulty(issue);
		difficulty = estimated.difficulty;
		difficultyScore = estimated.difficultyScore;
	}

	return {
		requiredSkills: allSkills,
		issueType: labelResult.issueType,
		difficulty,
		difficultyScore,
		estimatedHours: estimateHours(difficulty),
	};
}

export default {
	loadTaxonomy,
	resolveToCanonical,
	extractSkillsFromText,
	extractFromLabels,
	extractFromRepo,
	estimateDifficulty,
	estimateHours,
	buildIssueSkillProfile,
};
