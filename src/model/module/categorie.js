// categorie.js
const { Categorie, SousCategorie } = require('../bd');
const { verifyToken, verifyAdmin } = require('../auth');
const { Sequelize } = require('sequelize');

module.exports = (app) => {
    app.get('/api/categories', async (req, res) => {
        try {
            const categories = await Categorie.findAll();
            res.json(categories);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching categories' });
        }
    });

    app.get('/api/bandeau', async (req, res) => {
        const enfant = await SousCategorie.findAll(
            {
                attributes: ['id_enfant'],
                unique: true
            }
        );

        const enfantIds = enfant.map(e => e.id_enfant);

        const parent = await Categorie.findAll({
            attributes: ['id', 'nom'],
            where: {
                id: {
                    [Sequelize.Op.notIn]: enfantIds
                }
            }
        });

        const resultat = [];
        for (const p of parent) {
            const sous_categories = await SousCategorie.findAll({
                where: {
                    id_parent: p.id
                }
            });
            const enfants = [];
            for (const sc of sous_categories) {
                enfants.push(await Categorie.findByPk(sc.id_enfant));
            }
            resultat.push({ id: p.id, nom: p.nom, enfants: enfants });
        }
        res.json(resultat);
    });

    app.get('/api/categories/:id', async (req, res) => {
        try {
            const categorie = await Categorie.findByPk(req.params.id);
            if (categorie) {
                res.json(categorie);
            } else {
                res.status(404).json({ error: 'Category not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching category' });
        }
    });

    app.post('/api/categories', verifyToken, verifyAdmin, async (req, res) => {
        try {
            const categorie = await Categorie.create({
                nom: req.body.nom,
                description: req.body.description,
                est_public: req.body.est_public
            });
            res.json(categorie);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while creating category' });
        }
    });

    app.put('/api/categories/:id', verifyToken, verifyAdmin, async (req, res) => {
        try {
            const categorie = await Categorie.findByPk(req.params.id);
            if (categorie) {
                await categorie.update({
                    nom: req.body.nom,
                    description: req.body.description,
                    est_public: req.body.est_public,
                    est_dans_carrousel: req.body.est_dans_carrousel
                });
                res.json(categorie);
            } else {
                res.status(404).json({ error: 'Category not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while updating category' });
        }
    });

    app.delete('/api/categories/:id', verifyToken, verifyAdmin, async (req, res) => {
        try {
            const categorie = await Categorie.findByPk(req.params.id);
            if (categorie) {
                await categorie.destroy();
                res.json(categorie);
            } else {
                res.status(404).json({ error: 'Category not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while deleting category' });
        }
    });
}