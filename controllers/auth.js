const passport = require("passport");
const User = require("../models/User");
const validator = require("validator");

module.exports = {
  postLogin: (req, res, next) => {
    const validationErrors = [];
    if (validator.isEmpty(req.body.password)) validationErrors.push({ msg: "Password cannot be blank." });
    if (validationErrors.length) {
      req.flash("errors", validationErrors);
      return res.redirect("/login");
    }
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        req.flash("errors", info);
        return res.redirect("/login");
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", { msg: "Success! You are logged in." });
        res.redirect("/");
      });
    })(req, res, next);
  },
  postRegister: async (req, res) => {
    console.log(req.body);
    // FIELD VALIDATION
    const validationErrors = [];
    const email = validator.trim(req.body.email);
    const username = validator.trim(req.body.username);
    if (username.length < 5) validationErrors.push({ msg: "Username needs to be at least 6 characters." });
    if (req.body.password.length < 8) validationErrors.push({ msg: "Password needs to be at least 8 characters." });
    if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: "Please enter a valid email address." });
    if (req.body.password !== req.body.confirmPass || validator.isEmpty(req.body.password))
      validationErrors.push({ msg: "Passwords do not match." });
    // FLASH VALIDATION ERRORS
    if (validationErrors.length) {
      req.flash("errors", validationErrors);
      res.redirect("/register");
    } else {
      try {
        const exists = await User.findOne({ $or: [{ email: email }, { username: username }] });
        if (!exists) {
          let newUser = new User({ username: username, email: email });
          // Call setPassword function to hash password and set it
          newUser.setPassword(req.body.password);
          const saved = await newUser.save();
          if (saved) {
            req.login(newUser, function (err) {
              if (err) {
                return next(err);
              }
              res.redirect("/");
            });
          }
        } else {
          req.flash("errors", { msg: "An account with that email address or username already exists." });
          res.redirect("/register");
        }
      } catch (err) {
        console.error(err + " : ERROR ");
      }
    }
  },
  logMeOut: function (req, res, next) {
    // logout logic

    // clear the user from the session object and save.
    // this will ensure that re-using the old session id
    // does not have a logged in user
    req.session.user = null;
    req.session.save(function (err) {
      if (err) next(err);
      // regenerate the session, which is good practice to help
      // guard against forms of session fixation
      req.session.regenerate(function (err) {
        if (err) next(err);
        res.json("success");
      });
    });
  },
};
