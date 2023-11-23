import YT from "../lib/ytdl.js";
import { isKey } from "../func/checkkey.js";
import * as code from "../func/codes.js";

export default async (req, res) => {
  
const query = req.query.q || false;
const key = req.query.key || false;
const type = (req.query.type && req.query.type.toLowerCase()) || false;
const range = req.query.range || 11;

const check = isKey(key, res);
  if (!check) {
    return;
  };

if (!type) {
  code._404(res, "Enter a YouTube video type 'audio' or 'video'.");
  return;
};
  
if (!query) {
  code._404(res, "Enter a search term.");
  return;
};

let promise;
  if (type === 'video') {
    promise = Promise.resolve(YT.getVidQ(query, range));
  } else {
    promise = Promise.resolve(YT.getAudQ(query, range));
  }
    promise
    .then((result) => code._200(res, result))
    .catch((error) => {
      console.error(error);
      code._403(res);
  });
}
