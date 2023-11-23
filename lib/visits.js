const Config = require('../configuration');
const { MongoClient } = require('mongodb');

const url = Config.uri;

exports.incrementVisitorsCount = async (dbName) => {
  const client = new MongoClient(url, { useUnifiedTopology: true });
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('visits');
    const collection = db.collection(dbName);

    // Increment visitorsCount by 1 or initialize if not present
    await collection.updateOne({}, { $inc: { visitorsCount: 1 } }, { upsert: true });

    // Retrieve total count
    const totalCount = await collection.findOne({}, { visitorsCount: 1 });

    return totalCount ? totalCount.visitorsCount : 0;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    client.close();
  }
}
