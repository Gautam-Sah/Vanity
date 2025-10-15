import { Schema, model } from "mongoose"

const historySchema = Schema(
  {
    claimText: {
      type: String,
      required: [true, "Claim text is required"],
      trim: true,
    },
    summary: {
      type: String,
      required: [true, "Summary is required"],
    },
    verdict: {
      type: String,
      enum: ["TRUE", "FALSE", "UNSURE", "MIXED"],
      default: "UNSURE",
    },
    claims: {
      type: Array,
      default: [],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

export default model("History", historySchema)
