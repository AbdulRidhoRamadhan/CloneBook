const Redis = require("ioredis");

const redis = new Redis({
  port: 15319,
  host: process.env.HOST_REDIS,
  username: "default",
  password: process.env.PASSWORD_REDIS,
  db: 0,
});

module.exports = redis;
