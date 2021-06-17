//we are making a separate router here to handle all users related endpoints separetely
const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const axios = require("axios");

//update user
router.put("/:id", async (req, res) => {
  //put for update req
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        //hash new passwrd
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been updated");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can update only your account!");
  }
});

//delete user
router.delete("/:id", async (req, res) => {
  //delete for delete req
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has been deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can delete only your account!");
  }
});

//get a user based on query of userId or username
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc; //pass,updatedAt are destructured thrfore won't come into spreadOperator.
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get friends
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, name, username, profilePicture } = friend;
      friendList.push({ _id, name, username, profilePicture });
    });
    res.status(200).json(friendList);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all other users
router.get("/getAll/:userId", async (req, res) => {
  try {
    const allUsers = await User.find({ _id: { $ne: req.params.userId } });
    res.status(200).json(allUsers);
  } catch (e) {
    res.status(500).json(e);
  }
});

//follow a user
router.put("/:id/follow", async (req, res) => {
  if (req.params.id !== req.body.userId) {
    //not following itself
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        //already not followed user
        try {
          await user.updateOne({ $push: { followers: req.body.userId } });
          await currentUser.updateOne({ $push: { followings: req.params.id } });
          res.status(200).json("User has been followed");
        } catch (err) {
          res.status(500).json(err);
        }
      } else {
        res.status(403).json("You alrealy follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can't follow yourself");
  }
});

//unfollow a user
router.put("/:id/unfollow", async (req, res) => {
  if (req.params.id !== req.body.userId) {
    //unfollowing itself
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        //already unfollower user
        try {
          await user.updateOne({ $pull: { followers: req.body.userId } });
          await currentUser.updateOne({ $pull: { followings: req.params.id } });
          res.status(200).json("User has been unfollowed");
        } catch (err) {
          res.status(500).json(err);
        }
      } else {
        res.status(403).json("You alrealy not following this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can't unfollow yourself");
  }
});

module.exports = router;

//home page for this router
// router.get('/',(req,res)=>{
//     res.send("this is users routes home page");
// })
