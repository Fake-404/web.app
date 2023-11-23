const { creator } = require("../configuration");
module.exports = {
  _404: (res, message) => {
    res.status(404).json({
      status: 404,
      creator: creator,
      message: message ? message : "Results not found."
    });
  },
 _401: (res, message) => {
   res.status(401).json({ 
      status: 401,
      creator: creator,
      message: message ? message : "Unauthorised, access key not found."
    });
 },
 _200: (res, results) => {
    res.status(200).json({ 
      status: 200,
      creator: creator,
      results: results
    });
 },
 _403: (res, message) => {
   res.status(403).json({
     status: 403,
     creator: creator,
     message: message ? message : "An internal server error occurred."
   });
 },
 _203: (res, message) => {
   res.status(203).json({
     status: 203,
     creator: creator,
     message: message ? message : "Invalid parameters entered."
   });
 }
}
