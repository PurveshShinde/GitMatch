import mongoose from "mongoose";

const issueFeedbackSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		issueId: { type: Number, required: true }, // githubId
		action: {
			type: String,
			enum: ["click", "save", "hide", "open_github", "complete"],
			required: true,
		},
		matchScore: Number, // score at time of interaction
	},
	{ timestamps: true }
);

// Prevent duplicate feedback for same user+issue+action combination
issueFeedbackSchema.index(
	{ userId: 1, issueId: 1, action: 1 },
	{ unique: true }
);

const IssueFeedback = mongoose.model("IssueFeedback", issueFeedbackSchema);

export default IssueFeedback;
