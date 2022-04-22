const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true,

  },
  lastname: {
    type: String,
    required: true,
    trim: true,

  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email.");
      }
    },
  },
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  cpassword: {
    type: String,
    required: true,
    trim: true,
  },
  category: [
    {
      type: String,
      required: true,
    },
  ],
  profilePic: {
    type: String,
    trim: true,
  },
  following: [
    {
      username: {
        type: String,
        trim: true,
      },
    },
  ],
  followers: [
    {
      username: {
        type: String,
        trim: true,
      },
    },
  ],
  spaces: [
    {
      type: String,
      required: true,
    },
  ],
  tokens: [
    {
      token: {
        type: String,
        required: false,
      },
    },
  ],
});

// Hashing Passwords

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    this.cpassword = await bcrypt.hash(this.cpassword, 10);
    console.log(this.password);
  }
  next();
});

// Generating Auth Token

userSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (e) {
    console.log(`Failed to generate token --> ${e}`);
  }
};

userSchema.methods.follow = async function (follow_user) {
  try {
    this.following = this.following.concat({ username: follow_user });
    await this.save();
    return this.following;
  } catch (e) {
    console.log(`Failed to follow user ${e}`);
  }
};

userSchema.methods.followingUser = async function (user) {
  try {
    this.followers = this.followers.concat({ username: user });
    await this.save();
    return this.followers;
  } catch (e) {
    console.log(`Failed to follow user ${e}`);
  }
};

userSchema.methods.unfollow = async function (unfollow_user) {
  try {
    this.following = this.following.filter((elem) => {
      return elem.username !== unfollow_user;
    });
    await this.save();
    return this.following;
  } catch (e) {
    console.log(`Failed to unfollow user ${e}`);
  }
};

userSchema.methods.unfollowingUser = async function (user) {
  try {
    this.followers = this.followers.filter((elem) => {
      return elem.username !== user;
    });
    await this.save();
    return this.followers;
  } catch (e) {
    console.log(`Failed to follow user ${e}`);
  }
};

userSchema.methods.EmbedSpaces = async function (spaceName) {
  try {
    this.spaces = this.spaces.concat(spaceName);
    await this.save();
    return this.spaces;
  } catch (e) {
    console.log(`Failed to embed space ${e}`);
  }
};

const User = mongoose.model("USER", userSchema);

module.exports = User;
