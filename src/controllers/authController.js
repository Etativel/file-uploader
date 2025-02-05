const bcrypt = require("bcryptjs");
const userService = require("../services/userServices");

// Sign up
async function getSignUpForm(req, res) {
  if (req.user) {
    return res.redirect("/dashboard");
  }
  res.render("signUpForm");
}

async function registerUser(req, res) {
  try {
    const { email, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userService.createUser(username, email, hashedPassword);
    res.redirect("/sign-in");
  } catch (error) {
    res.status(500).json({ error: "Error registering user" });
  }
}

// Log in
async function getLoginForm(req, res) {
  if (req.user) {
    return res.redirect("/dashboard");
  }
  res.render("loginForm");
}

async function loginUser(req, res) {
  try {
    const { username, password } = req.body;
    const user = await userService.getUser(username);
  } catch (error) {
    res.status(500).json({ error: "No user found" });
  }
  res.redirect("/sign-in");
}

module.exports = {
  getLoginForm,
  loginUser,
  registerUser,
  getSignUpForm,
};
