require("dotenv").config({ path: "../.env" });
const express = require("express");
const app = express();
const passport = require("passport");
const path = require("node:path");
const assetPath = path.join(__dirname, "public");
const session = require("./config/sessionConfig");
// Routes
const authRouter = require("./routes/auth");
const dashboardRouter = require("./routes/dashboard");
const uploadRouter = require("./routes/upload");
const fileRouter = require("./routes/folder");
const fileManagement = require("./routes/fileManagement");
// Initialization
session(app);
app.use(express.static(assetPath));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());

app.use("/", authRouter);
app.use("/", dashboardRouter);
app.use("/", fileRouter);
app.use("/", uploadRouter);
app.use("/", fileManagement);
app.get("/", (req, res) => {
  if (req.user) {
    return res.redirect("/dashboard");
  }
  res.render("landing");
});

app.use((req, res) => {
  res.send("404 Page not found");
});

const PORT = 3030;

app.listen(PORT, () => console.log("App listen to port ", PORT));
