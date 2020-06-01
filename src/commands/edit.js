const { debug, shuffleEditParser } = require("../helpers");
const { query } = require("../db");

module.exports = (bot) =>
  bot.onText(/\/edit/, async (msg, match) => {
    debug({ msg, match });
    const chatId = msg.chat.id;
    try {
      const data = shuffleEditParser(match.input);
      debug({ data })
      await query('UPDATE shuffle SET options = $1 where code = $2 AND chat_id = $3', [data.options, data.code, chatId]);
      bot.sendMessage(chatId, `shuffle ${data.code}, updated. (use /show ${data.code} to see updated shuffle)`);
    } catch (error) {
      console.error(error.message)
      bot.sendMessage(chatId, "Failed to show shuffle.");
    }

  });
