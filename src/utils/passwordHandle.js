const crypto = require('crypto');

const md5password = password => crypto.createHash('md5').update(password).digest('hex');

module.exports = md5password;