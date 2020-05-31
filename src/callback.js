const { debug } = require("./helpers");

module.exports = (bot) =>
  bot.on("callback_query", (callbackQuery) => {
    const message = callbackQuery.message;
    const chatId = message.chat.id;
    let data = callbackQuery.data;
    data = JSON.parse(data);
    debug({ message, data });

  });
