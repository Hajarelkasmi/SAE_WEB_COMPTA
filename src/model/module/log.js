const { verifyToken, verifyAdmin } = require('../auth');
const { Connexion_Log, Etudiant } = require('../bd');

module.exports = (app) => {
    app.get('/api/log/connexion', verifyToken, verifyAdmin, async (req, res) => {
        try {
            const logs = await Connexion_Log.findAll({
                attributes: ['date'],
                include: [
                    {
                        model: Etudiant,
                        attributes: ['classe_id'],
                    }
                ],
                order: [['date', 'DESC']],
            });   
            const formated_data = {
                logs: logs.map(log => ({
                    date: log.date,
                    classe_id: log.Etudiant.classe_id
                }))
            }
            res.json(formated_data); 
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching logs' });
        }
    });

};