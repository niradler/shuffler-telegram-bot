module.exports = (bot) =>
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(
      chatId,
      `
  Welcome to <b>@Shufflerbot</b>, thank you for using the bot.
        
  Available commands:
          
  /shuffle <b>mode</b> <b>options</b> - options to shuffle between your shuffle group.
  /show <b>shuffle ID</b> - show shuffle.
  /join <b>shuffle ID</b> - join a shuffle.
  /exit - exit all shuffle.

  Usage:
  /shuffle <b>fill/ignore/block</b> <b>citizen*10,killer*2</b>
          `,
      {
        parse_mode: "HTML",
      }
    );
  });
