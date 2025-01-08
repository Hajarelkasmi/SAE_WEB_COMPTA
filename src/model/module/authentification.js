const { authenticate, refreshToken, changePassword } = require('../auth');

module.exports = (app) => {
    app.post('/api/authenticate', authenticate);

    app.post('/api/token', refreshToken);

    app.post('/api/changePassword', changePassword);
};