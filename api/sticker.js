const sticker = require('../lib/sticker');
const { isKey } = require('../func/checkkey.js');
const code = require('../func/codes.js');

export default async (req, res) => {
  const key = req.query.key || false;
  const packname = req.query.packname || false;
  const author = req.query.author || false;
  const media = req.body.media || false;

  if (!isKey(key, res)) return;

  if (!packname || !author || !media) {
    code._404(res, 'Enter a packname, author, and media as base64.');
    return;
  }

  sticker.getSticker(media, packname, author)
    .then((result) => code._200(res, { sticker: result }))
    .catch((error) => {
      console.error(error);
      code._403(res);
    });
};
