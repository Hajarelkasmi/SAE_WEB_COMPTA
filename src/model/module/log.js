const { verifyToken, verifyAdmin } = require('../auth');
const { Connexion_Log } = require('../bd');

module.exports = (app) => {
    app.get('/api/log/connexion', verifyToken, verifyAdmin, async (req, res) => {
        try {
            const logs = await Connexion_Log.findAll();
            res.json(logs);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching logs' });
        }
    });

};