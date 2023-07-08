module.exports = {
  getIndex: (req, res) => {
    console.log(req.user);
    console.log(req.session);
    res.render("pages/index", { pushAnswer: "", userLogged: req.user });
  },
  getProfile: (req, res) => {
    res.render("pages/profile", { userLogged: req.user });
  },
};
