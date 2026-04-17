import mongoose from "mongoose";

const enrichedIssueSchema = new mongoose.Schema(
	{
		// ─── Identity ───
		githubId: { type: Number, required: true, unique: true, index: true },
		number: Number,
		title: { type: String, required: true },
		body: { type: String, default: "" }, // truncated to 2000 chars
		htmlUrl: { type: String, required: true },
		state: { type: String, default: "open" },
		issueCreatedAt: Date,
		issueUpdatedAt: Date,

		// ─── Repository Context ───
		repo: {
			fullName: { type: String, index: true },
			owner: String,
			name: String,
			stars: { type: Number, default: 0 },
			forks: { type: Number, default: 0 },
			language: String,
			languages: [String],
			topics: [String],
			openIssues: { type: Number, default: 0 },
			contributors: { type: Number, default: 0 },
			hasContribGuide: { type: Boolean, default: false },
			license: String,
			scale: {
				type: String,
				enum: ["small", "medium", "large"],
				default: "medium",
			},
		},

		// ─── Labels & Metadata ───
		labels: [{ name: String, color: String }],
		comments: { type: Number, default: 0 },
		assignees: { type: Number, default: 0 },
		isPR: { type: Boolean, default: false },

		// ─── Extracted Skill Profile ───
		skillProfile: {
			requiredSkills: [
				{
					skill: String,
					weight: { type: Number, default: 0.5 },
					source: {
						type: String,
						enum: [
							"label",
							"title",
							"body",
							"repo_language",
							"repo_topic",
						],
						default: "label",
					},
				},
			],
			issueType: {
				type: String,
				enum: ["bug", "feature", "docs", "optimization", "other"],
				default: "other",
			},
			difficulty: {
				type: String,
				enum: ["beginner", "intermediate", "advanced"],
				default: "intermediate",
			},
			difficultyScore: { type: Number, min: 0, max: 1, default: 0.5 },
			estimatedHours: { type: Number, default: 5 },
		},

		// ─── Enrichment Metadata ───
		enrichedAt: { type: Date, default: Date.now },
		enrichmentVersion: { type: Number, default: 1 },
		isStale: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

// ─── Compound Indexes for efficient querying ───
enrichedIssueSchema.index({ "skillProfile.requiredSkills.skill": 1 });
enrichedIssueSchema.index({
	"repo.scale": 1,
	"skillProfile.difficulty": 1,
});
enrichedIssueSchema.index({ "skillProfile.issueType": 1 });
enrichedIssueSchema.index({ enrichedAt: 1 });
enrichedIssueSchema.index({ state: 1, isStale: 1 });

const EnrichedIssue = mongoose.model("EnrichedIssue", enrichedIssueSchema);

export default EnrichedIssue;
