import {
  AdCreator, BROAD, EXACT,
  getIndexOfHeaderByName,
  keyCriterionType, keyHeadline,
  KeywordCreator, PHRASE,
  ResponsiveAdCreator
} from "./campaignBuilder";

const TEST_CAMPAIGN_KEY = 'Some Campaign'
const TEST_KEYWORD_NAME = 'Keyword 1'
const TEST_FINAL_URL = 'http://test.com'
const TEST_HEADLINES = [
  'headline-test 1',
  'headline-test 2',
  'headline-test 3',
  'headline-test 4',
  'headline-test 5',
  'headline-test 6',
  'headline-test 7',
  'headline-test 8',
  'headline-test 9',
  'headline-test 10',
  'headline-test 11',
  'headline-test 12',
  'headline-test 13',
  'headline-test 14',
  'headline-test 15',
]
const TEST_DESCRIPTIONS = [
  'description-test 1',
  'description-test 2',
  'description-test 3',
  'description-test 4',
]
const TEST_PATHS = [
  'path-1',
  'path-2',
]

const findIndexByName = (arr, find) => {
  return arr.findIndex(item => item === find)
}

test('test ad', () => {
  const ad = new AdCreator().create(TEST_CAMPAIGN_KEY, TEST_KEYWORD_NAME)

  expect(findIndexByName(ad, TEST_CAMPAIGN_KEY)).toBeGreaterThan(-1);
  expect(findIndexByName(ad, TEST_KEYWORD_NAME)).toBeGreaterThan(-1);
});

test('test responsive ad', () => {
  const responsiveAd = new ResponsiveAdCreator().create(TEST_CAMPAIGN_KEY, TEST_KEYWORD_NAME, TEST_FINAL_URL, TEST_HEADLINES, TEST_DESCRIPTIONS, TEST_PATHS)

  expect(findIndexByName(responsiveAd, TEST_CAMPAIGN_KEY)).toBeGreaterThan(-1);
  expect(findIndexByName(responsiveAd, TEST_KEYWORD_NAME)).toBeGreaterThan(-1);
  expect(findIndexByName(responsiveAd, TEST_FINAL_URL)).toBeGreaterThan(-1);
  expect(findIndexByName(responsiveAd, TEST_HEADLINES[0])).toBeGreaterThan(-1);
  expect(findIndexByName(responsiveAd, TEST_DESCRIPTIONS[0])).toBeGreaterThan(-1);
  expect(findIndexByName(responsiveAd, TEST_PATHS[0])).toBeGreaterThan(-1);

  const responsiveAdEmptyHeadlines = new ResponsiveAdCreator().create(TEST_CAMPAIGN_KEY, TEST_KEYWORD_NAME, TEST_FINAL_URL, [], TEST_DESCRIPTIONS, TEST_PATHS)
  expect(responsiveAdEmptyHeadlines[getIndexOfHeaderByName(`${keyHeadline} 1`)]).toBe('');
});

test('test keyword creating', () => {
  const responsiveAdBroad = new KeywordCreator().create(TEST_CAMPAIGN_KEY, TEST_KEYWORD_NAME, BROAD)
  const responsiveAdPhrase = new KeywordCreator().create(TEST_CAMPAIGN_KEY, TEST_KEYWORD_NAME, PHRASE)
  const responsiveAdExact = new KeywordCreator().create(TEST_CAMPAIGN_KEY, TEST_KEYWORD_NAME, EXACT)

  expect(responsiveAdBroad[getIndexOfHeaderByName(keyCriterionType)]).toBe(BROAD);
  expect(responsiveAdPhrase[getIndexOfHeaderByName(keyCriterionType)]).toBe(PHRASE);
  expect(responsiveAdExact[getIndexOfHeaderByName(keyCriterionType)]).toBe(EXACT);
});
