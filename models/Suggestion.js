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
  deleted: { type: Boolean, default: false },
  user: { type: String, required: true },
});

module.exports = mongoose.model("Suggestion", SuggestionSchema);
