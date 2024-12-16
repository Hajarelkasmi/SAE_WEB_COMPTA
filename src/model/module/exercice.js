const { Exercice, Rubrique, Etudiant } = require('../bd');
const { verifyToken, verifyAdmin, checkUserFromToken } = require('../auth');

module.exports = (app) => {
    app.get('/api/exercices', async (req, res) => {
        const id_user = await checkUserFromToken(req);
        let est_abonne;
        if (id_user) {
            const etudiant = await Etudiant.findByPk(id_user);
            if (etudiant.est_abonne || etudiant.est_admin) {
                est_abonne = true;
            }
        }
        const { page_id } = req.query; 
        try {
        const condition_where = page_id ? { page_id } : {};
        if (!est_abonne) {
            condition_where.est_public = true;
        }
        const exercices = await Exercice.findAll({
            include: {
                model: Rubrique,
                attributes: ['id', 'nom', 'description', 'page_id', 'position'],
                where: condition_where
            },
        });
        res.json(exercices);
        } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching exercices' });
        }
    });
    
    app.get('/api/exercices/:id', async (req, res) => {
        try {
        const exercice = await Exercice.findByPk(req.params.id);
        if (exercice) {
            res.json(exercice);
        } else {
            res.status(404).json({ error: 'Exercice not found' });
        }
        } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching exercice' });
        }
    });
    
    app.post('/api/exercices', verifyToken, verifyAdmin, async (req, res) => {
        try {
        const rubrique = await Rubrique.create({
            nom: req.body.nom, 
            description: req.body.description,
            page_id: req.body.page_id,
            est_public: req.body.est_public
        });
        const exercice = await Exercice.create({ 
            texte: req.body.texte,
            lien_fichier: req.body.lien_fichier,
            rubrique_id: rubrique.id
        });
        res.json(exercice);
        }
        catch (error) {
            res.status(500).json({ error: 'An error occurred while creating exercice' });
        }
    }
    );

    app.put('/api/exercices/:id', verifyToken, verifyAdmin, async (req, res) => {
        try {
        const rubrique = await Rubrique.findByPk(req.body.rubrique_id);
        const exercice = await Exercice.findByPk(req.params.id);
        if (exercice) {
            await rubrique.update({
            nom: req.body.nom,
            description: req.body.description,
            page_id: req.body.page_id,
            est_public: req.body.est_public
            });
            await exercice.update({ 
            texte: req.body.texte,
            lien_fichier: req.body.lien_fichier,
            rubrique_id: req.body.rubrique_id
            });
            res.json(exercice);
        } else {
            res.status(404).json({ error: 'Exercice not found' });
        }
        } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating exercice' });
        }
    });

    app.delete('/api/exercices/:id', verifyToken, verifyAdmin, async (req, res) => {
        try {
        const exercice = await Exercice.findByPk(req.params.id);
        if (exercice) {
            await exercice.destroy();
            res.json(exercice);
        } else {
            res.status(404).json({ error: 'Exercice not found' });
        }
        } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting exercice' });
        }
    });

}
