module.exports = Object.freeze({
  DEFAULTPORT: 3000,
  LIMITWINDOW: 20,
  MAXTRIES: 3,
  MODFLAG: {
    1: {
      title: "Content flagged",
      desc: "OpenAI's moderation tools flagged your activities. Please reword.",
    },
  },
  RATELIMITMESSAGE:
    "Your access to our API has been temporarily rate-limited. <br/> This limitation is in place to ensure fair usage and manage costs associated with providing access to the OpenAI API, which operates on a usage-based pricing model.",
});
