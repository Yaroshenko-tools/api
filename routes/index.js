const express = require('express');
const router = express.Router();
const apiProtections = require('../middleware/apiProtection');
const { BitlyClient } = require('bitly');
const bitly = new BitlyClient('6d0d8bd789539860ff2edaadabe4cd9cb5f707c5', {});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json('It works');
});

router.post('/shortener', apiProtections.protect, async (req, res) =>  {
	let result;
	const url = req.body.url
	try {
		result = await bitly.shorten(url);
	} catch(e) {
		throw e;
	}
	res.json(result)
});

module.exports = router;
