import express from 'express';
import { shorten } from '../controllers/urlController'
import { getCampaign } from '../controllers/adwordsController';
import { protect } from '../middleware/apiProtection'
const router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
  res.json('It works');
});

router.post('/shortener', protect, shorten);
router.post('/campaign-generator', protect, getCampaign);


module.exports = router;
