const { getPool, debug } = require("./helpers");

const query = (sql, vars = []) =>
  new Promise((resolve, reject) => {
    getPool().query(sql, vars, (error, results) => {
      debug({ error, results })
      if (error) {
        reject(error);
      }
      resolve(results);
    });
  });

module.exports = {
  query,
};
