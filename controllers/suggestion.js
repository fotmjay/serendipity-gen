const Suggestion = require("../models/Suggestion");

module.exports = {
  saveSuggestion: async (req, res) => {
    console.log(req.body);
    try {
      const alreadyExists = await Suggestion.findOne({ title: req.body.title, user: req.user.id });
      if (!alreadyExists) {
        const savedSugg = new Suggestion({
          title: req.body.title,
          description: req.body.description,
          user: req.user.id,
        });
        const saved = await savedSugg.save();
        console.log(saved);
      } else if (alreadyExists) {
        alreadyExists.deleted = !alreadyExists.deleted;
        console.log(alreadyExists.deleted);
        await alreadyExists.save();
      }
    } catch (err) {
      console.error(err);
    }
  },
  getProfile: async (req, res) => {
    try {
      let suggestions = await Suggestion.find({ user: req.user.id, deleted: false }).lean();
      if (suggestions.length < 1) {
        suggestions = [
          {
            title: "No liked suggestions",
            description: "Go to the generator to find activities you like!",
          },
        ];
      }
      res.render("pages/profile", { userLogged: req.user, suggList: suggestions });
    } catch (err) {
      console.error(err);
    }
  },
  deleteSugg: async (req, res) => {
    console.log(req.body);
    console.log("in here");
    try {
      await Suggestion.findOneAndUpdate({ _id: req.body.objectId }, { deleted: true });
      console.log("Marked as deleted");
      res.json("Deleted");
    } catch (err) {
      console.error(err);
    }
  },
};
