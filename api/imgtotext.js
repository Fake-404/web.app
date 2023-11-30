const imgToText = require('../lib/scraper');
const { isKey } = require('../func/checkkey.js');
const code = require('../func/codes.js');

export default async (req, res) => {
  const key = req.query.key || false;
  const media = req.body.media || false;

  if (!isKey(key, res)) return;

  imgToText.imgToText(media, 'eng')
    .then((result) => code._200(res, { text: result }))
    .catch((error) => {
      console.error(error);
      code._403(res);
    });
};
