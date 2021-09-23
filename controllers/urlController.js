const {BitlyClient} = require('bitly');
const axios = require('axios');
import logger from '../modules/logger'

const bitly = new BitlyClient(process.env.BITLY_SECRET, {});

const shorten = async (req, res) => {
    let result = {};
    const url = req.body.url
    const provider = req.body.provider

    switch (provider) {
        case 'bit.ly':
            try {
                resp = await bitly.shorten(url);
                result.url = resp.link;
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
                try {
                    result.url = response.data.response.short_url;
                } catch (e) {
                    logger.error({message: JSON.stringify( {
                            error: e,
                            response: response
                        })}
                    )
                }

            }).catch(function (error) {
                logger.error({message: JSON.stringify( {
                        error: error,
                        response: response
                    })});

                throw error;
            });
            break
    }

    res.json(result)
};

module.exports = {
    shorten
}
