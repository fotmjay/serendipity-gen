const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config({ path: "./config/.env" });

const configuration = new Configuration({
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = openai;
