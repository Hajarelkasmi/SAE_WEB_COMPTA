// page.js
const { Page, Etudiant } = require('../bd');
const { verifyToken, verifyAdmin, checkUserFromToken } = require('../auth');

module.exports = (app) => {
    app.get('/api/pages', async (req, res) => {
        try {
            const id_user = await checkUserFromToken(req);
            let est_abonne;
            if (id_user) {
                const etudiant = await Etudiant.findByPk(id_user);
                if (etudiant.est_abonne || etudiant.est_admin) {
                    est_abonne = true;
                }
            }

            const categorie_id = req.query.categorie_id;
            if (categorie_id) {
                if (est_abonne) {
                    const pages = await Page.findAll({
                        where: {
                            categorie_id: categorie_id
                        }
                    });
                    res.json(pages);
                } else {
                    const pages = await Page.findAll({
                        where: {
                            categorie_id: categorie_id,
                            est_public: true
                        }
                    });
                    res.json(pages);
                }
            } else {
                if (est_abonne) {
                    const pages = await Page.findAll();
                    res.json(pages);
                } else {
                    const pages = await Page.findAll({
                        where: {
                            est_public: true
                        }
                    });
                    res.json(pages);
                }
            }
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching pages' });
        }
    });

    app.get('/api/pages/:id', async (req, res) => {
        try {
            const id_user = await checkUserFromToken(req);
            let est_abonne;
            if (id_user) {
                const etudiant = await Etudiant.findByPk(id_user);
                if (etudiant.est_abonne || etudiant.est_admin) {
                    est_abonne = true;
                }
            }
            if (est_abonne) {
                const page = await Page.findByPk(req.params.id);
                if (page) {
                    res.json(page);
                } else {
                    res.status(404).json({ error: 'Page not found' });
                }
            } else {
                const page = await Page.findOne({
                    where: {
                        id: req.params.id,
                        est_public: true
                    }
                });
                if (page) {
                    res.json(page);
                } else {
                    res.status(404).json({ error: 'Page not found' });
                }
            }
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching page' });
        }
    });

    app.post('/api/pages', verifyToken, verifyAdmin, async (req, res) => {
        try {
            const page = await Page.create({
                nom: req.body.nom,
                description: req.body.description,
                categorie_id: req.body.categorie_id,
                image: req.body.image,
                est_public: req.body.est_public,
                placement_image: req.body.placement_image,
            });
            res.json(page);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while creating page' });
        }
    });

    app.put('/api/pages/:id', verifyToken, verifyAdmin, async (req, res) => {
        try {
            const page = await Page.findByPk(req.params.id);
            if (page) {
                await page.update({
                    nom: req.body.nom,
                    description: req.body.description,
                    image: req.body.image,
                    est_public: req.body.est_public,
                    placement_image: req.body.placement_image,
                });
                res.json(page);
            } else {
                res.status(404).json({ error: 'Page not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while updating page' });
        }
    });

    app.delete('/api/pages/:id', verifyToken, verifyAdmin, async (req, res) => {
        try {
            const page = await Page.findByPk(req.params.id);
            if (page) {
                await page.destroy();
                res.json(page);
            } else {
                res.status(404).json({ error: 'Page not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while deleting page' });
        }
    });
}