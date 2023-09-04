const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mail: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    passwordSalt: {
      type: String,
      required: true,
    },
    encryptionCycles: {
      type: Number,
      required: true,
    },
    money: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      default: "client",
    },
  },
  {
    versionKey: false, // Esto deshabilita el campo __v
  }
);

const userModel = mongoose.model("users", UserSchema);

module.exports = userModel;
