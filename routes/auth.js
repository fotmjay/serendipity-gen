const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const db = require("../config/database");

router.get("/", authController.getLogin);

module.exports = router;
