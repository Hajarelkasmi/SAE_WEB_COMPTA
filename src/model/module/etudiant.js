const { Etudiant } = require('../bd');

module.exports = (app) => {
    app.get('/api/etudiants', async (req, res) => {
        try {
        const etudiants = await Etudiant.findAll();
        res.json(etudiants);
        } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching etudiants' });
        }
    });
    
    app.get('/api/etudiants/:id', async (req, res) => {
        try {
        const etudiant = await Etudiant.findByPk(req.params.id);
        if (etudiant) {
            res.json(etudiant);
        } else {
            res.status(404).json({ error: 'Etudiant not found' });
        }
        } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching etudiant' });
        }
    });
    
    app.post('/api/etudiants', async (req, res) => {
        try {
        const etudiant = await Etudiant.create({ 
            nom: req.body.nom, 
            prenom: req.body.prenom, 
            mail: req.body.mail,
            mot_de_passe: req.body.mot_de_passe,
            classe_id: req.body.classe_id,
            est_abonne: req.body.est_abonne,
            est_admin: req.body.est_admin
        });
        res.json(etudiant);
        } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating etudiant' });
        }
    });
    
    app.put('/api/etudiants/:id', async (req, res) => {
        try {
        const etudiant = await Etudiant.findByPk(req.params.id);
        if (etudiant) {
            await etudiant.update({ 
            nom: req.body.nom,
            prenom: req.body.prenom,
            mail: req.body.mail,
            mot_de_passe: req.body.mot_de_passe,
            classe_id: req.body.classe_id,
            est_abonne: req.body.est_abonne,
            est_admin: req.body.est_admin
            });
            res.json(etudiant);
        } else {
            res.status(404).json({ error: 'Etudiant not found' });
        }
        } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating etudiant' });
        }
    });
    
    app.delete('/api/etudiants/:id', async (req, res) => {
        try {
        const etudiant = await Etudiant.findByPk(req.params.id);
        if (etudiant) {
            await etudiant.destroy();
            res.json(etudiant);
        } else {
            res.status(404).json({ error: 'Etudiant not found' });
        }
        } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting etudiant' });
        }
    });
}
