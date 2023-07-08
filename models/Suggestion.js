// Importing modules
const mongoose = require("mongoose");

const SuggestionSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  deleted: { type: String, default: false },
  user: { type: String, required: true },
});

module.exports = mongoose.model("Suggestion", SuggestionSchema);
