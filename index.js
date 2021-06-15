const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan"); //logger for all requests made
const userRoute = require("./routes/users"); //import user specific router
const authRoute = require("./routes/auth"); //import authentication specific router
const postRoute = require("./routes/posts"); //import posts specific router
const conversationRoute = require("./routes/conversation"); //import conversation specific router
const messageRoute = require("./routes/message"); //import message specific router
const commentRoute = require("./routes/comment");
const multer = require("multer");
const path = require("path");

dotenv.config(); // env setup

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to Mongoose");
  }
); //mongoose connected to mongodb
//deprication warning fix from stckoverflow
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

app.use("/images", express.static(path.join(__dirname, "public/images")));

// middleware
app.use(express.json()); //body parser
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});
app.use(multer({ storage: storage }).single("file")); //fix for file not uploading but getting success message.
const upload = multer(storage);
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploaded successfully.");
  } catch (err) {
    console.log(err);
  }
});

//separate different routers
app.use("/api/users", userRoute); //given address will be used for 'userRoute' router.
app.use("/api/auth", authRoute); //given address will be used for 'authRoute' router.
app.use("/api/posts", postRoute); //given address will be used for 'postRoute' router.
app.use("/api/conversation", conversationRoute);
app.use("/api/message", messageRoute);
app.use("/api/comment", commentRoute);

// app.get("/", (req, res) => {
//   res.send("hello home page");
// });

app.get("/pritam", (req, res) => {
  res.send("hello pritam page");
});

//heroku code for deploy
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.listen(process.env.PORT || 4000, () => {
  console.log("Backend server is running @ 4000");
});
