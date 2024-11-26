const bcrypt = require('bcrypt');
const saltRounds = 10;

const Cryptage = (password) => {
    return bcrypt.hash(password, saltRounds);
}

const Compare = (password, hash) => {
    return bcrypt.compare(password, hash);
}

module.exports = { Cryptage, Compare };