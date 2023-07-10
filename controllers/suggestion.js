const Suggestion = require("../models/Suggestion");

module.exports = {
  saveSuggestion: async (req, res) => {
    console.log(req.body);
    const savedSugg = new Suggestion({ title: req.body.title, description: req.body.description, user: req.user.id });
    try {
      const saved = await savedSugg.save();
      console.log(saved);
    } catch (err) {}
  },
};
