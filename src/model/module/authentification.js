const { authenticate } = require('../auth');

module.exports = (app) => {
    app.post('/api/authenticate', authenticate);
};