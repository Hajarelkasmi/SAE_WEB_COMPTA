const { Lien, Rubrique, Etudiant } = require('../bd');
const { verifyToken, verifyAdmin, checkUserFromToken } = require('../auth');

module.exports = (app) => {
    app.get('/api/liens', async (req, res) => {
        try {
            const id_user = await checkUserFromToken(req);
            let est_abonne;
            if (id_user) {
                const etudiant = await Etudiant.findByPk(id_user);
                if (etudiant.est_abonne || etudiant.est_admin) {
                    est_abonne = true;
                }
            }
            const { page_id } = req.query; 
            const condition_where = page_id ? { page_id } : {};
            if (!est_abonne) {
                condition_where.est_public = true;
            }
            const liens = await Lien.findAll({
                include: {
                    model: Rubrique,
                    attributes: ['id', 'nom', 'description', 'page_id', 'position'],
                    where: condition_where
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
        const max_position_rubrique = await Rubrique.findOne({
            where: { page_id: req.body.page_id },
            order: [['position', 'DESC']]
        });
        const position = max_position_rubrique ? max_position_rubrique.position + 1 : 0;
        const rubrique = await Rubrique.create({
            nom: req.body.nom, 
            description: req.body.description,
            page_id: req.body.page_id,
            position: position,
            est_public: req.body.est_public
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
            page_id: req.body.page_id,
            position: req.body.position,
            est_public: req.body.est_public
            });
            await lien.update({ 
            lien: req.body.lien,
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