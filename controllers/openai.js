const CONSTANTS = require("../lib/constants");
const messages = require("../lib/messages");
const openai = require("../config/openai");

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

module.exports = {
  postActivity: async (req, res) => {
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
    res.render("pages/index", { pushAnswer: pushAnswer, userLogged: req.user });
  },
};
