module.exports = {
  getProfile: (req, res) => {
    res.render("pages/profile", { userLogged: req.user });
  },
};
