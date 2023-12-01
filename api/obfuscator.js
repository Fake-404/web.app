const js = require('../lib/scraper');
const { isKey } = require('../func/checkkey.js');
const codeHelper = require('../func/codes.js');

export default async (req, res) => {
  const key = req.query.key || false;
  const codeText = req.body.code || false;

  if (!isKey(key, res)) return;
  if (!codeText) {
    codeHelper._404(res, "Enter JavaScript code.");
    return;
  }
  
  try {
    const obfuscatedCode = await js.obfuscateJs(codeText);
    codeHelper._200(res, obfuscatedCode);
  } catch (error) {
    console.error(error);
    codeHelper._403(res, "An internal server error occurred.");
  }
};
