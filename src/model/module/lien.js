const { Lien, Rubrique } = require('../bd');
const { verifyToken, verifyAdmin } = require('../auth');

module.exports = (app) => {
    app.get('/api/liens', async (req, res) => {
        const { page_id } = req.query; 
        try {
            const liens = await Lien.findAll({
                include: {
                    model: Rubrique,
                    attributes: ['id', 'nom', 'description', 'page_id'],
                    where: page_id ? { page_id } : {},
                },
            });
            res.json(liens);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching liens' });
        }
    });
    
    app.get('/api/liens/:id', async (req, res) => {
        try {
        const lien = await Lien.findByPk(req.params.id);
        if (lien) {
            res.json(lien);
        } else {
            res.status(404).json({ error: 'Lien not found' });
        }
        } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching lien' });
        }
    });
    
    app.post('/api/liens', verifyToken, verifyAdmin, async (req, res) => {
        try {
        const rubrique = await Rubrique.create({
            nom: req.body.nom, 
            description: req.body.description,
            page_id: req.body.page_id
        });
        const lien = await Lien.create({ 
            lien: req.body.lien, 
            rubrique_id: rubrique.id
        });
        res.json(lien);
        } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating lien' });
        }
    });
    
    app.put('/api/liens/:id', verifyToken, verifyAdmin, async (req, res) => {
        try {
        const rubrique = await Rubrique.findByPk(req.body.rubrique_id);
        const lien = await Lien.findByPk(req.params.id);
        if (lien) {
            await rubrique.update({
            nom: req.body.nom,
            description: req.body.description,
            page_id: req.body.page_id
            });
            await lien.update({ 
            url: req.body.lien,
            rubrique_id: req.body.rubrique_id
            });
            res.json(lien);
        } else {
            res.status(404).json({ error: 'Lien not found' });
        }
        } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating lien' });
        }
    });

    app.delete('/api/liens/:id', verifyToken, verifyAdmin, async (req, res) => {
        try {
        const lien = await Lien.findByPk(req.params.id);
        if (lien) {
            const rubrique = await Rubrique.findByPk(lien.rubrique_id);
            await lien.destroy();
            await rubrique.destroy();
            res.json(lien);
        } else {
            res.status(404).json({ error: 'Lien not found' });
        }
        } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting lien' });
        }
    });
}