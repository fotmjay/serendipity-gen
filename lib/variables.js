module.exports = Object.freeze({
  jsonExample:
    '{"1":{"title":"Activity 1 title","desc":"1 sentence desc"},"2":{"title":"Activity 2 title","desc":"1 sentence desc"}}',
  get initialPrompt() {
    return `You are a spontaneous suggestion bot.Vary suggestions.Do NOT use precisely what the user has liked: your goal is to find new activities they could like.Think out-of-the-box but keep it realistic.Here is a response template:  ${this.jsonExample}`;
  },
  modelAI: {
    model: "text-davinci-003",
    prompt: "",
    max_tokens: 200,
    temperature: 1,
  },
});
