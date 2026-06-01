import axios from 'axios'
import logger from '../modules/logger'

const shorten = async (req, res) => {
  const url = req.body.url

  if (!url) {
    return res.status(400).json({ error: 'url is required' })
  }

  if (!process.env.VK_CC_ACCESS_TOKEN) {
    return res.status(503).json({ error: 'VK shortener is not configured' })
  }

  try {
    const resp = await axios.get('https://api.vk.com/method/utils.getShortLink', {
      params: {
        url,
        access_token: process.env.VK_CC_ACCESS_TOKEN,
        v: '5.131',
      },
    })

    if (resp.data?.error) {
      const vkError = resp.data.error
      return res.status(502).json({
        error: 'VK shortener failed',
        vk_error_code: vkError.error_code,
        vk_error_msg: vkError.error_msg,
      })
    }

    const shortUrl = resp.data?.response?.short_url
    if (!shortUrl) {
      throw new Error('VK API returned no short URL')
    }

    const result = { url: shortUrl }
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
