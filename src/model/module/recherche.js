const { Rubrique, Page, Categorie } = require('../bd');
const { verifyToken, verifyAdmin, checkUserFromToken } = require('../auth');

module.exports = (app) => {
    app.get('/api/recherche', async (req, res) => {
        try {
            const id_user = await checkUserFromToken(req);
            let est_abonne;
            if (id_user) {
                const etudiant = await Etudiant.findByPk(id_user);
                if (etudiant.est_abonne || etudiant.est_admin) {
                    est_abonne = true;
                }
            }
            let rubriques, pages, categories;
                if (est_abonne) {
                    rubriques = await Rubrique.findAll();
                    pages = await Page.findAll();
                    categories = await Categorie.findAll();
                } else {
                    rubriques = await Rubrique.findAll({
                        where: {
                            est_public: true
                        },
                    });
                    pages = await Page.findAll({
                        where: {
                            est_public: true
                        }
                    });
                    categories = await Categorie.findAll({
                        where: {
                            est_public: true
                        }
                    });
                }
            res.json({ rubriques, pages, categories });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred' });
        }
    });
}