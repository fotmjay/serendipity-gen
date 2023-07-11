require("dotenv").config({ path: "./config/.env" });

// CONSTANTS
const CONSTANTS = require("./lib/constants");
const PORT = process.env.PORT || CONSTANTS.DEFAULTPORT;

//ROUTES
const mainRoutes = require("./routes/main");

// MODULES
const express = require("express");
const session = require("express-session");
const flash = require("express-flash");
const mongoose = require("mongoose");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const morgan = require("morgan");

// INITIALIZATIONS
const app = express();

// CONFIGS
const connectDB = require("./config/database");
require("./config/passport")(passport);

// CONNECT TO DATABASE
connectDB();

// SET VIEWS
app.set("view engine", "ejs");

// PUBLIC
app.use("/public", express.static("public"));

// BODY PARSERS
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//MIDDLEWARE
app.use(morgan("tiny"));

// SESSION CONFIG
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ client: mongoose.connection.getClient() }),
    cookie: {
      secure: false,
    },
  })
);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// ROUTES
app.use("/", mainRoutes);

// SERVER LAUNCH
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
