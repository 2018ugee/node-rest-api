//we are making a separate router here to handle all authentication related endpoints separetely
const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt"); //to hash password before storing in db
// const axios = require('axios');

// REGISTER
router.post("/register", async (req, res) => {
  //using try & catch to catch any unknown err
  try {
    //check for repeated credentials
    const repeatedUsername = await User.findOne({
      username: req.body.username,
    });

    if (repeatedUsername) {
      res.status(200).json("username");
    }
    const repeatedEmail = await User.findOne({ email: req.body.email });
    if (repeatedEmail) {
      res.status(200).json("email");
    }

    //generate hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = await new User({
      //async process
      //   username: req.body.username,
      //   email: req.body.email,
      //   password: hashedPassword,
      ...req.body,
      password: hashedPassword,
    });

    //save user & respond
    const user = await newUser.save(); //async: writting on database

    // //do login from here itself
    // try{
    //   const loggedUser = await axios.post("/api/auth/login", {
    //     email: req.body.email,
    //     password: req.body.password,
    //   });
    //   res.status(200).json(loggedUser);
    // }catch(e){
    //   res.status(200).json("loginYourself");
    // }

    res.status(200).json(user); //make response json
  } catch (err) {
    // console.log(err);
    res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    !user && res.status(200).json("User not found");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(200).json("Wrong credentials");

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
    // console.log(err);
  }
});

module.exports = router;

//home page for this router
// router.get('/',(req,res)=>{
//     res.send("this is auth routes home page");
// })

//REGISTER user (testing code)
// router.get('/register', async (req,res)=>{
//     const user = await new User({//async process
//         username:"john",
//         email:"john@gmail.com",
//         password:"12345"
//     });

//     await user.save();//async: writting on database
//     res.send("registered john");
// });
