const mongoose = require("mongoose");

const querySchema = new mongoose.Schema({
  question: {
    type: String,
    trim: true,
    required: true,
  },
  username: {
    type: String,
    trim: true,
    required: true,
  },
  category: {
    type: String,
    trim: true,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  upvotes: [
    {
      username: {
        type: String,
        trim: true,
      },
    },
  ],
  profilePic: {
    type: String,
    required: true,
  },
  answers: [
    {
      answer: {
        type: String,
        trim: true,
      },
      upvotes: [
        {
          username: {
            type: String,
            trim: true,
          },
        },
      ],
      downvotes: [
        {
          username: {
            type: String,
            trim: true,
          },
        },
      ],
      username: {
        type: String,
        trim: true,
      },
      profilePic: {
        type: String,
        required: true,
      },
    },
  ],
});

// Posting Answer

querySchema.methods.answerQuestion = async function (answer, username, profilePic) {
  try {
    let user = username;
    let ans = answer;
    let dp = profilePic;
    this.answers = this.answers.concat({ answer: ans, username: user, profilePic: dp });
    console.log(this.username);
    await this.save();
    return this.answers;
  } catch (e) {
    console.log(`Failed to Post your Answer --> ${e}`);
  }
};

// Deleting Answer

querySchema.methods.fetchAnswer = async function (id) {
  try {
    return this;
  } catch (e) {
    console.log(`Failed to fetch your Answer --> ${e}`);
  }
};

querySchema.methods.upvote = async function (username) {
  try {
    this.upvotes = this.upvotes.concat({ username: username });
    console.log(this.upvotes);
    await this.save();
    return this.upvotes;
  } catch (e) {
    console.log(`Failed to Upvote --> ${e}`);
  }
};

querySchema.methods.upvotingAnswer = async function (username,aid) {
  try {
    console.log(this.answers);
    const upvoteAnswer = this.answers.find((elem) => {
      return elem._id == aid;
    })
    upvoteAnswer.upvotes = upvoteAnswer.upvotes.concat({ username: username });
    console.log(this.answers.upvotes);
    await this.save();
    return upvoteAnswer;
  } catch (e) {
    console.log(`Failed to Upvote --> ${e}`);
  }
};

querySchema.methods.removeUpvoteAnswer = async function (username,aid) {
  try {
    console.log(this.answers);
    const upvoteAnswer = this.answers.find((elem) => {
      return elem._id == aid;
    })
    upvoteAnswer.upvotes = upvoteAnswer.upvotes.filter((elem) => {
      return elem.username !== username;
    });
    console.log(upvoteAnswer);
    await this.save();
    return upvoteAnswer;
  } catch (e) {
    console.log(`Failed to Upvote --> ${e}`);
  }
};


querySchema.methods.downvote = async function (username) {
  try {
    this.upvotes = this.upvotes.filter((elem) => {
      return elem.username !== username;
    });
    console.log(this.upvotes);
    await this.save();
    return this.upvotes;
  } catch (e) {
    console.log(`Failed to Downvote --> ${e}`);
  }
};

querySchema.methods.downvotingAnswer = async function (username,aid) {
  try {
    console.log(this.answers);
    const downvoteAnswer = this.answers.find((elem) => {
      return elem._id == aid;
    })
    downvoteAnswer.downvotes = downvoteAnswer.downvotes.concat({ username: username });
    console.log(this.answers.downvotes);
    await this.save();
    return downvoteAnswer;
  } catch (e) {
    console.log(`Failed to Downvote Answer --> ${e}`);
  }
};

querySchema.methods.removeDownvoteAnswer = async function (username,aid) {
  try {
    console.log(this.answers);
    const downvoteAnswer = this.answers.find((elem) => {
      return elem._id == aid;
    })
    downvoteAnswer.downvotes = downvoteAnswer.downvotes.filter((elem) => {
      return elem.username !== username;
    });
    console.log(downvoteAnswer);
    await this.save();
    return downvoteAnswer;
  } catch (e) {
    console.log(`Failed to Remove Downvote --> ${e}`);
  }
};

const Queries = mongoose.model("Querie", querySchema);

module.exports = Queries;
