const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(function verify(username, password, done) {
      User.findOne({ username: username }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { msg: `Username not found.` });
        }
        if (user.validPassword(password)) {
          return done(null, user);
        } else {
          return done(null, false, { msg: "Invalid username or password." });
        }
      });
    })
  );

  passport.serializeUser((user, done) => {
    console.log("Serialized: ");
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    console.log("Deserialized");
    try {
      const found = await User.findById(id);
      done(null, found);
    } catch (err) {
      console.error(err);
    }
  });
};
