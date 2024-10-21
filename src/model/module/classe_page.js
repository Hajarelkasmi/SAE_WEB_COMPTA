// classe_page.js

const {Classe_Page} = require('../bd');
const { verifyToken, verifyAdmin } = require('../auth');

module.exports = (app) => {
    app.get('/api/classe_pages', async (req, res) => {
        try {
            const classe_pages = await Classe_Page.findAll();
            res.json(classe_pages);
        } catch (error) {
            res.status(500).json({error: 'An error occurred while fetching classe_pages'});
        }
    });

    app.post('/api/classe_pages', verifyToken, verifyAdmin, async (req, res) => {
        try {
            const classe_page = await Classe_Page.create({
                classe_id: req.body.classe_id,
                page_id: req.body.page_id
            });
            res.json(classe_page);
        } catch (error) {
            res.status(500).json({error: 'An error occurred while creating classe_page'});
        }
    });

    app.delete('/api/classe_pages/:id_classe/:id_page', verifyToken, verifyAdmin, async (req, res) => {
        try {
            const classe_page = await Classe_Page.findByPk(req.params.id_classe, req.params.id_page);
            if (classe_page) {
                await classe_page.destroy();
                res.json(classe_page);
            } else {
                res.status(404).json({error: 'Classe_Page not found'});
            }
        } catch (error) {
            res.status(500).json({error: 'An error occurred while deleting classe_page'});
        }
    });
}