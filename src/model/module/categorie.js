// categorie.js
const {Categorie} = require('../bd');

module.exports = (app) => {
    app.get('/api/categories', async (req, res) => {
        try {
            const categories = await Categorie.findAll();
            res.json(categories);
        } catch (error) {
            res.status(500).json({error: 'An error occurred while fetching categories'});
        }
    });

    app.get('/api/categories/:id', async (req, res) => {
        try {
            const categorie = await Categorie.findByPk(req.params.id);
            if (categorie) {
                res.json(categorie);
            } else {
                res.status(404).json({error: 'Category not found'});
            }
        } catch (error) {
            res.status(500).json({error: 'An error occurred while fetching category'});
        }
    });

    app.post('/api/categories', async (req, res) => {
        try {
            const categorie = await Categorie.create({
                nom: req.body.name,
                description: req.body.description,
                est_public: req.body.est_public
            });
            res.json(categorie);
        } catch (error) {
            res.status(500).json({error: 'An error occurred while creating category'});
        }
    });

    app.put('/api/categories/:id', async (req, res) => {
        try {
            const categorie = await Categorie.findByPk(req.params.id);
            if (categorie) {
                await categorie.update({
                    nom: req.body.name,
                    description: req.body.description,
                    est_public: req.body.est_public
                });
                res.json(categorie);
            } else {
                res.status(404).json({error: 'Category not found'});
            }
        } catch (error) {
            res.status(500).json({error: 'An error occurred while updating category'});
        }
    });

    app.delete('/api/categories/:id', async (req, res) => {
        try {
            const categorie = await Categorie.findByPk(req.params.id);
            if (categorie) {
                await categorie.destroy();
                res.json(categorie);
            } else {
                res.status(404).json({error: 'Category not found'});
            }
        } catch (error) {
            res.status(500).json({error: 'An error occurred while deleting category'});
        }
    });
}