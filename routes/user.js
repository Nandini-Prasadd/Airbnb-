const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRediredUlr } = require("../middleware.js");
const userController = require("../controllers/users.js");
const user = require("../models/user.js");

router.get("/signup", userController.renderSignupForm);

router.post("/signup", wrapAsync(userController.SignUp));

router.get("/login", userController.renderLoginForm);

router.post(
  "/login",
  saveRediredUlr,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);

router.get("/logout", userController.logout);

module.exports = router;
