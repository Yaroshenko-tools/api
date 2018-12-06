const express = require('express');
const router = express.Router();
const apiProtections = require('../middleware/apiProtection');
const urlController = require('../controllers/urlController');
const adwordsController = require('../controllers/adwordsController');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.json('It works');
});

router.post('/shortener', apiProtections.protect, urlController.shorten);
router.post('/campaign-generator', apiProtections.protect, adwordsController.getCampaign);


module.exports = router;
