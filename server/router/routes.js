const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const answer = require("../middleware/answer");
const getAnswers = require("../middleware/getAnswers");
const Spaces = require("../models/spaces");

router.get("/", (req, res) => {
  res.json({ message: "This is the api" });
});

router.post("/register", async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    password,
    cpassword,
    category,
    username,
    profilePic,
  } = req.body;

  if (
    !firstname ||
    !lastname ||
    !email ||
    !password ||
    !cpassword ||
    !category ||
    !username
  ) {
    return res.status(422).json({ error: "Please fill all the fields." });
  }

  try {
    const userSearchByEmail = await User.findOne({ email: email });
    const userSearchByUsername = await User.findOne({ username: username });

    if (userSearchByEmail || userSearchByUsername) {
      return res.status(422).json({ error: "user already exists." });
    }

    if (password !== cpassword) {
      return res.status(422).json({ error: "passwords dont match." });
    } else {
      const user = new User({
        firstname,
        lastname,
        email,
        password,
        cpassword,
        category,
        username,
        profilePic,
      });

      const registered = await user.save();

      res.status(201).json({ message: "Registered Successfully!" });
    }
  } catch (e) {
    res.status(500).json({ message: `Could not create account! --> ${e}` });
  }
});

router.post("/login", async (req, res) => {
  try {
    const logEmail = req.body.email;
    const logPass = req.body.password;

    if (!logEmail || !logPass) {
      return res.status(422).json({ error: "Please fill all the fields." });
    }

    const userEmail = await User.findOne({ email: logEmail });
    const passCheck = await bcrypt.compare(logPass, userEmail.password);

    const token = await userEmail.generateAuthToken();

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 60000000),
      httpOnly: true,
    });

    if (passCheck) {
      res.status(200).json({
        message: "Logged In Successfully!",
        token: token,
        sucess: true,
        user: userEmail,
      });
    } else {
      res.status(400).json({ message: "Invalid login credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Invalid login credentials" });
  }
});


router.get("/logout", auth, async (req, res) => {
  try {
    console.log(req.rootUser.tokens);
    req.rootUser.tokens = req.rootUser.tokens.filter((currElem) => {
      return currElem.token != req.token;
    });
    res.clearCookie("jwt", { path: "/" });
    res.status(200).send({ message: "logged out successfully!" });
    await req.rootUser.save();
  } catch (e) {
    res.status(500).send(e);
  }
});


router.post("/getUser", async (req, res) => {
  try{
  const { username } = req.body;
  const userFound = await User.findOne({ username: username });
  if (userFound) {
    res.status(200).json(userFound);
  } 
}catch(e) {
    console.log(e);
    res.status(500).send(e);
  }
});


module.exports = router;
