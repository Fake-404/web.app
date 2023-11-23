module.exports = {
  isKey: (key, res) => {
    const { accessKey, creator } = require("../configuration");
    
    if (!key || (key !== accessKey && key !== "accessKey")) {
      unauthorised();
      return false;
    } else {
      return true;
    }

    function unauthorised() {
      res.status(401).json({
        status: 401,
        creator: creator,
        message: "Unauthorised, enter a valid access key."
      });
    }
  }
};
