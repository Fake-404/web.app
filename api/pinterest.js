const scrape = require("../lib/scraper.js");
const { isKey } = require("../func/checkkey.js");
const code = require("../func/codes.js");

export default async (req, res) => {
  const query = req.query.q || false;
  const key = req.query.key || false;

  const check = isKey(key, res);
  if (!check) {
    return;
  }

  if (!query) {
    code._404(res, "Enter a search term.");
    return;
  }

  scrape.pinterest(query)
    .then((response) => {
      const result = {
        title: query,
        length: response.length,
        images: response
      };
      code._200(res, result);
    })
    .catch((error) => {
      console.log(error);
      code._403(res);
    });
}
