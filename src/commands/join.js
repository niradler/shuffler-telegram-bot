const { debug, shuffle } = require("../helpers");
const { query } = require("../db");
const get = require('lodash/get');

const getRandomOption = (randomOptions) => {
  const randomIndex = Math.floor(Math.random() * randomOptions.length) + 1;
  debug(randomIndex, randomOptions)
  return randomOptions[randomIndex - 1];
}

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
      debug({ shuffleData, usedOptions })
      if (didGetOption) {
        bot.sendMessage(chatId, `already join ${code}, and you are ${didGetOption.option}`);
        return
      }
      let options = [];
      for (const option in shuffleData.options) {
        let opt = new Array(shuffleData.options[option]).fill(option);
        options = [...options, ...opt];
      }

      let randomOptions = []
      for (let i = 0; i < 10; i++) {
        randomOptions = shuffle(options);
      }

      debug({ options, randomOptions })

      let avilableOptions = JSON.parse(JSON.stringify(randomOptions));
      usedOptions.forEach((usedOption) => {
        const index = avilableOptions.indexOf(usedOption.option);
        avilableOptions.splice(index, 1);
      });

      debug({ avilableOptions })

      let newOption = avilableOptions[0];
      if (avilableOptions.length == 0) {
        if (shuffleData.mode == 'block') {
          throw new Error('No option left, ask the shuffle owner to add more.');
        }
        newOption = getRandomOption(randomOptions);
      }

      await query('INSERT INTO shuffle_participants (chat_id, shuffle_id, option, first_name, last_name) VALUES ($1, $2, $3, $4, $5);', [chatId, shuffleData.id, newOption, msg.chat.first_name, msg.chat.last_name]);
      bot.sendMessage(chatId, `you just join ${code}, and you are ${options[0]}`);
    } catch (error) {
      console.error(error)
      bot.sendMessage(chatId, `Failed to join a shuffle. (${error.message})`);
    }

  });
