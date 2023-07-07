const passport = require("passport");
const User = require("../models/User");
const validator = require("validator");

module.exports = {
  getLogin: (req, res) => {
    res.render("pages/login");
  },
  getRegister: (req, res) => {
    res.render("pages/register");
  },
  getProfile: (req, res) => {
    res.render("pages/profile");
  },
  postLogin: passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  }),
  postRegister: async (req, res) => {
    console.log(req.body);
    // FIELD VALIDATION
    const validationErrors = [];
    const email = validator.trim(req.body.email);
    const username = validator.trim(req.body.username);
    if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: "Please enter a valid email address." });
    if (req.body.password !== req.body.confirmPass || validator.isEmpty(req.body.password))
      validationErrors.push({ msg: "Passwords do not match." });

    // FLASH VALIDATION ERRORS
    if (validationErrors.length) {
      req.flash("errors", validationErrors);
      res.redirect("/register");
    }

    User.register({ username: username, email: email, active: true }, req.body.password, function (err, user) {
      if (err) {
        validationErrors.push({ msg: "Username or email already in use." });
        req.flash("errors", validationErrors);
        res.redirect("/register");
      } else {
        const authenticate = User.authenticate();
        authenticate(username, req.body.password, function (err, result) {
          if (err) {
            console.error(err);
          } else {
            res.redirect("/");
          }
        });
      }
    });
  },
};
