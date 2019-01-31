const _ = require('lodash');

const BROAD = 'Broad';
const PHRASE = 'Phrase';
const EXACT = 'Exact';

const getRow = (campaignName, adGroup, keyword, ad) => {
	if (keyword && ad) throw new Error('KeyWords and Ad should be in separate rows');
	if (!adGroup) throw new Error('adGroup should be defined');
	let row = `${campaignName}[|]${adGroup}[|]`;

	if (keyword) {
		row = row + `${keyword.text}[|]${keyword.matchtype}[|]`;

		if (keyword.url) {
			row = row + `${keyword.url}[|]`;
		} else {
			row = row + ``;
		}
	} else {
		row = row + `[|][|]`;
		// if (!ad) {
		// 	row = row + `[|]`;
		// }

	}

	if (ad) {
		row = row + `${ad.url}[|]${ad.h1}[|]${ad.h2}[|]${ad.h3}[|]${ad.d1}[|]${ad.d2}[|]${ad.p1}[|]${ad.p2}`;
	} else {
		if (!keyword || !keyword.url) {
			row = row + `[|]`;
		}
		row = row + `[|][|][|][|][|][|]`;
	}

	const delimeters = row.split('[|]').length - 1;
	if (delimeters !== 11) throw new Error('Should be 11 delimeters!');
	return row;
};

const getHeader = () => {
	return 'Campaign[|]Ad Group[|]Keyword[|]Criterion Type[|]Final URL[|]Headline 1[|]Headline 2[|]Headline 3[|]Description Line 1[|]Description Line 2[|]Path 1[|]Path 2';
};


class Ad {
	constructor(ad, keyword) {
		// if (h1 && h2 && h3 && d1 && d2 && p1 && p2 && url) {
		let keywordCapitalizerWords = '';
		let words = _.words(keyword);
		const prepositions = ['в', 'без', 'до', 'из', 'к', 'на', 'по', 'о', 'от', 'перед', 'при', 'через', 'с', 'у', 'за', 'над', 'об', 'под', 'про', 'для'];
		console.log('old', words);
		words = words.filter(word => prepositions.indexOf(word) === -1);
		console.log('new:', words);
		for (let i = 0; i < words.length; i++) {
			keywordCapitalizerWords = keywordCapitalizerWords + _.capitalize(words[i]) + ' ';
		}
		keywordCapitalizerWords = keywordCapitalizerWords.trim();

		function replaceMacros(text) {

			text = replaceAll(text, '\\[keyword\\]', keyword);
			text = replaceAll(text, '\\[Keyword\\]', _.capitalize(keyword));
			text = replaceAll(text, '\\[KeyWord\\]', keywordCapitalizerWords);
			for (let i = 0; i < 5; i++) {
				if (words[i]) {
					text = replaceAll(text, `\\[word${i + 1}\\]`, words[i]);
					text = replaceAll(text, `\\[Word${i + 1}\\]`, _.capitalize(words[i]));
				} else {
					text = replaceAll(text, `\\[word${i + 1}\\]`, '');
					text = replaceAll(text, `\\[Word${i + 1}\\]`, '');
				}
			}
			text = replaceAll(text, '\\n', '');
			text = replaceAll(text, '\\r', '');
			text = replaceAll(text, '\\t', '');
			text = text.trim();

			return text;
		}


		this.h1 = replaceMacros(ad.h1);
		this.h2 = replaceMacros(ad.h2);
		this.h3 = replaceMacros(ad.h3);
		this.d1 = replaceMacros(ad.d1);
		this.d2 = replaceMacros(ad.d2);
		this.p1 = replaceMacros(ad.p1);
		this.p2 = replaceMacros(ad.p2);
		this.url = replaceMacros(ad.url);


		// } else {
		// 	throw new Error('Not enough arguments on Ad');
		// }

	}
}

class Keyword {
	constructor(keyword, matchtype, url) {
		// if (keyword && matchtype) {
		this.text = keyword;
		this.matchtype = matchtype;
		this.url = url;
		// } else {
		// 	throw new Error('Not enough arguments on KeyWord');
		// }

	}
}

class CampaignBuilder {
	constructor(campaignName) {
		this.csv = getHeader() + "\n";
		this.campaignName = campaignName;
	}

	startAdGroup(adGroup) {
		this.csv = this.csv + getRow(this.campaignName, adGroup) + "\n";
		this.adGroupLast = adGroup;
	}

	addKeyword(keyword) {
		this.csv = this.csv + getRow(this.campaignName, this.adGroupLast, keyword) + `\n`;
	}

	addAd(ad) {
		this.csv = this.csv + getRow(this.campaignName, this.adGroupLast, false, ad) + `\n`;
	}

	getCsv() {
		return this.csv.replace(/\[\|\]/g, "\t");
	}

	getTable() {
		let result = '<table id="table-result"><thead><tr class="text-xs-left">';
		let rows = this.csv.split('\n');
		result += '<th>' + rows[0].replace(/\[\|\]/g, "</th><th>") + '</th></tr></thead><tbody>';
		for (let i = 1; i < rows.length; i++) {
			result += '<tr><td>' + rows[i].replace(/\[\|\]/g, "</td><td>") + '</td></tr>';
		}
		result += '</tbody></table>';
		return result;
	}

}

function replaceAll(target, search, replacement) {
	if (!target) {
		return ''
	} else {
		return target.replace(new RegExp(search, 'g'), replacement);
	}
}


module.exports = {
	CampaignBuilder,
	Keyword,
	Ad,
	BROAD,
	EXACT,
	PHRASE
};