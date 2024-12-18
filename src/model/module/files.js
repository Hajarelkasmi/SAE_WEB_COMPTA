const { verifyToken, verifyAdmin } = require('../auth');
const fs = require('fs');
const path = require('path');

module.exports = (app) => {
    app.post('/api/files', verifyToken, verifyAdmin, async (req, res) => {
        try {
            const { file } = req.files;
            const { name } = req.body;
            console.log('file', file);
            console.log('name', name);

            if (!file) return res.sendStatus(400);

            const uploadPath = path.join(__dirname, '../../../public/static/files');

            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }

            const filePath = path.join(uploadPath, name);
            file.mv(filePath, (err) => {
                if (err) {
                    console.error('Error moving the file:', err);
                    return res.sendStatus(500);
                }

                res.sendStatus(200);
            });
        } catch (error) {
            console.error('Error handling the file upload:', error);
            res.sendStatus(500);
        }
    });

};