import express from 'express';
import { shorten } from '../controllers/urlController'
import { getCampaign } from '../controllers/adwordsController';
const router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
  res.json('It works');
});

router.post('/shortener', shorten);
router.post('/campaign-generator', getCampaign);


module.exports = router;
