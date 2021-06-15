const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    postId: {
      type: String,
      require: true,
    },
    text: {
      type: String,
      require: true,
    },
    commentorId: {
      type: String,
      require: true,
    },
    commentorName: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
