const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      min: 3,
      max: 20,
      unique: true,
    },
    name: {
      type: String,
      require: true,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      require: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      min: 6,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    followers: {
      type: Array, //will store id(s) of followers in this array like [1,2,5,7] these are followers
      default: [],
    },
    followings: {
      type: Array, //will store id(s) of user it is following in this array like [1,2,5,7] these are its followings people
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      max: 50,
    },
    city: {
      type: String,
      max: 50,
    },
    from: {
      type: String,
      max: 50,
    },
    relationship: {
      type: Number,
      enum: [1, 2, 3], //(options)single engaged tripleLove
    },
  },
  { timestamps: true } //this automatically updates timestamps when we create a user and update it
);

module.exports = mongoose.model("User", UserSchema); //export a model of user type with schema userSchema
