const express = require("express");
const session = require("express-session");
const nocache = require("nocache");
const data = require("./data");

const app = express();

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(nocache());
app.use(express.static("public"));

app.use(
  session({
    secret: "thisistheway",
    resave: false,
    saveUninitialized: true,
  })
);

const email = "hunais@gmail.com";
const password = "123456";
let inValid = false;

app.get("/", (req, res) => {
  if (!req.session.authorised) {
    res.render("login", { inValid });
    inValid = false;
  } else {
    res.redirect("/home");
    inValid = false;
  }
});

app.get("/home", (req, res) => {
  if (req.session.authorised) {
    res.render("home", { data });
  }
});

app.post("/", (req, res) => {
  if (req.body.email === email && req.body.password === password) {
    req.session.authorised = true;
    res.redirect("/home");
  } else {
    inValid = true;
    res.redirect("/");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("server running in port 3000");
});
