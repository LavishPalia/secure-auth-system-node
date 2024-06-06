import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApIError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/User.model.js";
import { validationResult } from "express-validator";

const cookieOptions = {
  httpOnly: true,
  secure: true,
};

const registerUser = asyncHandler(async (req, res, next) => {
  // validate and sanitize req.body
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new ApiError(422, errors.array()));
  }

  const { username, email, password } = req.body;

  // check if the username or email already exists in DB
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  // console.log(existingUser);
  // return error if the user already exists
  if (existingUser) {
    return next(new ApiError(400, "Email or username is taken"));
  }

  // create new user and save to database
  const newUser = await User.create({
    username,
    email,
    password,
  });
  // console.log("new DB entry", newUser);

  //TODO: if we want to send user details to frontend we can make a query to the DB and select the fields required.

  res
    .status(201)
    .json(new ApiResponse(201, {}, "User registered successfully."));
});

const loginUser = asyncHandler(async (req, res, next) => {
  // validate and sanitize req.body
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new ApiError(422, errors.array()));
  }

  // identifier field here refers to either email or username
  const { identifier, password } = req.body;

  // find user in DB with either username or email
  const user = await User.findOne({
    $or: [{ username: identifier }, { email: identifier }],
  });

  // return error if the user is not in DB
  if (!user) {
    return next(
      new ApiError(400, "User doesn't exist. Please create an account")
    );
  }

  // compare the password value
  const isPasswordMatch = await user.matchPassword(password);

  // send error if the password is wrong
  if (!isPasswordMatch) {
    return next(new ApiError(400, "Invalid user credentials"));
  }

  // generate access token
  const accessToken = await user.generateAccessToken();

  // set the token as a cookie
  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(new ApiResponse(200, {}, "User logged in successfully..."));
});

const exampleController = asyncHandler(async (req, res, next) => {
  res.json({ data: "auth middleware testing..." });
});

export { registerUser, loginUser, exampleController };
