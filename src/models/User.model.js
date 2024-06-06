import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "username field cannot be empty"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "email field cannot be empty"],
    unique: true,
    trim: true,
  },

  password: {
    type: String,
    required: [true, "Password field cannot be empty."],
    trim: true,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (error) {
    console.error("Error genrating password hash");
  }
});

userSchema.methods.matchPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.log("Error comparing passwords");
  }
};

userSchema.methods.generateAccessToken = async function () {
  const payload = {
    _id: this._id,
    email: this.email,
  };

  try {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });
  } catch (error) {
    console.log(error);
  }
};

export const User = mongoose.model("User", userSchema);
