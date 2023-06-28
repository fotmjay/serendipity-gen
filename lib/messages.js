module.exports = Object.freeze({
  jsonExample:
    '{"1":{"title":"Activity 1 title","desc":"1 sentence desc"},"2":{"title":"Activity 2 title","desc":"1 sentence desc"}}',
  MODFLAG: {
    1: {
      title: "Content flagged",
      desc: "OpenAI's moderation tools flagged your activities. Please reword.",
    },
  },
  RATELIMITMESSAGE:
    "Your access to our API has been temporarily rate-limited. <br/> This limitation is in place to ensure fair usage and manage costs associated with providing access to the OpenAI API, which operates on a usage-based pricing model.",
  get initialPrompt() {
    return `You are a spontaneous suggestion bot.Vary suggestions.Do NOT use precisely what the user has liked: your goal is to find new activities they could like.Think out-of-the-box but keep it realistic.Here is a response template:  ${this.jsonExample}`;
  },
});
