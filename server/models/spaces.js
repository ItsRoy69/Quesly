const mongoose = require("mongoose");

const spacesSchema = new mongoose.Schema({
  spaceName: {
    type: String,
    default: "Yet Another Space",
  },
  members: [
    {
      type: String,
      required: true,
    },
  ],
  admin: {
    type: String,
    required: true,
  },
  dp : {
    type: String,
    default : "https://thumbs.dreamstime.com/b/stay-chill-skeleton-cap-cocktail-swim-ring-white-black-background-147343908.jpg"
  },
  description:{
    type: String,
    default:"Add Some Group Description."
  },
  messages: [
    {
      message: {
        type: String,
      },
      username: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      spacename: {
        type: String,
      },
    },
  ],
});

spacesSchema.methods.DeleteMember = async function (members) {
  try {
    this.members = this.members.filter((member) => {
      return !members.includes(member);
    });
    await this.save();
    return this.members;
  } catch (e) {
    console.log(`Failed to Delete Member. ${e}`);
  }
};

spacesSchema.methods.AddMember = async function (members) {
  try {
    this.members = this.members.concat(members);
    await this.save();
    return this.members;
  } catch (e) {
    console.log(`Failed to Add Member. ${e}`);
  }
};

spacesSchema.methods.PostMessages = async function (
  username,
  message,
  spacename
) {
  try {
    this.messages = this.messages.concat({
      username: username,
      message: message,
      spacename: spacename,
    });
    await this.save();
    return this.messages;
  } catch (e) {
    console.log(`Failed to Send Message. ${e}`);
  }
};

const Spaces = mongoose.model("Space", spacesSchema);

module.exports = Spaces;
