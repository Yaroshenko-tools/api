const { BitlyClient } = require('bitly');
const bitly = new BitlyClient(process.env.BITLY_SECRET, {});

const shorten = async (req, res) => {
	let result;
	const url = req.body.url
	try {
		result = await bitly.shorten(url);
	} catch(e) {
		throw e;
	}
	res.json(result)
};

module.exports = {
	shorten
}
