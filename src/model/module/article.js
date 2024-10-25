const { Article, Rubrique } = require('../bd');
const { verifyToken, verifyAdmin } = require('../auth');

module.exports = (app) => {
    app.get('/api/articles', async (req, res) => {
        const { page_id } = req.query; 
        try {
        const articles = await Article.findAll({
            include: {
                model: Rubrique,
                attributes: ['id', 'nom', 'description', 'page_id'],
                where: page_id ? { page_id } : {},
            },
        });
        res.json(articles);
        } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching articles' });
        }
    });
    
    app.get('/api/articles/:id', async (req, res) => {
        try {
        const article = await Article.findByPk(req.params.id);
        if (article) {
            res.json(article);
        } else {
            res.status(404).json({ error: 'Article not found' });
        }
        } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching article' });
        }
    });
    
    app.post('/api/articles', verifyToken, verifyAdmin, async (req, res) => {
        try {
        const rubrique = await Rubrique.create({
            nom: req.body.nom, 
            description: req.body.description,
            page_id: req.body.page_id
        });
        const article = await Article.create({ 
            texte: req.body.texte, 
            image: req.body.image,
            rubrique_id: rubrique.id
        });
        res.json(article);
        } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating article' });
        }
    });
    
    app.put('/api/articles/:id', verifyToken, verifyAdmin, async (req, res) => {
        try {
        const rubrique = await Rubrique.findByPk(req.body.rubrique_id);
        const article = await Article.findByPk(req.params.id);
        if (article) {
            await rubrique.update({
            nom: req.body.nom,
            description: req.body.description,
            page_id: req.body.page_id
            });
            await article.update({ 
            texte: req.body.texte,
            image: req.body.image,
            rubrique_id: req.body.rubrique_id
            });
            res.json(article);
        } else {
            res.status(404).json({ error: 'Article not found' });
        }
        } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating article' });
        }
    });

    app.delete('/api/articles/:id', verifyToken, verifyAdmin, async (req, res) => {
        try {
        const article = await Article.findByPk(req.params.id);
        if (article) {
            await article.destroy();
            res.json(article);
        } else {
            res.status(404).json({ error: 'Article not found' });
        }
        } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting article' });
        }
    });

}