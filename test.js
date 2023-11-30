/* Only for testing */

const fs = require('fs')
const image = fs.readFileSync('./test.jpg')

const { imgToText } = require('./lib/scraper')

imgToText(image, 'eng')
.then((res) => console.log(res))