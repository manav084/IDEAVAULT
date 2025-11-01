import mongoose from "mongoose";

const ideaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes:{
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

export default mongoose.models.Idea || mongoose.model("Idea", ideaSchema);
