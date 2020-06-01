const Pool = require("pg").Pool;

let pool;

const debug = (...args) =>
  process.env.NODE_ENV != "prod" && console.log(...args);

const getOptions = (options) => {
  return options.split(',').reduce((opt, o) => {
    const amountIndex = o.indexOf('*');
    let amount = 1;
    if (amountIndex > -1) {
      amount = Number(o.substring(amountIndex + 1));
      o = o.replace('*' + amount, '');
    }

    opt[o] = amount;

    return opt;
  }, {})
}

const shuffleParser = (input) => {
  const [command, mode, options] = input.split(' ');
  debug({ command, mode, options });
  let data = { command, mode };

  if (options) { data.options = getOptions(options); }
  else { throw new Error('missing options.') }

  return data;
}

const shuffleEditParser = (input) => {
  const [command, code, options] = input.split(' ');
  debug({ command, code, options });
  let data = { command, code };

  if (options) { data.options = getOptions(options); }
  else { throw new Error('missing options.') }

  return data;
}

const getPool = () => {
  if (!pool)
    pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });

  return pool;
};

const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

module.exports = {
  shuffle,
  debug,
  shuffleParser,
  shuffleEditParser,
  getPool,
};
