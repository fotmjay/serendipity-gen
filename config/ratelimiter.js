const rateLimiter = require("express-rate-limit");

module.exports = {
  limiter: rateLimiter({
    windowMs: 20000,
    max: 2,
    message:
      "Your access to our API has been temporarily rate-limited. <br/> This limitation is in place to ensure fair usage and manage costs associated with providing access to the OpenAI API, which operates on a usage-based pricing model.",
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  }),
};
