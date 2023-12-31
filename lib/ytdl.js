const ytdl = require('@queenanya/ytdlcore');
const yts = require('@queenanya/ytsearch');
const axios = require('axios');
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
    const fetchQ = async (high, low) => ({
      high: high ? await getBuffer(high) : null,
      low: low ? await getBuffer(low) : null
    });
    return {
      title: videoInfo.videoDetails.title,
      thumb: videoInfo.videoDetails.thumbnails.slice(-1)[0],
      date: formatDateAgo(videoInfo.videoDetails.publishDate),
      duration: formatTimeFromSeconds(videoInfo.videoDetails.lengthSeconds),
      views: formatNumber(videoInfo.videoDetails.viewCount),
      channel: videoInfo.videoDetails.ownerChannelName,
      direct_url: `https://www.youtube.com/watch?v=${videoId}`,
      videoQuality: await fetchQ(videoInfo.formats[0]?.url, videoInfo.formats[1]?.url),
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
      date: formatDateAgo(videoInfo.videoDetails.publishDate),
      duration: formatTimeFromSeconds(videoInfo.videoDetails.lengthSeconds),
      views: formatNumber(videoInfo.videoDetails.viewCount),
      channel: videoInfo.videoDetails.ownerChannelName,
      direct_url: `https://www.youtube.com/watch?v=${videoId}`,
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

function formatTimeFromSeconds(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  } else if (minutes > 0) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
  } else {
    return `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;
  }
}

function formatDateAgo(dateString) {
  const currentDate = new Date();
  const targetDate = new Date(dateString);
  const timeDiff = currentDate - targetDate;
  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 365) {
    const years = Math.floor(days / 365);
    return years === 1 ? "1 year ago" : `${years} years ago`;
  } else if (days > 30) {
    const months = Math.floor(days / 30);
    return months === 1 ? "1 month ago" : `${months} months ago`;
  } else if (days >= 1) {
    return days === 1 ? "1 day ago" : `${days} days ago`;
  } else if (hours >= 1) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  } else if (minutes >= 1) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  } else {
    return seconds === 1 ? "1 second ago" : `${seconds} seconds ago`;
  }
}
function getRandomNumber(range) {
      return Math.floor(Math.random() * range); //~ You can choose how much range should be of search list [random]
}
function formatNumber(number) {
  if (number >= 1000000) { return (number / 1000000).toFixed(1) + 'M';
  } else if (number >= 1000) { return (number / 1000).toFixed(1) + 'K';
  } else { return number.toString(); }
}
async function getBuffer(url) {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer'
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching the video:', error);
    return null;
  }
}

export default YT;
