const { authenticate, refreshToken } = require('../auth');

module.exports = (app) => {
    app.post('/api/authenticate', authenticate);

    app.post('/api/token', refreshToken);
};