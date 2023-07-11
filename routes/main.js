const express = require("express");
const router = express.Router();
const { reqLimiter, suggLimiter } = require("../config/ratelimiter");
const homeController = require("../controllers/home");
const authController = require("../controllers/auth");
const suggController = require("../controllers/suggestion");
const openAIController = require("../controllers/openai");
const { ensureAuth } = require("../middleware/auth");

// HOME
router.get("/", homeController.getIndex);

// GET Pages
router.get("/login", homeController.getLogin);
router.get("/register", homeController.getRegister);

// SUGGESTIONS
router.post("/requestActivity", reqLimiter, openAIController.postActivity);
router.post("/saveSuggestion", suggLimiter, ensureAuth, suggController.saveSuggestion);
router.delete("/deleteSugg", suggLimiter, ensureAuth, suggController.deleteSugg);
router.get("/profile", ensureAuth, suggController.getProfile);

// LOGIN
router.post("/login", authController.postLogin);

// SIGN UP
router.post("/register", authController.postRegister);

// LOG OUT
router.post("/logMeOut", authController.logMeOut);

module.exports = router;
