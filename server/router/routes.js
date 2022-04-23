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

router.post("/follow-user", async (req, res) => {
  const { user, follow_user } = req.body;

  if (!user || !follow_user) {
    return res.status(422).json({ error: "Please fill all the fields." });
  }
  try {
    const findUser = await User.findOne({ username: user });
    const findFollowUser = await User.findOne({ username: follow_user });

    const followingUsers = findUser.following.find((elem) => {
      return elem.username === follow_user;
    });

    const followedUser = findFollowUser.followers.find((elem) => {
      return elem.username === user;
    });


    if (!followingUsers && !followedUser && user !== follow_user) {
      const followUser = await findUser.follow(follow_user);

      const followerUser = await findFollowUser.followingUser(user);

      res.status(201).json({ message: "User Followed Successfully!" });
    } else {
      res.status(200).json({ message: "User Already Followed!" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.post("/unfollow-user", async (req, res) => {
  const { user, unfollow_user } = req.body;

  if (!user || !unfollow_user) {
    return res.status(422).json({ error: "Please fill all the fields." });
  }
  try {
    const findUser = await User.findOne({ username: user });
    const findFollowUser = await User.findOne({ username: unfollow_user });

    const followingUsers = findUser.following.find((elem) => {
      return elem.username === unfollow_user;
    });

    const followedUser = findFollowUser.followers.find((elem) => {
      return elem.username === user;
    });


    if (followingUsers && followedUser && user !== unfollow_user) {
      const unfollowUser = await findUser.unfollow(unfollow_user);

      const unfollowerUser = await findFollowUser.unfollowingUser(user);

      res.status(201).json({ message: "User Unfollowed Successfully!" });
    } else {
      res.status(200).json({ message: "You Don't Follow the User!" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.post("/delete-answer", answer, async (req, res) => {
  try {
    const { aid } = req.body;

    if (!aid) {
      return res.status(422).json({ error: "Please fill all the fields." });
    }

    req.Answer.answers = req.Answer.answers.filter((currElem) => {
      return currElem._id != req.id;
    });
    res.status(200).send({ message: "Answer Deleted Successfully!" });
    await req.Answer.save();
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.post("/getQueries-by-user", async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(422).json({ error: "Please fill all the fields." });
    }

    const QueriesByUser = await Queries.find({ username: username });

    res.send(QueriesByUser);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.post("/getAnswers-by-user", getAnswers, async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(422).json({ error: "Please fill all the fields." });
    }

    req.Answer.answers = req.Answer.answers.filter((currElem) => {
      return currElem.username === req.username;
    });

    res.send(req.Answer.answers);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.post("/getAnswers", async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(422).json({ error: "Please fill all the fields." });
    }

    const question = await Queries.findOne({ _id: id });

    res.send(question.answers);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});



router.post("/get-visiting-user", async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(422).json({ error: "Please fill all the fields." });
    }
    const UserFound = await User.findOne({ username: username });

    if (UserFound) {
      res.status(200).send(UserFound);
    } else {
      res.status(404).send("User Not Found.");
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.post("/create-space", async (req, res) => {
  try {
    const { admin, members, spaceName } = req.body;

    if (!admin || !members) {
      return res.status(422).json({ error: "Please fill all the fields." });
    }
    const userFound = await User.findOne({ username: admin });

    const saveSpaces = await userFound.EmbedSpaces(spaceName);

    if (userFound) {
      const space = new Spaces({
        admin,
        members,
        spaceName,
      });
      const createdSpace = await space.save();
      res.status(200).send(createdSpace);
    } else {
      res.status(404).send("User Not Found!");
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.post("/remove-member", async (req, res) => {
  try {
    const { id, admin, members } = req.body;

    if (!admin || !members || !id) {
      return res.status(422).json({ error: "Please fill all the fields." });
    }
    const spaceFound = await Spaces.findOne({ _id: id });

    const memberExists = members.map((member) => {
      return spaceFound.members.includes(member);
    });

    const user = members.find((username) => {
      return username === admin;
    });

    if (memberExists.toString() === "false") {
      res
        .status(400)
        .json({ message: "Requested User is not a part of your Space." });
    } else if (user) {
      res.status(400).json({
        message: "Admin cannot remove himself, delete group instead.",
      });
    } else {
      if (spaceFound.admin === admin) {
        const editSpace = await spaceFound.DeleteMember(members);
        res.status(200).send(editSpace);
      } else {
        res.status(404).json({ message: "You are not the admin." });
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "Could not find requested Space." });
  }
});

router.post("/add-member", async (req, res) => {
  try {
    const { id, admin, members } = req.body;

    if (!admin || !members || !id) {
      return res.status(422).json({ error: "Please fill all the fields." });
    }
    const spaceFound = await Spaces.findOne({ _id: id });

    const memberExists = members.map((member) => {
      return spaceFound.members.includes(member);
    });

    if (memberExists.toString() === "true") {
      res
        .status(400)
        .json({ message: "Requested User is already a part of your Space." });
    } else {
      if (spaceFound.admin === admin) {
        const editSpace = await spaceFound.AddMember(members);
        res.status(200).send(editSpace);
      } else {
        res.status(404).json({ message: "You are not the admin." });
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(`Could not find requested Space.`);
  }
});

router.post("/send-message", async (req, res) => {
  try {
    const { id, username, message } = req.body;

    if (!username || !message) {
      return res.status(422).json({ error: "Please fill all the fields." });
    }

    const spaceFound = await Spaces.findOne({ _id: id });

    const spacename = spaceFound.spaceName;

    if (spaceFound) {
      const embedMessages = await spaceFound.PostMessages(
        username,
        message,
        spacename
      );
      return res.status(200).send(embedMessages);
    } else {
      return res.status(404).send(`Could not find requested Space.`);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.post("/get-users-spaces", async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(422).json({ error: "Please fill all the fields." });
    }

    const Space = await Spaces.find();

    const SpaceFound = Space.map((elem) => {
      if (elem.members.includes(username)) {
        return elem;
      } else {
        return null;
      }
    });

    const filteredSpaceFound = SpaceFound.filter((elem) => {
      return elem !== null;
    });

    if (SpaceFound) {
      res.send(filteredSpaceFound);
    } else {
      res.json("You are not a part of any Space.");
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.post("/search-user", async (req, res) => {
  try {
    const { search } = req.body;

    if (!search) {
      return res.status(422).json({ error: "Please fill all the fields." });
    }

    const users = await User.find();

    const newUsers = users.map((user) => {
      if (user.username) {
        if (!user.username.search(search.toLowerCase())) {
          return user;
        }
      }
    });

    if (newUsers) {
      res.send(newUsers);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.post("/search-space", async (req, res) => {
  try {
    const { search, username } = req.body;

    if (!search) {
      return res.status(422).json({ error: "Please fill all the fields." });
    }

    const Space = await Spaces.find();

    const SpaceFound = Space.map((elem) => {
      if (elem.members.includes(username)) {
        return elem;
      } else {
        return null;
      }
    });

    const filteredSpaceFound = SpaceFound.filter((elem) => {
      return elem !== null;
    });

    const newSpaces = filteredSpaceFound.map((space) => {
      if (space.spaceName.toLowerCase()) {
        if (!space.spaceName.toLowerCase().search(search)) {
          return space;
        }
      }
    });

    const filteredNewSpaces = newSpaces.filter((space) => {
      return space != null;
    });

    if (newSpaces) {
      res.send(filteredNewSpaces);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.post("/login-with-google", async (req, res) => {
  try {
    const logEmail = req.body.email;

    if (!logEmail) {
      return res.status(422).json({ error: "Please fill all the fields." });
    }

    const user = await User.findOne({ email: logEmail });
    const userEmail = await User.findOne({ email: logEmail });

    const token = await userEmail.generateAuthToken();

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 60000000),
      httpOnly: true,
    });


    if (user) {
      res.json({
        message: "Logged In Successfully!",
        token: token,
        success: true,
        user: user,
      });
    } else {
      res.status(400).json({ message: "Invalid login credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Invalid login credentials" });
  }
});

router.patch("/updateUser/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const updateUser = await User.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    res.status(200).json({ updateUser, success: true });
  } catch (e) {
    res.status(500);
    res.json({ message: `Could not update user --> ${e}` });
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

router.patch("/updateSpace/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const updateSpace = await Spaces.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    res.status(200).json({ updateSpace, success: true });
  } catch (e) {
    res.status(500);
    res.json({ message: `Could not update Space --> ${e}` });
  }
});


module.exports = router;
