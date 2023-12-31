module.exports = Object.freeze({
  jsonExample:
    '{"1":{"title":"Activity 1 title","desc":"1 sentence desc"},"2":{"title":"Activity 2 title","desc":"1 sentence desc"}}',
  MODFLAG: {
    1: {
      title: "Content flagged",
      desc: "OpenAI's moderation tools flagged your activities. Please reword.",
    },
  },
  GPTERROR: {
    1: {
      title: "Error",
      desc: "An error occured.  Please try again.",
    },
  },
  get initialPrompt() {
    return `Your goal is to find new activities the user could like.You receive details and tailor a response based on what they like: similarity not equality.Stay somewhat realistic.Here is a response template:  ${this.jsonExample}`;
  },
});
