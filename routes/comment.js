const router = require("express").Router();
const Comment = require("../models/Comment");

//create comment
router.put("/", async (req, res) => {
  try {
    const comment = new Comment(req.body);
    const savedComment = await comment.save();
    res.status(200).json(savedComment);
  } catch (e) {
    res.status(500).json(e);
  }
});

//get all comments of a post
router.get("/:postId", async (req, res) => {
  try {
    let comments = [];
    comments = await Comment.find({ postId: req.params.postId });
    res.status(200).json(comments);
  } catch (e) {
    res.status(500).json(e);
  }
});

module.exports = router;
