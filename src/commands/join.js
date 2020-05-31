const { debug, shuffle } = require("../helpers");
const { query } = require("../db");
const get = require('lodash/get');

module.exports = (bot) =>
  bot.onText(/\/join/, async (msg, match) => {
    debug({ msg, match });
    const chatId = msg.chat.id;
    const code = match.input.split(' ')[1];
    try {
      let shuffleData = await query('SELECT * FROM shuffle where code = $1', [code]);
      shuffleData = get(shuffleData, 'rows[0]', false);
      if (!shuffleData) throw new Error('shuffle not found.')
      let usedOptions = await query('SELECT * FROM shuffle_participants where shuffle_id = $1', [shuffleData.id]);
      usedOptions = get(usedOptions, 'rows', []);
      let didGetOption = usedOptions.find(opt => opt.chat_id == chatId);
      if (didGetOption) {
        bot.sendMessage(chatId, `already join ${code}, and you are ${didGetOption.option}`);
        return
      }
      debug({ shuffleData, usedOptions })
      let options = [];
      for (const option in shuffleData.options) {
        let opt = new Array(shuffleData.options[option]).fill(option)
        options = [...options, ...opt];
      }
      debug({ options })
      for (let i = 0; i < 10; i++) {
        options = shuffle(options)
      }
      debug({ options })
      await query('INSERT INTO shuffle_participants (chat_id, shuffle_id, option, first_name, last_name) VALUES ($1, $2, $3, $4, $5);', [chatId, shuffleData.id, options[0], msg.chat.first_name, msg.chat.last_name]);
      bot.sendMessage(chatId, `you just join ${code}, and you are ${options[0]}`);
    } catch (error) {
      console.error(error)
      bot.sendMessage(chatId, `Failed to join a shuffle. (${error.message})`);
    }

  });
