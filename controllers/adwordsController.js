const {CampaignBuilder, Keyword, Ad, EXACT, PHRASE} = require('../modules/campaignBuilder');
const _ = require('lodash');
import logger from '../modules/logger'

const getCampaign = async (req, res) => {
	const ads = req.body.ads;
	const campaignName = req.body.campaignName;
	const matchtypes = req.body.matchtypes;
	const keywords = req.body.keywords.split("\n");
	const downloadCsv = req.body.downloadCsv;
	const clientDate = req.body.clientDate;

	const campaign = new CampaignBuilder(campaignName);


	logger.info({ message: JSON.stringify({keywords})})

	for (let i = 0; i < keywords.length; i++) {
		let keyword = keywords[i].trim();
		if (keyword) {
			const keywordUrlArray = keyword.split('|');
			let keywordUrl = keywordUrlArray[1];
			if (keywordUrl) keywordUrl = keywordUrl.trim();

			let keywordH1 = keywordUrlArray[2];
			if (keywordH1) keywordH1 = keywordH1.trim();

			keyword = keywordUrlArray[0].trim();

			keyword = replaceAll(keyword, '\\-', ' ');
			keyword = replaceAll(keyword, '\\+', '');
			keyword = replaceAll(keyword, '\\[', '');
			keyword = replaceAll(keyword, '\\]', '');
			keyword = replaceAll(keyword, '\\"', '');
			keyword = replaceAll(keyword, '\\"', '');
			keyword = keyword.replace(/ +(?= )/g, '');


			// Start building campaign here



			campaign.startAdGroup(keyword)

			for (let j = 0; j < ads.length; j++) {
				if (isValidAd(ads[j])) {
					campaign.addAd(new Ad(ads[j], keyword, keywordUrl, keywordH1));
				}
			}

			if (matchtypes.phrase) {
				campaign.addKeyword(new Keyword(keyword, PHRASE));
			}
			if (matchtypes.exact) {
				campaign.addKeyword(new Keyword(keyword, EXACT));
			}
    }
	}

	if (downloadCsv) {
		let fileName = campaignName ? _.kebabCase(campaignName) : 'campaign';
		// fileName += '_' + new Date(clientDate);
		// res.setHeader('Content-Description', `attachment; filename=123.csv`);
		res.setHeader('Content-disposition', `attachment; filename=123.csv`);
		res.set('Content-Type', 'text/csv');
		res.status(200).send(campaign.getCsv());
	} else {
		res.json({campaign: campaign.getTable()});
	}

};

function replaceAll(target, search, replacement) {
	if (!target) {
		return ''
	} else {
		return target.replace(new RegExp(search, 'g'), replacement);
	}
}

function isValidAd(ad) {
	return ad.h1 && ad.h2 && ad.d1 && ad.url
}

module.exports = {
	getCampaign
}
