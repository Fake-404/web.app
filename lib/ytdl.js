const ytdl = require('@queenanya/ytdlcore');
const yts = require('@queenanya/ytsearch');

const ytIdRegex = /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/

class YT {
  static isYouTubeUrl = (url) => {
    return ytIdRegex.test(url);
  }

  /*===========================================*/

  static getVideoID = (url) => {
    if (!this.isYouTubeUrl(url)) {
      throw new Error('Invalid YouTube URL');
    }
    return ytIdRegex.exec(url)[1];
  }

  /*===========================================*/
  
  static search = async (query, options = {}) => {
         const search = await yts.search({ query, hl: 'id', gl: 'ID', ...options })
         return search.videos
  }

  /*===========================================*/
  
  static getVidUrl = async (url) => {
    try {
      if (!url) {
        throw new Error('Video ID or YouTube URL is required');
      }
      const videoId = this.isYouTubeUrl(url) ? this.getVideoID(url) : url;
      const videoInfo = await ytdl.getInfo(`https://www.youtube.com/watch?v=${videoId}`, { lang: 'id' });
      if (!videoInfo.videoDetails.thumbnails.length) {
        throw new Error('No thumbnails available');
      }
      const qualities = {};
      for (const format of videoInfo.formats.filter(check => check.container === 'mp4' && check.hasAudio === true)) {
        qualities[format.qualityLabel] = format.url;
      }
      return {
        title: videoInfo.videoDetails.title,
        thumb: videoInfo.videoDetails.thumbnails.slice(-1)[0],
        date: videoInfo.videoDetails.publishDate,
        duration: videoInfo.videoDetails.lengthSeconds,
        views: formatNumber(videoInfo.videoDetails.viewCount),
        channel: videoInfo.videoDetails.ownerChannelName,
        direct_url: videoInfo.videoDetails.video_url,
        videoQuality: {
          high: qualities['720p'] || false,
          low: qualities['360p'] || false,
        },
        description: videoInfo.videoDetails.description || false,
      };
    } catch (error) {
      throw error;
    }
  }
  /*===========================================*/

  static getAudUrl = async (url) => {
  try {
    if (!url) {
      throw new Error('Video ID or YouTube URL is required');
    }
    const videoId = this.isYouTubeUrl(url) ? this.getVideoID(url) : url;
    const videoInfo = await ytdl.getInfo(`https://www.youtube.com/watch?v=${videoId}`, { lang: 'id' });
    if (!videoInfo.videoDetails.thumbnails.length) {
      throw new Error('No thumbnails available');
    }
    let audUrl;
    let selectedFormat;
    for (const format of videoInfo.formats.filter(check => check.container === 'mp4' && check.hasAudio === true && check.hasVideo === false && check.audioQuality === 'AUDIO_QUALITY_MEDIUM')) {
      audUrl = format.url;
      selectedFormat = format;
      break;
    }
    return {
      title: videoInfo.videoDetails.title,
      thumb: videoInfo.videoDetails.thumbnails.slice(-1)[0],
      date: videoInfo.videoDetails.publishDate,
      duration: videoInfo.videoDetails.lengthSeconds,
      views: formatNumber(videoInfo.videoDetails.viewCount),
      channel: videoInfo.videoDetails.ownerChannelName,
      direct_url: videoInfo.videoDetails.video_url,
      url: audUrl,
      description: videoInfo.videoDetails.description || false,
    };
  } catch (error) {
    throw error;
  }
 }
  
  /*===========================================*/

  static getVidQ = async (query, range) => {
    if (!query) {
        throw new Error('Video ID or YouTube Query is required');
    }
    const rangeCount = range || 11;
    const getList = await this.search(query);
    const link = getList[getRandomNumber((range > getList.length) ? getList.length : rangeCount)];
    const video = await this.getVidUrl(link.url);
    return video;
  }

  /*===========================================*/

  static getAudQ = async (query, range) => {
    if (!query) {
        throw new Error('Video ID or YouTube Query is required');
    }
    const rangeCount = range || 11;
    const getList = await this.search(query);
    const link = getList[getRandomNumber((range > getList.length) ? getList.length : rangeCount)];
    const video = await this.getAudUrl(link.url);
    return video;
  }

  /*===========================================*/
  
}

function getRandomNumber(range) {
      return Math.floor(Math.random() * range); //~ You can choose how much range should be of search list [random]
}
function formatNumber(number) {
  if (number >= 1000000) { return (number / 1000000).toFixed(1) + 'M';
  } else if (number >= 1000) { return (number / 1000).toFixed(1) + 'K';
  } else { return number.toString(); }
}

export default YT;
