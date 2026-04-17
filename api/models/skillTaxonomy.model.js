import mongoose from "mongoose";

const skillTaxonomySchema = new mongoose.Schema(
	{
		canonical: { type: String, required: true, unique: true, lowercase: true },
		aliases: [{ type: String, lowercase: true }],
		category: String, // e.g. "language", "frontend_framework", "backend_framework", "devops", "database", "cloud"
		ecosystem: String, // e.g. "javascript", "python", "java"
		relatedTo: [{ type: String, lowercase: true }],
		difficultyMultiplier: { type: Number, default: 1.0 },
	},
	{ timestamps: true }
);

skillTaxonomySchema.index({ aliases: 1 });
skillTaxonomySchema.index({ ecosystem: 1 });

const SkillTaxonomy = mongoose.model("SkillTaxonomy", skillTaxonomySchema);

export default SkillTaxonomy;
