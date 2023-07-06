require("dotenv").config({ path: "./config/.env" });

// CONSTANTS
const messages = require("./lib/messages");
const CONSTANTS = require("./lib/constants");
const PORT = process.env.PORT || CONSTANTS.DEFAULTPORT;

//ROUTES
const mainRoutes = require("./routes/main");
const profileRoutes = require("./routes/profile");
const authRoutes = require("./routes/auth");

// MODULES
const express = require("express");
const rateLimiter = require("express-rate-limit");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const { Configuration, OpenAIApi } = require("openai");
const morgan = require("morgan");
const crypto = require("crypto");

// INITIALIZATIONS
const app = express();
const configuration = new Configuration({
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const limiter = rateLimiter({
  windowMs: CONSTANTS.LIMITWINDOW,
  max: CONSTANTS.MAXTRIES,
  message: messages.RATELIMITMESSAGE,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

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
  })
);

//app.use("/profile", profileRoutes);
app.use("/login", authRoutes);
app.use("/", mainRoutes);

app.post("/requestActivity", limiter, async (req, res) => {
  const prompt = createPrompt(req.body);
  console.log(prompt); // keeping it for troubleshooting
  let responseToPrint = "";
  try {
    const modResponse = await openai.createModeration({ input: prompt });
    console.log("sent to moderation:", modResponse.data);
    if (modResponse.data.results[0].flagged) {
      responseToPrint = messages.MODFLAG;
    } else {
      const modelReady = CONSTANTS.modelAI;
      modelReady.prompt = messages.initialPrompt.concat("\n Specific details:", prompt);
      const promptSent = await openai.createCompletion(modelReady);
      responseToPrint = await JSON.parse(promptSent.data.choices[0].text);
      console.log("return: ", promptSent.data);
    }
  } catch (err) {
    console.log(err);
    responseToPrint = messages.GPTERROR;
  }
  const pushAnswer = [];
  const n = Object.keys(responseToPrint);
  for (let i = 1; i <= n.length; i++) {
    pushAnswer.push([responseToPrint[i].title, responseToPrint[i].desc]);
  }
  res.render("pages/index", { pushAnswer: pushAnswer });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});

function createPrompt(form) {
  let prompt = `Openmindedness at ${form.creativity}/100.`;
  if (form.environment === "any") {
    prompt += "Inside or outside.";
  } else {
    prompt += `${form.environment}.`;
  }
  if (Number(form.numFriends) > 1) {
    prompt += `Group of ${form.numFriends}.`;
  } else {
    prompt += "User alone.";
  }
  if (form.moreInfo) {
    prompt += `User likes: ${form.moreInfo}.`;
  }
  prompt += `${form.inputAct} ideas.`;
  return prompt;
}
