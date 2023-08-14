const fs = require('fs');
const path = require('path');


const PRIVATE_KEY = fs.readFileSync(path.resolve(__dirname, './keys/private.key'));
const PUBLIC_KEY = fs.readFileSync(path.resolve(__dirname, './keys/public.key'));

const APPID = 'wx47fbaf198086b31c';
const SECRET = '0246be2d5fbdb1d82e61b2edc1603004';
const GRANT_TYPE = 'authorization_code';
const MYSQL_CONFIG = {
  host: '',
  port: '',
  database: '',
  user: '',
  password: '
};


module.exports = {
  APPID,
  SECRET,
  GRANT_TYPE,
  MYSQL_CONFIG,
  PRIVATE_KEY,
  PUBLIC_KEY
};
