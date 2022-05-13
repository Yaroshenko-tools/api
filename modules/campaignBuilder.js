import {range, clone} from "lodash";

const _ = require('lodash');

export const BROAD = 'Broad';
export const PHRASE = 'Phrase';
export const EXACT = 'Exact';

const valueResponsiveAd = 'Responsive search ad';
export const prepositions = ['в', 'без', 'до', 'из', 'к', 'на', 'по', 'о', 'от', 'перед', 'при', 'через', 'с', 'у', 'за', 'над', 'об', 'под', 'про', 'для'];

export const keyCampaign = 'Campaign'
export const keyAdGroup = 'Ad Group'
export const keyAdType = 'Ad type'
export const keyKeyword = 'Keyword'
export const keyCriterionType = 'Criterion Type'
export const keyFinalURL = 'Final URL'
export const keyHeadline = 'Headline'
export const keyDescription = 'Description'
export const keyPath = 'Path'

export const headers = [
  keyCampaign,
  keyAdType,
  keyAdGroup,
  keyKeyword,
  keyCriterionType,
  keyFinalURL,
  'Headline 1',
  'Headline 2',
  'Headline 3',
  'Headline 4',
  'Headline 5',
  'Headline 6',
  'Headline 7',
  'Headline 8',
  'Headline 9',
  'Headline 10',
  'Headline 11',
  'Headline 12',
  'Headline 13',
  'Headline 14',
  'Headline 15',
  'Description 1',
  'Description 2',
  'Description 3',
  'Description 4',
  'Path 1',
  'Path 2',
]

const emptyRow = Array(headers.length).fill('')

export const getIndexOfHeaderByName = (name) => {
  return headers.findIndex(item => item === name)
}

const cleanKeywords = (keywords) => {
  return keywords.map(keyword => {
    let newKeyword = keyword
    newKeyword = newKeyword.trim()

    newKeyword = replaceAll(newKeyword, '\\-', ' ');
    newKeyword = replaceAll(newKeyword, '\\+', '');
    newKeyword = replaceAll(newKeyword, '\\[', '');
    newKeyword = replaceAll(newKeyword, '\\]', '');
    newKeyword = replaceAll(newKeyword, '\\"', '');
    newKeyword = replaceAll(newKeyword, '\\"', '');
    newKeyword = newKeyword.replace(/ +(?= )/g, '');

    return newKeyword
  })
}

export const parseKeywords = (keywords) => {
  const cleanedKeywords = cleanKeywords(keywords)

  return cleanedKeywords.map(keywrd => {
    if (keywrd.indexOf('|') > -1) {
      const [keyword, url, headline] = keywrd.split('|')
      return {keyword, url, headline}
    }

    return {
      keyword: keywrd
    }
  })
}


const replaceAll = (target, search, replacement) => {
  if (!target) {
    return ''
  } else {
    return target.replace(new RegExp(search, 'g'), replacement);
  }
}

const replaceMacros = (keyword, text) => {
  let newText = text
  let keywordCapitalizerWords = '';
  let words = _.words(keyword);

  for (let i = 0; i < words.length; i++) {
    keywordCapitalizerWords = keywordCapitalizerWords + _.capitalize(words[i]) + ' ';
  }
  keywordCapitalizerWords = keywordCapitalizerWords.trim();

  newText = replaceAll(newText, '\\[keyword\\]', keyword);
  newText = replaceAll(newText, '\\[Keyword\\]', _.capitalize(keyword));
  newText = replaceAll(newText, '\\[KeyWord\\]', keywordCapitalizerWords);
  for (let i = 0; i < 5; i++) {
    if (words[i]) {
      newText = replaceAll(newText, `\\[word${i + 1}\\]`, words[i]);
      newText = replaceAll(newText, `\\[Word${i + 1}\\]`, _.capitalize(words[i]));
    } else {
      newText = replaceAll(newText, `\\[word${i + 1}\\]`, '');
      newText = replaceAll(newText, `\\[Word${i + 1}\\]`, '');
    }
  }
  newText = replaceAll(newText, '\\n', '');
  newText = replaceAll(newText, '\\r', '');
  newText = replaceAll(newText, '\\t', '');
  newText = newText.trim();

  return newText;
}

export class HeadersCreator {
  create() {
    return headers
  }
}

export class AdCreator {
  create(campaignName, adGroup) {
    const result = clone(emptyRow)

    result[getIndexOfHeaderByName(keyCampaign)] = campaignName
    result[getIndexOfHeaderByName(keyAdGroup)] = adGroup

    return result
  }
}

export class ResponsiveAdCreator {
  create(campaignName, adGroup, finalUrl, headlines, descriptions, paths) {
    const newHeadlines = headlines.map(headline => {
      return replaceMacros(adGroup, headline)
    })

    const newDescriptions = descriptions.map(description => {
      return replaceMacros(adGroup, description)
    })

    const newPaths = paths.map(path => {
      return replaceMacros(adGroup, path)
    })

    const result = clone(emptyRow)

    result[getIndexOfHeaderByName(keyCampaign)] = campaignName
    result[getIndexOfHeaderByName(keyAdGroup)] = adGroup
    result[getIndexOfHeaderByName(keyAdType)] = valueResponsiveAd
    result[getIndexOfHeaderByName(keyFinalURL)] = finalUrl

    range(1, newHeadlines.length + 1).forEach(number => {
      result[getIndexOfHeaderByName(`${keyHeadline} ${number}`)] = newHeadlines[number - 1]
    })

    range(1, newDescriptions.length + 1).forEach(number => {
      result[getIndexOfHeaderByName(`${keyDescription} ${number}`)] = newDescriptions[number - 1]
    })

    range(1, newPaths.length + 1).forEach(number => {
      result[getIndexOfHeaderByName(`${keyPath} ${number}`)] = newPaths[number - 1]
    })

    return result
  }
}

export class KeywordCreator {
  create (campaignName, keyword, criterionType) {
    const result = clone(emptyRow)

    result[getIndexOfHeaderByName(keyCampaign)] = campaignName
    result[getIndexOfHeaderByName(keyAdGroup)] = keyword
    result[getIndexOfHeaderByName(keyKeyword)] = keyword
    result[getIndexOfHeaderByName(keyCriterionType)] = criterionType

    return result
  }
}
