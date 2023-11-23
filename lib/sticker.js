const { Sticker, StickerTypes } = require("wa-sticker-formatter");

exports.getSticker = async (media, packname, author) => {
  const image = Buffer.from(media, 'base64');
  const sticker = new Sticker(image, {
    pack: packname,
    author: author,
    type: StickerTypes.FULL,
    categories: ['🥵', '🎐'],
    id: '12345',
    quality: 70,
    background: 'transparent'
  });
  const toBuffer = await sticker.toBuffer();
  return toBuffer.toString('base64');
};
