const { verifyToken, verifyAdmin } = require('../auth');
const fs = require('fs');
const path = require('path');

module.exports = (app) => {
    app.post('/api/images', verifyToken, verifyAdmin, async (req, res) => {
        try {
            const { image } = req.files;
            const { name } = req.body;

            if (!image) return res.sendStatus(400);

            if (!/^image/.test(image.mimetype)) return res.sendStatus(400);

            const uploadPath = path.join(__dirname, '../../../public/static/image');

            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }

            const imagePath = path.join(uploadPath, name);
            image.mv(imagePath, (err) => {
                if (err) {
                    console.error('Error moving the image:', err);
                    return res.sendStatus(500);
                }

                res.sendStatus(200);
            });
        } catch (error) {
            console.error('Error handling the image upload:', error);
            res.sendStatus(500);
        }
    });

    app.delete('/api/images/:name', verifyToken, verifyAdmin, async (req, res) => {
        try {
            const { name } = req.params;

            const imagePath = path.join(__dirname, '../../../public/static/image', name);

            if (!fs.existsSync(imagePath)) return res.sendStatus(404);

            fs.unlinkSync(imagePath);

            res.sendStatus(200);
        } catch (error) {
            console.error('Error handling the image deletion:', error);
            res.sendStatus(500);
        }
    });
};