import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  badges: {
    type: [String],
    default: []
  }
}, { timestamps: true });

// module.exports = mongoose.model("User", userSchema);
export default mongoose.models.User || mongoose.model("User", userSchema);
