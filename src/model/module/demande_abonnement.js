const { Demande_Abonnement, Etudiant, Classe} = require('../bd');
const { verifyToken, verifyAdmin } = require('../auth');

module.exports = (app) => {
    app.get('/api/demande_abonnements', async (req, res) => {
        try {
        const demande_abonnements = await Demande_Abonnement.findAll({
            include: {
                model: Etudiant,
                attributes: ['id','nom', 'prenom', 'mail'],
                include: {
                    model: Classe,
                    attributes: ['nom']
                }
            }
        });
        res.json(demande_abonnements);
        } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching demande_abonnements' });
        }
    });
    
    app.post('/api/demande_abonnements', verifyToken, verifyAdmin, async (req, res) => {
        try {
        const demande_abonnement = await Demande_Abonnement.create({ 
            etudiant_id: req.body.etudiant_id
        });
        res.json(demande_abonnement);
        } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating demande_abonnement' });
        }
    });

    
    // app.delete('/api/demande_abonnements/:id', verifyToken, verifyAdmin, async (req, res) => {
    app.delete('/api/demande_abonnements/:id', async (req, res) => {
            try {
        const demande_abonnement = await Demande_Abonnement.findByPk(req.params.id);
        if (demande_abonnement) {
            await demande_abonnement.destroy();
            res.json(demande_abonnement);
        }
        } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting demande_abonnement' });
        }
    }
    );
};