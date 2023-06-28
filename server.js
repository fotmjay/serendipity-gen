require("dotenv").config();
const messages = require("./lib/messages");
const CONSTANTS = require("./lib/constants");
const express = require("express");
const rateLimiter = require("express-rate-limit");
const app = express();
const PORT = process.env.PORT || CONSTANTS.DEFAULTPORT;
const { Configuration, OpenAIApi } = require("openai");
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

app.set("view engine", "ejs");
app.use("/public", express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("pages/index", { pushAnswer: "" });
});

app.post("/requestActivity", limiter, async (req, res) => {
  const body = req.body;
  let creativePrompt = "";
  let environmentPrompt = "";
  let similarPrompt = "";
  let requestNumber = "";
  let friendsPrompt = "";
  console.log(body);
  for (let detail in body) {
    switch (detail) {
      case "creativity":
        creativePrompt = `Openmindedness at ${body[detail]}/100.`;
        break;
      case "environment":
        if (body[detail] === "inside") {
          environmentPrompt = `Inside activity.`;
        } else if (body[detail] === "outside") {
          environmentPrompt = "Outside activity.";
        } else {
          environmentPrompt = "Outside or inside activity.";
        }
        break;
      case "moreInfo":
        if (body[detail]) {
          similarPrompt = `User likes: ${body[detail]}.`;
        }
        break;
      case "inputAct":
        if (body[detail] > 1) {
          requestNumber = `Give ${body[detail]} suggestion.`;
        } else {
          requestNumber = "Give 1 suggestion.";
        }
        break;
      case "numFriends":
        if (body[detail] > 1) {
          friendsPrompt = `Group of ${body[detail]} friends.`;
        } else {
          friendsPrompt = `User is alone.`;
        }
        break;
      default:
        break;
    }
  }
  CONSTANTS.modelAI.prompt = messages.initialPrompt.concat(
    "\n Specific details:",
    creativePrompt,
    environmentPrompt,
    similarPrompt,
    requestNumber,
    friendsPrompt
  );
  let responseToPrint = "";
  try {
    const modResponse = await openai.createModeration({ input: similarPrompt });
    console.log("sent to moderation:", modResponse.data);
    if (modResponse.data.results[0].flagged) {
      responseToPrint = messages.MODFLAG;
    } else {
      const promptSent = await openai.createCompletion(CONSTANTS.modelAI);
      console.log("sent to gpt: " + CONSTANTS.modelAI.prompt);
      responseToPrint = await JSON.parse(promptSent.data.choices[0].text);
      console.log("return: ", promptSent.data);
    }
  } catch (err) {
    console.error("error: " & err.message);
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
