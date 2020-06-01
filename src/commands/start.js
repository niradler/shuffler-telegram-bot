module.exports = (bot) =>
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(
      chatId,
      `
  Welcome to <b>@Shufflerbot</b>, thank you for using the bot.
        
  Available commands:
          
  /shuffle <b>mode</b> <b>options</b> - create a shuffle that can be shared between your shuffle group.
  /show <b>shuffle ID</b> - show shuffle.
  /join <b>shuffle ID</b> - join a shuffle.
  /edit <b>shuffle ID</b> <b>options</b> - edit shuffle option.

  Usage:
  /shuffle <b>fill/block</b> <b>citizen*10,killer*2</b>
          `,
      {
        parse_mode: "HTML",
      }
    );
  });
