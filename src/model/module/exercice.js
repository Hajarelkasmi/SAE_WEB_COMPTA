const { Exercice, Rubrique } = require('../bd');
const { verifyToken, verifyAdmin } = require('../auth');

module.exports = (app) => {
    app.get('/api/exercices', async (req, res) => {
        try {
        const exercices = await Exercice.findAll();
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
            page_id: req.body.page_id
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
        const rubrique = await Rubrique.findByPk(req.body.page_id);
        const exercice = await Exercice.findByPk(req.params.id);
        if (exercice) {
            await rubrique.update({
            nom: req.body.nom,
            description: req.body.description,
            page_id: req.body.page_id
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
