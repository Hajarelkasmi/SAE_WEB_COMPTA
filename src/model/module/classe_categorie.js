// classe_categories.js

const {Classe_Categorie} = require('../bd');

module.exports = (app) => {
    app.get('/api/classe_categories', async (req, res) => {
        try {
            const classe_categories = await Classe_Categorie.findAll();
            res.json(classe_categories);
        } catch (error) {
            res.status(500).json({error: 'An error occurred while fetching classe_categories'});
        }
    });

    app.post('/api/classe_categories', async (req, res) => {
        try {
            const classe_categorie = await Classe_Categorie.create({
                classe_id: req.body.classe_id,
                categorie_id: req.body.categorie_id
            });
            res.json(classe_categorie);
        } catch (error) {
            res.status(500).json({error: 'An error occurred while creating classe_categorie'});
        }
    });

    app.delete('/api/classe_categories/:id_classe/:id_cat', async (req, res) => {
        try {
            const classe_categorie = await Classe_Categorie.findByPk(req.params.id_classe, req.params.id_cat);
            if (classe_categorie) {
                await classe_categorie.destroy();
                res.json(classe_categorie);
            } else {
                res.status(404).json({error: 'Classe_Categorie not found'});
            }
        } catch (error) {
            res.status(500).json({error: 'An error occurred while deleting classe_categorie'});
        }
    });
}