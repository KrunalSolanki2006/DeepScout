import mongoose from "mongoose";

const investigationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    question: {
      type: String,
      required: [true, "Investigation question is required"],
      trim: true,
      maxlength: [1000, "Question cannot exceed 1000 characters"],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed",
      index: true,
    },
    sourceType: {
      type: String,
      enum: ["web", "news", "scholar"],
      default: "web",
    },
    summary: {
      type: String,
      default: "",
    },
    keyFindings: {
      type: Array,
      default: [],
    },
    conflictingEvidence: {
      type: Array,
      default: [],
    },
    comparabilityNotes: {
      type: Array,
      default: [],
    },
    conditions: {
      type: Array,
      default: [],
    },
    limitations: {
      type: Array,
      default: [],
    },
    conclusion: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    subQuestions: {
      type: Array,
      default: [],
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    result: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user history retrieval (Section 20)
investigationSchema.index({ userId: 1, createdAt: -1 });
investigationSchema.index({ question: "text" });

export const Investigation = mongoose.model(
  "Investigation",
  investigationSchema
);
