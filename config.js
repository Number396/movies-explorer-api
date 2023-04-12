require('dotenv').config();
// eslint-disable-next-line no-useless-escape
const { PATTERN = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/ } = process.env;
const { PORT = '3000' } = process.env;
const { DB_ADDRESS = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

module.exports = {
  PORT,
  DB_ADDRESS,
  PATTERN,
};
