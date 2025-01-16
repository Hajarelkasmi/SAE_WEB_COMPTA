// categorie.js
const { Categorie, SousCategorie, Carrousel, Etudiant } = require('../bd');
const { verifyToken, verifyAdmin, checkUserFromToken } = require('../auth');
const { Sequelize } = require('sequelize');

module.exports = (app) => {
    app.get('/api/categories', verifyToken, verifyAdmin, async (req, res) => {
        try {
            const categories = await Categorie.findAll();
            res.json(categories);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching categories' });
        }
    });

    app.get('/api/bandeau', async (req, res) => {
        const id_user = await checkUserFromToken(req);
        let est_abonne;
        if (id_user) {
            const etudiant = await Etudiant.findByPk(id_user);
            if (etudiant.est_abonne || etudiant.est_admin) {
                est_abonne = true;
            }
        }
        const enfant = await SousCategorie.findAll(
            {
                attributes: ['id_enfant'],
                unique: true
            }
        );

        const enfantIds = enfant.map(e => e.id_enfant);

        const condition_where = {
            id: {
                [Sequelize.Op.notIn]: enfantIds
            },
            est_public: true
        };

        if (est_abonne) {
            delete condition_where.est_public;
        }

        const parent = await Categorie.findAll({
            attributes: ['id', 'nom'],
            where: condition_where
        });

        const resultat = [];
        for (const p of parent) {
            const sous_categories = await SousCategorie.findAll({
                where: {
                    id_parent: p.id
                }
            });
            const enfants = [];
            const condition_where = est_abonne ? {} : { est_public: true };


            for (const sc of sous_categories) {
                let enfant = await Categorie.findOne({
                    where: {
                        id: sc.id_enfant,
                        ...condition_where
                    }
                });
                if (enfant) {
                    enfants.push(enfant);
                }
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
                if (categorie.est_public) {
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
                } else {
                    await c.destroy();
                }
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
            const categorie = await Categorie.findByPk(req.body.id_categorie);
            if (!categorie) {
                return res.status(404).json({ error: 'Categorie non trouvée' });
            }
            if (!categorie.est_public) {
                return res.status(403).json({ error: 'Categorie non publique' });
            }
            const carrousel = await Carrousel.create({
                id_categorie: req.body.id_categorie,
                place: req.body.place
            });
            res.json(carrousel);
        } catch (error) {
            res.status(500).json({ error: 'Une erreur est survenue lors de la création du carrousel', details: error.message });
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

    app.get('/api/sous_categories/:id', async (req, res) => {
        try {
            const id_user = await checkUserFromToken(req);
            let est_abonne;
            if (id_user) {
                const etudiant = await Etudiant.findByPk(id_user);
                if (etudiant.est_abonne || etudiant.est_admin) {
                    est_abonne = true;
                }
            }
            const sous_categories = await SousCategorie.findAll({
                where: {
                    id_parent: req.params.id
                }
            });
            const enfants = [];
            for (const sc of sous_categories) {
                const enfant = await Categorie.findByPk(sc.id_enfant);
                if (enfant && (est_abonne || enfant.est_public)) {
                    enfants.push(enfant);
                }
            }
            res.json(enfants);
        } catch (error) {
            res.status(500).json({error: 'An error occurred while fetching subcategories'});
        }
    });

    app.post('/api/categories', verifyToken, verifyAdmin, async (req, res) => {
        try {
            const categorie = await Categorie.create({
                nom: req.body.nom,
                description: req.body.description,
                image: req.body.image,
                est_public: req.body.est_public
            });
            res.json(categorie);
        } catch (error) {
            console.error('Error creating category:', error);
            res.status(500).json({ error: 'An error occurred while creating category', details: error.message });
        }
    });


    app.post('/api/sous_categories', verifyToken, verifyAdmin, async (req, res) => {
        try {
            const sous_categorie = await SousCategorie.create({
                id_parent: req.body.id_parent,
                id_enfant: req.body.id_enfant
            });
            res.json(sous_categorie);
        } catch (error) {
            res.status(500).json({error: 'An error occurred while creating subcategory'});
        }
    });

    app.put('/api/categories/:id', verifyToken, verifyAdmin, async (req, res) => {
        try {
            const categorie = await Categorie.findByPk(req.params.id);
            if (categorie) {
                await categorie.update({
                    nom: req.body.nom,
                    description: req.body.description,
                    image: req.body.image,
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