const shuffle = require("./shuffle");
const join = require("./join");
const start = require("./start");
const show = require("./show");
const edit = require("./edit");

module.exports = (bot) => {
  shuffle(bot);
  start(bot);
  join(bot);
  show(bot);
  edit(bot)

  return bot;
};
