const {CampaignBuilder, Keyword, Ad, BROAD, EXACT, PHRASE} = require('../modules/campaignBuilder');
const _ = require('lodash');
import logger from '../modules/logger'
import {
  HeadersCreator,
  AdCreator,
  KeywordCreator,
  ResponsiveAdCreator,
  parseKeywords
} from "../modules/campaignBuilder";

const getCampaign = async (req, res) => {
	const ads = req.body.ads;
	const campaignName = req.body.campaignName;
	const matchtypes = req.body.matchtypes;
	const keywords = parseKeywords(req.body.keywords);

  const campaignResult = []
  campaignResult.push(new HeadersCreator().create(campaignName))

  keywords.forEach(keyword => {
    ads.forEach(ad => {
      const keywordValue = keyword.keyword
      const finalUrl = keyword?.url ?? ad.url
      if (keyword?.headline) ad.headlines[0] = keyword.headline

      campaignResult.push(new AdCreator().create(campaignName, keywordValue))
      campaignResult.push(new ResponsiveAdCreator().create(campaignName, keywordValue, finalUrl, ad.headlines, ad.descriptions, ad.paths))
      matchtypes.forEach(matchtype => {
        campaignResult.push(new KeywordCreator().create(campaignName, keywordValue, matchtype))
      })
    })
  })

  return res.json({data: campaignResult});
};

module.exports = {
	getCampaign
}
