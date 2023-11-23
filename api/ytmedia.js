import YT from "../lib/ytdl.js";
import { isKey } from "../func/checkkey.js";
import * as code from "../func/codes.js";

export default async (req, res) => {
  
const url = req.query.url || false;
const key = req.query.key || false;
const type = (req.query.type && req.query.type.toLowerCase()) || false;

const check = isKey(key, res);
  if (!check) {
    return;
  };
  
if (!url) {
  code._404(res, "Enter a YouTube video url.");
  return;
};

if (!type) {
  code._404(res, "Enter a YouTube video type 'audio' or 'video'.");
  return;
};

if (!YT.isYouTubeUrl(url)) {
  code._203(res, "Invalid YouTube url.");
} else {
  let promise;
  if (type === 'video') {
    promise = Promise.resolve(YT.getVidUrl(url));
  } else {
    promise = Promise.resolve(YT.getAudUrl(url));
  }
    promise
    .then((result) => code._200(res, result))
    .catch((error) => {
      console.error(error);
      code._403(res);
    });
}
}
