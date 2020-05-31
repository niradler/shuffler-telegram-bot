require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const commands = require("./commands");
const token = process.env.TOKEN;

const bot = new TelegramBot(token, {
  polling: true,
});

commands(bot);

console.log("running...", new Date());
