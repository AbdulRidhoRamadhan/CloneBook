const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);
const database = client.db("gc01-assignment");

module.exports = { database };
