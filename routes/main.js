const express = require("express");
const router = express.Router();
const { limiter } = require("../config/ratelimiter");
const homeController = require("../controllers/home");
const authController = require("../controllers/auth");
const openAIController = require("../controllers/openai");
const { ensureAuth } = require("../middleware/auth");

// HOME
router.get("/", homeController.getIndex);

// GET Pages
router.get("/login", authController.getLogin);
router.get("/register", authController.getRegister);
router.get("/profile", ensureAuth, authController.getProfile);

// GET SUGGESTION
router.post("/requestActivity", limiter, openAIController.postActivity);

// LOGIN
router.post("/login", authController.postLogin);

// SIGN UP
router.post("/register", authController.postRegister);

module.exports = router;
