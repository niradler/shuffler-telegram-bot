const { debug } = require("../helpers");
const { query } = require("../db");
const get = require('lodash/get');

module.exports = (bot) =>
  bot.onText(/\/show/, async (msg, match) => {
    debug({ msg, match });
    const chatId = msg.chat.id;
    try {
      const code = match.input.split(' ')[1];
      let shuffleData = await query('SELECT * FROM shuffle where code = $1 AND chat_id = $2', [code, chatId]);
      shuffleData = get(shuffleData, 'rows[0]', false);
      if (!shuffleData) throw new Error('shuffle not found.')

      let usedOptions = await query('SELECT * FROM shuffle_participants where shuffle_id = $1', [shuffleData.id]);
      usedOptions = get(usedOptions, 'rows', []);
      bot.sendMessage(chatId, `
<b>shuffle ID:</b>${shuffleData.code}
<b>shuffle Options:</b>${Object.keys(shuffleData.options).map(key => key + "*" + shuffleData.options[key]).join(',')}
row - name - option
${usedOptions.map((o, i) => `${i + 1}.  - ${o.first_name} ${o.last_name} - ${o.option}`).join('\n')}
      `, {
        parse_mode: "HTML",
      });

    } catch (error) {
      console.error(error.message)
      bot.sendMessage(chatId, "Failed to show shuffle.");
    }

  });
