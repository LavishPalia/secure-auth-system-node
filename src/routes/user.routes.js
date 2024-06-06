import express from "express";
import {
  registerUser,
  loginUser,
  exampleController,
} from "../controllers/user.controller.js";
import { check } from "express-validator";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router
  .route("/register")
  .post(
    [
      check(
        "username",
        "username should not be empty and without any special characters"
      )
        .trim()
        .isAlpha()
        .isLength({ min: 2, max: 50 })
        .escape(),
      check("email", "Please enter a valid email address")
        .trim()
        .isEmail()
        .escape(),
      check("password", "password must be atleast 8 characters")
        .trim()
        .isLength({ min: 8 }),
    ],
    registerUser
  );

router
  .route("/login")
  .post(
    [
      check("identifier").trim().not().isEmpty().escape(),
      check("password", "please provide your password").trim().not().isEmpty(),
    ],
    loginUser
  );

router.route("/example").post(authMiddleware, exampleController);

export default router;
