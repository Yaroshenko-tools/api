const { BitlyClient } = require('bitly');
import axios from 'axios'
import logger from '../modules/logger'

const bitly = new BitlyClient(process.env.BITLY_SECRET, {});

const shorten = async (req, res) => {
  const url = req.body.url
  const provider = req.body.provider

  if (!url || !provider) {
    return res.status(400).json({ error: 'url and provider are required' })
  }

  try {
    let result = {}

    switch (provider) {
      case 'bit.ly': {
        const resp = await bitly.shorten(url)
        result.url = resp.link
        break
      }
      case 'vk.cc': {
        if (!process.env.VK_CC_ACCESS_TOKEN) {
          return res.status(503).json({ error: 'VK shortener is not configured' })
        }

        const resp = await axios.get('https://api.vk.com/method/utils.getShortLink', {
          params: {
            url,
            access_token: process.env.VK_CC_ACCESS_TOKEN,
            v: '5.103',
          },
        })

        if (resp.data?.error) {
          throw new Error(resp.data.error.error_msg || 'VK API error')
        }

        result.url = resp.data?.response?.short_url
        if (!result.url) {
          throw new Error('VK API returned no short URL')
        }
        break
      }
      default:
        return res.status(400).json({ error: `Unknown provider: ${provider}` })
    }

    logger.info({ message: JSON.stringify({ result }) })
    return res.json(result)
  } catch (e) {
    logger.error({
      message: JSON.stringify({
        error: e.message,
        stack: e.stack,
        response: e.response?.data,
      }),
    })
    return res.status(502).json({ error: 'Failed to shorten URL' })
  }
}

export { shorten }
