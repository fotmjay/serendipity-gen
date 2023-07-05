const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home");

router.get("/", homeController.getIndex);
router.get("/login", homeController.getIndex);
router.get("/register", homeController.getIndex);
router.get("/profile", homeController.getIndex);

module.exports = router;
