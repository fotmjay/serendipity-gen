module.exports = {
  getIndex: (req, res) => {
    res.render("pages/index", { pushAnswer: "", userLogged: req.user });
  },
  getProfile: (req, res) => {
    res.render("pages/profile", { userLogged: req.user });
  },
  getLogin: (req, res) => {
    res.render("pages/login", { userLogged: req.user });
  },
  getRegister: (req, res) => {
    res.render("pages/register");
  },
};
