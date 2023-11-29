const totext = require('../lib/scraper.js');
const { isKey } = require('../func/checkkey.js');
const code = require('../func/codes.js');

export default async (req, res) => {
  try {
    const key = req.query.key || false;
    const media = req.body && req.body.media ? req.body.media : false;

    if (!isKey(key, res) || !media) {
      throw new Error('Invalid key or missing media');
    }

    const textResult = await totext.imgToText(media, 'eng');
    code._200(res, { text: textResult });
  } catch (error) {
    console.error(error);
    code._403(res);
  }
};
