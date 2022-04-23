const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Queries = require("../models/queries");
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

router.post("/post-question", async (req, res) => {
  try {
    const { question, category, username, answers, profilePic } = req.body;

    if (!question || !category || !username || !profilePic) {
      return res.status(422).json({ error: "Please fill all the fields." });
    } else {
      const queries = new Queries({
        question,
        category,
        username,
        answers,
        profilePic,
      });

      const postedQuestion = await queries.save();

      res.status(201).json(queries);
    }
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/post-answer", async (req, res) => {
  try {
    const { id, answer, username, profilePic } = req.body;

    if (!id || !answer || !username || !profilePic) {
      return res.status(422).json({ error: "Please fill all the fields." });
    }

    const question = await Queries.findOne({ _id: id });

    const Answer = await question.answerQuestion(answer, username, profilePic);

    if (question) {
      res.json(question);
    } else {
      res.send("Couldnt Post Answer!");
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
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

router.get("/getusers", async (req, res) => {
  try {
    const allUsers = await User.find();
    res.send(allUsers);
  } catch (e) {
    res.send(e);
  }
});

router.post("/getQueries-for-user", async (req, res) => {
  try {
    const { username } = req.body;

    const user = await User.findOne({ username: username });

    const categoryQueries = await Queries.find({
      $or: [
        { category: user.category[0] },
        { category: user.category[1] },
        { category: user.category[2] },
        { category: user.category[3] },
        { category: user.category[4] },
      ],
    }).sort({ date: -1 });

    console.log(categoryQueries);
    res.send(categoryQueries);

    res.send(categoryQueries);
  } catch (e) {
    res.send(e);
  }
});

router.get("/getQueries", async (req, res) => {
  try {
    const allQueries = await Queries.find();
    res.send(allQueries);
  } catch (e) {
    res.send(e);
  }
});

router.get("/get-health-queries", async (req, res) => {
  try {
    const healthQueries = await Queries.find({ category: "health" }).sort({
      date: -1,
    });
    res.send(healthQueries);
  } catch (e) {
    res.send(e);
  }
});

router.get("/get-business-queries", async (req, res) => {
  try {
    const businessQueries = await Queries.find({ category: "business" }).sort({
      date: -1,
    });
    res.send(businessQueries);
  } catch (e) {
    res.send(e);
  }
});

router.get("/get-lifestyle-queries", async (req, res) => {
  try {
    const lifestyleQueries = await Queries.find({ category: "lifestyle" }).sort(
      { date: -1 }
    );
    res.send(lifestyleQueries);
  } catch (e) {
    res.send(e);
  }
});

router.get("/get-education-queries", async (req, res) => {
  try {
    const educationQueries = await Queries.find({ category: "education" }).sort(
      { date: -1 }
    );
    res.send(educationQueries);
  } catch (e) {
    res.send(e);
  }
});

router.get("/get-trending-queries", async (req, res) => {
  try {
    const trendingQueries = await Queries.find({ category: "trending" }).sort({
      date: -1,
    });
    res.send(trendingQueries);
  } catch (e) {
    res.send(e);
  }
});

router.post("/post-upvote", async (req, res) => {
  const { id, username } = req.body;

  if (!id || !username) {
    return res.status(422).json({ error: "Please fill all the fields." });
  }
  try {
    const upvoteQuestion = await Queries.findOne({ _id: id });

    const upvoted = await upvoteQuestion.upvote(username);

    if (upvoted) {
      res.json({ message: "Upvoted Successfully!" });
    } else {
      res.json({ message: "Could not upvote!" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.post("/post-answer-upvote", async (req, res) => {
  const { qid, aid, username } = req.body;

  if (!username || !qid || !aid) {
    return res.status(422).json({ error: "Please fill all the fields." });
  }
  try {
    const upvoteQuestion = await Queries.findById({ _id: qid });
    const upvoted = await upvoteQuestion.upvotingAnswer(username, aid);

    if (upvoted) {
      res.json({ message: "Upvoted Successfully!" });
    } else {
      res.json({ message: "Could not upvote!" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.post("/remove-answer-upvote", async (req, res) => {
  const { qid, aid, username } = req.body;

  if (!username || !qid) {
    return res.status(422).json({ error: "Please fill all the fields." });
  }
  try {
    const upvoteQuestion = await Queries.findById({ _id: qid });
    const removeUpvote = await upvoteQuestion.removeUpvoteAnswer(username, aid);

    if (removeUpvote) {
      res.json({ message: "Upvote removed Successfully!" });
    } else {
      res.json({ message: "Could not remove upvote!" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.post("/post-downvote", async (req, res) => {
  const { id, username } = req.body;

  if (!username || !id) {
    return res.status(422).json({ error: "Please fill all the fields." });
  }
  try {
    const downvoteQuestion = await Queries.findOne({ _id: id });

    const downvoted = await downvoteQuestion.downvote(username);

    if (downvoted) {
      res.json({ message: "Downvoted Successfully!" });
    } else {
      res.json({ message: "Already Downvoted!" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.post("/post-answer-downvote", async (req, res) => {
  const { qid, aid, username } = req.body;

  if (!username || !qid || !aid) {
    return res.status(422).json({ error: "Please fill all the fields." });
  }
  try {
    const downvoteQuestion = await Queries.findById({ _id: qid });

    const downvoted = await downvoteQuestion.downvotingAnswer(username, aid);

    if (downvoted) {
      res.json({ message: "Downvoted Successfully!" });
    } else {
      res.json({ message: "Could not downvote!" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.post("/remove-answer-downvote", async (req, res) => {
  const { qid, aid, username } = req.body;

  if (!username || !qid) {
    return res.status(422).json({ error: "Please fill all the fields." });
  }
  try {
    const downvoteQuestion = await Queries.findById({ _id: qid });
    const removeDownvote = await downvoteQuestion.removeDownvoteAnswer(
      username,
      aid
    );

    if (removeDownvote) {
      res.json({ message: "Downvote removed Successfully!" });
    } else {
      res.json({ message: "Could not remove downvote!" });
    }
  } catch (e) {
    console.log(e);
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
