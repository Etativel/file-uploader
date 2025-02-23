const bcrypt = require("bcryptjs");
const userService = require("../services/userServices");
const flash = require("express-flash");
const { body, validationResult } = require("express-validator");
// Sign up
async function getSignUpForm(req, res) {
  if (req.user) {
    return res.redirect("/dashboard");
  }
  res.render("signUpForm", {
    errors: [],
    value: {
      username: "",
      email: "",
      password: "",
    },
  });
}

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";
const uniqueErr = "username already taken";
const emailErr = "Email must be a valid email address.";
const passwordLengthErr = "Password must be at least 8 characters long.";
const passwordLowercaseErr =
  "Password must include at least one lowercase letter.";
const passwordUppercaseErr =
  "Password must include at least one uppercase letter.";
const passwordNumberErr = "Password must include at least one number.";
const passwordSpecialCharErr =
  "Password must include at least one special character.";

const uniqueEmailErr = "Email already used";

const validateUser = [
  body("username")
    .trim()
    .isLength({ min: 1, max: 15 })
    .withMessage(`Username ${lengthErr}`)
    .custom(async (value) => {
      const taken = await userService.isUsernameTaken(value);
      if (taken) {
        throw new Error(uniqueErr);
      }
      return true;
    }),

  body("email")
    .trim()
    .isEmail()
    .withMessage(emailErr)
    .custom(async (value) => {
      const taken = await userService.isEmailUsed(value);
      if (taken) {
        throw new Error(uniqueEmailErr);
      }
      return true;
    }),

  body("password")
    .isLength({ min: 8 })
    .withMessage(passwordLengthErr)
    .matches(/(?=.*[a-z])/)
    .withMessage(passwordLowercaseErr)
    .matches(/(?=.*[A-Z])/)
    .withMessage(passwordUppercaseErr)
    .matches(/(?=.*\d)/)
    .withMessage(passwordNumberErr)
    .matches(/(?=.*[@$!%*?&])/)
    .withMessage(passwordSpecialCharErr),
];

// async function registerUser(req, res) {
//   try {
//     const { email, username, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await userService.createUser(username, email, hashedPassword);
//     res.redirect("/sign-in");
//   } catch (error) {
//     res.status(500).json({ error: "Error registering user" });
//   }
// }

const registerUser = [
  validateUser,
  async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(400).render("signUpForm", {
        // title: "Create user",
        errors: errors.array(),
        value: req.body,
      });
    }

    const { username, email, password } = req.body;

    const lowerUsername = username.toLowerCase();

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userService.createUser(
      lowerUsername,
      email,
      hashedPassword
    );
    // res.render("index");
    res.redirect("/sign-in");
  },
];

// Log in
async function getLoginForm(req, res) {
  if (req.user) {
    return res.redirect("/dashboard");
  }

  const flashMessage = req.flash("error")[0];
  console.log("flash message", flashMessage);

  const usernameError =
    flashMessage === "No username found" ? flashMessage : null;
  const passwordError =
    flashMessage === "Incorrect password" ? flashMessage : null;

  const flashData = req.flash("loginFormData")[0];
  const value = flashData || { username: "", password: "" };
  res.render("loginForm", {
    value: {
      username: value.username,
      password: value.password,
      usernameError,
      passwordError,
    },
  });
}

// async function loginUser(req, res) {
//   try {
//     const { username, password } = req.body;
//     const user = await userService.getUser(username);
//   } catch (error) {
//     res.status(500).json({ error: "No user found" });
//   }
//   res.redirect("/sign-in");
// }

module.exports = {
  getLoginForm,
  // loginUser,
  registerUser,
  getSignUpForm,
};
