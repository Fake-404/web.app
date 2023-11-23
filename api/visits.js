const visits = require('../lib/visits');
const { isKey } = require("../func/checkkey.js");
const code = require("../func/codes.js");

export default async (req, res) => {
  const databaseName = req.query.dbname || false;
  const key = req.query.key || false;
  
  const check = isKey(key, res);
  if (!check) {
    return;
  }

  if (!databaseName) {
    code._404(res, "Enter a database name.");
    return;
  }

  try {
    const response = await visits.incrementVisitorsCount(databaseName);
    code._200(res, { visitors: response });
  } catch (error) {
    console.error(error);
    code._403(res);
  }
}
