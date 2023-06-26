const express = require("express");
const dotenv = require("dotenv").config();
const rateLimiter = require("express-rate-limit");
const app = express();
const PORT = process.env.PORT || 3000;
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const model = {
  model: "text-davinci-003",
  prompt: "",
  max_tokens: 200,
  temperature: 1,
};
const limiter = rateLimiter({
  windowMs: 20 * 1000, // 60s
  max: 2, // Limit each IP to 100 requests per `window`
  message:
    "Your access to our API has been temporarily rate-limited. <br/> This limitation is in place to ensure fair usage and manage costs associated with providing access to the OpenAI API, which operates on a usage-based pricing model.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
let responseToPrint = "";
let moderated = false;

const jsonExample =
  '{"1":{"title":"Activity 1 title","desc":"Activity 1 description (1 sentence)"},"2":{"title":"Activity 2 title","desc":"Activity 2 description (1 sentence)"}}';
const initialPrompt = `You are a spontaneous suggestion bot.Vary suggestions.Do NOT use precisely what the user has liked: your goal is to find new activities they could like.Think out-of-the-box but keep it realistic.Here is a response template:  ${jsonExample}`;

app.set("view engine", "ejs");
app.use("/public", express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  const pushAnswer = [];
  const n = Object.keys(responseToPrint);
  console.log(responseToPrint);
  for (let i = 1; i <= n.length; i++) {
    pushAnswer.push([responseToPrint[i].title, responseToPrint[i].desc]);
  }
  responseToPrint = "";
  res.render("pages/index", { pushAnswer: pushAnswer });
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
    }
  }
  model.prompt = initialPrompt.concat(
    "\n Specific details:",
    creativePrompt,
    environmentPrompt,
    similarPrompt,
    requestNumber,
    friendsPrompt
  );
  try {
    const modResponse = await openai.createModeration({ input: similarPrompt });
    console.log("sent to moderation");
    if (modResponse.data.results[0].flagged) {
      responseToPrint = {
        1: {
          title: "Content flagged",
          desc: "OpenAI's moderation tools flagged your activities. Please reword.",
        },
      };
    } else {
      try {
        const promptSent = await openai.createCompletion(model);
        console.log("sent to gpt");
        responseToPrint = await JSON.parse(promptSent.data.choices[0].text);
      } catch (err) {
        console.log("error:" & err.message);
      }
    }
    console.log(promptSent.data);
  } catch (err) {
    console.log("error:" & err.message);
  }
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
