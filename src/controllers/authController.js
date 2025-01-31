const bcrypt = require("bcryptjs");
const userService = require("../services/userServices");

// Sign up
async function getSignUpForm(req, res) {
  res.render("signUpForm");
}

async function registerUser(req, res) {
  try {
    const { email, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userService.createUser(username, email, hashedPassword);
    res.redirect("/log-in");
  } catch (error) {
    res.status(500).json({ error: "Error registering user" });
  }
}

// Log in
async function getLoginForm(req, res) {
  res.render("loginForm");
}

async function loginUser(req, res) {
  try {
    console.log("in login");
    const { username, password } = req.body;
    const user = await userService.getUser(username);
    console.log(user);
  } catch (error) {
    res.status(500).json({ error: "No user found" });
  }
  res.redirect("/log-in");
}

module.exports = {
  getLoginForm,
  loginUser,
  registerUser,
  getSignUpForm,
};
