const express = require("express");
const router = express.Router();
const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const authController = require("../controllers/authController");
const passport = require("passport");
const userService = require("../services/userServices");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const normalizedUsername = username.toLowerCase();
      const user = await userService.getUser(normalizedUsername, null);

      if (!user) {
        return done(null, false, { message: "No username found" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userService.getUser(null, id);

    done(null, user);
  } catch (err) {
    done(err);
  }
});

router.get("/sign-up", authController.getSignUpForm);
router.post("/sign-up", authController.registerUser);

router.get("/log-in", authController.getLoginForm);
router.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/log-in",
    // failureFlash: true,
  })
);
router.get("/log-out", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
module.exports = router;
