/**
 * UserProfileService
 * Builds a normalized skill vector from the user's onboardingData.
 * This is the single source of truth for what a user "knows".
 */

// ─── Mapping: onboarding option values → canonical skill tokens ───
const PRIMARY_LANGUAGE_MAP = {
	"JavaScript/TypeScript": ["javascript", "typescript"],
	Python: ["python"],
	Rust: ["rust"],
	Go: ["go"],
	Java: ["java"],
	"C#": ["csharp"],
	PHP: ["php"],
	Other: [],
};

const SKILL_MAP = {
	React: ["react", "javascript", "jsx"],
	"Node.js": ["nodejs", "javascript"],
	Vue: ["vue", "javascript"],
	Angular: ["angular", "typescript"],
	"Next.js": ["nextjs", "react", "javascript"],
	Django: ["django", "python"],
	Spring: ["spring", "java"],
	TensorFlow: ["tensorflow", "python", "ml"],
	Docker: ["docker", "devops"],
	Firebase: ["firebase", "nosql"],
	Tailwind: ["tailwindcss", "css"],
	"Tailwind CSS": ["tailwindcss", "css"],
	Python: ["python"],
	FastAPI: ["fastapi", "python"],
	Rust: ["rust"],
	PostgreSQL: ["postgresql", "sql"],
	AWS: ["aws", "cloud"],
	"ML/AI": ["ml", "ai", "python"],
	Solidity: ["solidity", "blockchain", "ethereum"],
	DevOps: ["devops", "ci_cd"],
};

const EXPERIENCE_TIERS = {
	"0-1": 0, // beginner
	"1-3": 1, // junior
	"3-5": 2, // mid
	"5+": 3, // senior
};

const AVAILABILITY_MIDPOINTS = {
	"< 5": 3,
	"5–10": 7,
	"10–20": 15,
	"20+": 25,
};

const ACTIVITY_LEVELS = {
	Rarely: 1,
	Occasionally: 2,
	Weekly: 3,
	Daily: 4,
};

const ISSUE_TYPE_MAP = {
	"Bug fixes": "bug",
	"Feature requests": "feature",
	Documentation: "docs",
	Optimization: "optimization",
};

const REPO_SCALE_MAP = {
	"Small (solo / indie)": "small",
	"Medium (3-10 contributors)": "medium",
	"Large (OSS)": "large",
};

const WORK_STYLE_MAP = {
	"Fast & iterative": "fast_iterative",
	"Slow & stable": "slow_stable",
	"Deadline focused": "deadline_focused",
	"Research / experimental": "research_experimental",
};

/**
 * Build a complete user skill vector from onboarding data.
 *
 * @param {Object} onboardingData - The user's onboardingData from MongoDB
 * @returns {{ skills: Object, meta: Object }}
 */
export function buildSkillVector(onboardingData) {
	const data = onboardingData || {};
	const skills = {};

	const isVerified =
		data.skillVerificationChoice &&
		data.skillVerificationChoice !== "No tests for now";
	const verificationBoost = isVerified ? 1.15 : 1.0;

	// 1. Primary language → weight 1.0, confidence 0.95
	const primaryTokens = PRIMARY_LANGUAGE_MAP[data.primaryLanguage] || [];
	for (const token of primaryTokens) {
		addSkill(skills, token, 1.0, "primaryLanguage", 0.95 * (token === primaryTokens[0] ? 1.0 : 0.8), verificationBoost);
	}

	// 2. Core skills → weight 0.85, confidence 0.90
	const coreSkills = data.coreSkills || [];
	for (const skill of coreSkills) {
		const tokens = SKILL_MAP[skill] || [skill.toLowerCase()];
		for (const token of tokens) {
			addSkill(skills, token, 0.85, "coreSkills", 0.9, verificationBoost);
		}
	}

	// 3. Secondary languages/frameworks → weight 0.60, confidence 0.70
	const secondary = data.secondaryLanguages || [];
	for (const lang of secondary) {
		const tokens = SKILL_MAP[lang] || [lang.toLowerCase()];
		for (const token of tokens) {
			addSkill(skills, token, 0.6, "secondaryLanguages", 0.7, verificationBoost);
		}
	}

	// Build metadata
	const meta = {
		seniorityTier: EXPERIENCE_TIERS[data.experienceYears] ?? 0,
		availabilityHours: AVAILABILITY_MIDPOINTS[data.weeklyAvailability] ?? 10,
		preferredIssueTypes: (data.preferredIssueTypes || []).map(
			(t) => ISSUE_TYPE_MAP[t] || t.toLowerCase()
		),
		preferredRepoScale:
			REPO_SCALE_MAP[data.preferredRepoScale] || "medium",
		preferredTeamSize: data.preferredTeamSize || "3–5",
		preferredCommunication: data.preferredCommunication || "Async (text / GitHub)",
		workStyle: WORK_STYLE_MAP[data.workStyle] || "fast_iterative",
		accountType: (data.accountType || "Student").toLowerCase(),
		hasGithub: !!(data.githubUsername && data.githubUsername.trim()),
		githubUsername: data.githubUsername || "",
		skillVerified: isVerified,
		timezone: data.timezone || "UTC",
		githubActivityLevel: ACTIVITY_LEVELS[data.githubActivityLevel] ?? 2,
	};

	return { skills, meta };
}

/**
 * Add or update a skill in the skill map.
 * If the skill already exists, keep the higher weight.
 */
function addSkill(skills, token, weight, source, confidence, verificationBoost) {
	const adjustedConfidence = Math.min(1.0, confidence * verificationBoost);

	if (!skills[token]) {
		skills[token] = { weight, source, confidence: adjustedConfidence };
	} else {
		// Keep the higher weight, highest confidence
		if (weight > skills[token].weight) {
			skills[token].weight = weight;
			skills[token].source = source;
		}
		skills[token].confidence = Math.max(
			skills[token].confidence,
			adjustedConfidence
		);
	}
}

/**
 * Get the default ecosystem skills for a language (cold-start fallback).
 */
export function getEcosystemDefaults(primaryLanguage) {
	const defaults = {
		"JavaScript/TypeScript": ["react", "nodejs", "css", "html"],
		Python: ["django", "fastapi", "sql"],
		Rust: ["systems", "wasm"],
		Go: ["docker", "devops"],
		Java: ["spring", "sql"],
		"C#": ["dotnet", "sql"],
		PHP: ["sql", "html", "css"],
	};
	return defaults[primaryLanguage] || ["javascript", "html", "css"];
}

export default { buildSkillVector, getEcosystemDefaults };
