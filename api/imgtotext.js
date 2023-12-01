const js = require('../lib/scraper');
const { isKey } = require('../func/checkkey.js');
const code = require('../func/codes.js');

export default async (req, res) => {
  const key = req.query.key || false;
  const code = req.body.code || false;

  if (!isKey(key, res)) return;
  if (!code) {
    code._404(res, "Enter a javascript");
    return;
  }
  
  js.obfuscateJs(code)
    .then((result) => code._200(res, result))
    .catch((error) => {
      console.error(error);
      code._403(res);
    });
};
