const fs = require('fs');
const path = require('path');


const PRIVATE_KEY = fs.readFileSync(path.resolve(__dirname, './keys/private.key'));
const PUBLIC_KEY = fs.readFileSync(path.resolve(__dirname, './keys/public.key'));

const APPID = '';
const SECRET = '';
const GRANT_TYPE = '';
const MYSQL_CONFIG = {
  host: '',
  port: '',
  database: '',
  user: '',
  password: ''
};


module.exports = {
  APPID,
  SECRET,
  GRANT_TYPE,
  MYSQL_CONFIG,
  PRIVATE_KEY,
  PUBLIC_KEY
};
