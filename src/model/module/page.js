// page.js
const {Page} = require('../bd');

module.exports = (app) => {
    app.get('/api/pages', async (req, res) => {
        try {
            const pages = await Page.findAll();
            res.json(pages);
        } catch (error) {
            res.status(500).json({error: 'An error occurred while fetching pages'});
        }
    });

    app.get('/api/pages/:id', async (req, res) => {
        try {
            const page = await Page.findByPk(req.params.id);
            if (page) {
                res.json(page);
            } else {
                res.status(404).json({error: 'Page not found'});
            }
        } catch (error) {
            res.status(500).json({error: 'An error occurred while fetching page'});
        }
    });

    app.post('/api/pages', async (req, res) => {
        try {
            const page = await Page.create({
                nom: req.body.nom,
                description: req.body.description,
                categorie_id: req.body.categorie_id,
                image: req.body.image,
                est_public: req.body.est_public
            });
            res.json(page);
        } catch (error) {
            res.status(500).json({error: 'An error occurred while creating page'});
        }
    });

    app.put('/api/pages/:id', async (req, res) => {
        try {
            const page = await Page.findByPk(req.params.id);
            if (page) {
                await page.update({
                    nom: req.body.nom,
                    description: req.body.description,
                    categorie_id: req.body.categorie_id,
                    image: req.body.image,
                    est_public: req.body.est_public
                });
                res.json(page);
            } else {
                res.status(404).json({error: 'Page not found'});
            }
        } catch (error) {
            res.status(500).json({error: 'An error occurred while updating page'});
        }
    });

    app.delete('/api/pages/:id', async (req, res) => {
        try {
            const page = await Page.findByPk(req.params.id);
            if (page) {
                await page.destroy();
                res.json(page);
            } else {
                res.status(404).json({error: 'Page not found'});
            }
        } catch (error) {
            res.status(500).json({error: 'An error occurred while deleting page'});
        }
    });
}