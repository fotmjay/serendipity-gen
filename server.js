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
const cookieParser = require("cookie-parser");

// INITIALIZATIONS
const app = express();

// CONFIGS
const connectDB = require("./config/database");
const User = require("./models/User");
//require("./config/passport");

// CONNECT TO DATABASE
connectDB();

// SET VIEWS
app.set("view engine", "ejs");

// PUBLIC
app.use("/public", express.static("public"));

// BODY PARSERS
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

//MIDDLEWARE
app.use(morgan("tiny"));

// SESSION CONFIG
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({ client: mongoose.connection.getClient() }),
  })
);

// use static authenticate method of model in LocalStrategy
passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());

app.use("/", mainRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
