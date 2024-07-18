// appSetup.js
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const Redis = require("ioredis");
const cors = require("cors");
const bodyParser = require("body-parser");

class AppSetup {
  constructor() {
    this.env = process.env.NODE_ENV ? process.env.NODE_ENV.trim() : "development";
    this.app = express();
    this.server = http.createServer(this.app);
    // allow all origins in development
    this.io = new socketIO.Server(this.server, {
        cors: {
            origin: "*",
        }
        });

    // Redis client setup
    this.redisClient = this.setupRedisClient();

    // Setting up the middlewares for express app
    this.configureMiddleware();
  }

  getCORS() {
    if (this.env === "development") {
      return ["*", "http://192.168.1.16:3000", "http://192.168.1.16:3001"];
    }
  }

  setupRedisClient() {
    try {
      const client = new Redis({
        host: process.env.REDIS_HOST || "localhost",
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || "",
        username: process.env.REDIS_USER || ""
      });
      client.on('connect', () => {
        console.log("Connected to Redis");
      });

      client.on('error', (err) => {
        console.error("Error connecting to Redis:", err);
      });
      return client;
    } catch (error) {
      console.error("Error connecting to Redis:", error);
    }
  }

  configureMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    // allow all cors
    this.app.use(cors());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new AppSetup();
    }
    return this.instance;
  }
}

module.exports = AppSetup;
