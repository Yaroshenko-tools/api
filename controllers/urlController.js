const {BitlyClient} = require('bitly');
const axios = require('axios');

const bitly = new BitlyClient(process.env.BITLY_SECRET, {});

const shorten = async (req, res) => {
    let result = {};
    const url = req.body.url
    const provider = req.body.provider

    switch (provider) {
        case 'bit.ly':
            try {
                result = await bitly.shorten(url);
            } catch (e) {
                throw e;
            }
            break
        case 'vk.cc':
            await axios.get('https://api.vk.com/method/utils.getShortLink', {
                params:{
                    url: url,
                    access_token: process.env.VK_CC_ACCESS_TOKEN,
                    v: '5.103'
                }
            }).then(function (response) {
                result.url = response.data.response.short_url;
            }).catch(function (error) {
                throw error;
            });
            break
    }

    res.json(result)
};

module.exports = {
    shorten
}
