const { Video, Rubrique } = require('../bd');

module.exports = (app) => {
    app.get('/api/videos', async (req, res) => {
        try {
        const videos = await Video.findAll();
        res.json(videos);
        } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching videos' });
        }
    });
    
    app.get('/api/videos/:id', async (req, res) => {
        try {
        const video = await Video.findByPk(req.params.id);
        if (video) {
            res.json(video);
        } else {
            res.status(404).json({ error: 'Video not found' });
        }
        } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching video' });
        }
    });
    
    app.post('/api/videos', async (req, res) => {
        try {
        const rubrique = await Rubrique.create({
            nom: req.body.nom, 
            description: req.body.description,
            page_id: req.body.page_id
        });
        const video = await Video.create({ 
            lien: req.body.lien, 
            rubrique_id: rubrique.id
        });
        res.json(video);
        } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating video' });
        }
    });
    
    app.put('/api/videos/:id', async (req, res) => {
        try {
        const rubrique = await Rubrique.findByPk(req.body.page_id);
        const video = await Video.findByPk(req.params.id);
        if (video) {
            await rubrique.update({
            nom: req.body.nom,
            description: req.body.description,
            page_id: req.body.page_id
            });
            await video.update({ 
            lien: req.body.lien,
            rubrique_id: req.body.rubrique_id
            });
            res.json(video);
        } else {
            res.status(404).json({ error: 'Video not found' });
        }
        } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating video' });
        }
    });
    
    app.delete('/api/videos/:id', async (req, res) => {
        try {
        const video = await Video.findByPk(req.params.id);
        if (video) {
            await video.destroy();
            res.json(video);
        } else {
            res.status(404).json({ error: 'Video not found' });
        }
        } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting video' });
        }
    });
};