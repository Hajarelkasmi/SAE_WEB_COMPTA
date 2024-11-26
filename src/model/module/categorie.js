// categorie.js
const { Categorie, SousCategorie, Carrousel } = require('../bd');
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

    app.get('/api/carrousel', async (req, res) => {
        try {
            const carrousel = await Carrousel.findAll();
            // récupérer les infos des catégories
            const resultat = [];
            for (const c of carrousel) {
                const categorie = await Categorie.findByPk(c.id_categorie);
                resultat.push({
                    id_carrousel: c.id,
                    id: c.id_categorie,
                    place: c.place,
                    nom: categorie.nom,
                    description: categorie.description,
                    est_public: categorie.est_public,
                    image: categorie.image,
                    alt_image: categorie.alt_image
                });
            }
            res.json(resultat);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching carrousel' });
        }
    });

    app.delete('/api/carrousel', verifyToken, verifyAdmin, async (req, res) => {
        try {
            await Carrousel.destroy({
                where: {},
                truncate: true
            });
            res.json({ message: 'Carrousel deleted' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });


    app.post('/api/carrousel', verifyToken, verifyAdmin, async (req, res) => {
        try {
            const carrousel = await Carrousel.create({
                id_categorie: req.body.id_categorie,
                place: req.body.place
            });
            res.json(carrousel);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while creating carrousel' });
        }
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
            console.error('Error creating category:', error);
            res.status(500).json({ error: 'An error occurred while creating category', details: error.message });
        }
    });

    app.put('/api/categories/:id', verifyToken, verifyAdmin, async (req, res) => {
        try {
            const categorie = await Categorie.findByPk(req.params.id);
            if (categorie) {
                await categorie.update({
                    nom: req.body.nom,
                    description: req.body.description,
                    est_public: req.body.est_public
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