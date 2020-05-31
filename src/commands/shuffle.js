const { debug, shuffleParser } = require("../helpers");
const { query } = require("../db");
const randomstring = require("randomstring");


module.exports = (bot) =>
  bot.onText(/\/shuffle/, async (msg, match) => {
    debug({ msg, match });
    const chatId = msg.chat.id;
    try {
      const shuffleData = shuffleParser(match.input);
      const code = randomstring.generate(10);
      debug({ ...shuffleData, code })
      await query('INSERT INTO shuffle (command, options, mode, code) VALUES ($1, $2, $3, $4)', [shuffleData.command, shuffleData.options, shuffleData.mode, code])
      bot.sendMessage(chatId, `new shuffle created successfully, ask your follow shuffler to join you with typing /join ${code} in the bot chat.`);
    } catch (error) {
      console.error(error.message)
      bot.sendMessage(chatId, "Failed to create a shuffle.");
    }

  });
