const shuffle = require("./shuffle");
const join = require("./join");
const start = require("./start");

module.exports = (bot) => {
  shuffle(bot);
  start(bot);
  join(bot);

  return bot;
};
