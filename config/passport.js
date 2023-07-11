const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(async function verify(username, password, done) {
      try {
        const userInDb = await User.findOne({ username: username });
        if (!userInDb) {
          return done(null, false, { msg: `Username not found.` });
        } else {
          if (userInDb.validPassword(password)) {
            return done(null, userInDb);
          } else {
            return done(null, false, { msg: "Invalid username or password." });
          }
        }
      } catch (err) {
        console.error(err);
      }
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
