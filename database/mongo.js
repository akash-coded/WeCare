// ./database/mongo.js
const { MongoMemoryServer } = require("mongodb-memory-server");
const { MongoClient } = require("mongodb");

let database = null;

async function startDatabase() {
  const mongo = new MongoMemoryServer();
  const mongoDBUri = await mongo.getUri();
  const connection = await MongoClient.connect(mongoDBUri, {
    useNewUrlParser: true,
  });
  database = connection.db();
}

async function getDatabase() {
  if (!database) await startDatabase();
  return database;
}

module.exports = {
  getDatabase,
  startDatabase,
};
