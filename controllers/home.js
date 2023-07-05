module.exports = {
  getIndex: (req, res) => {
    res.render("pages/index", { pushAnswer: "" });
  },
};
