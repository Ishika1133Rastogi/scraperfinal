const express = require("express");
const router = express.Router();
const { getBaseData, updateIsChecked, scrapes, scrapData } = require("../controllers/scrapecontrollers");

// Define routes
router.get("/search", getBaseData);
router.put("/update-ischecked", updateIsChecked);
router.post("/scrapes", scrapes);
router.post("/scrape-data", scrapData);

module.exports = router;
