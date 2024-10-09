// classe.js
const { Classe } = require('../bd'); // Chemin correct vers bd.js

module.exports = (app) => {
  app.get('/api/classes', async (req, res) => {
    try {
      const classes = await Classe.findAll();
      res.json(classes);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching classes' });
    }
  });

  app.get('/api/classes/:id', async (req, res) => {
    try {
      const classe = await Classe.findByPk(req.params.id);
      if (classe) {
        res.json(classe);
      } else {
        res.status(404).json({ error: 'Class not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching class' });
    }
  });

  app.post('/api/classes', async (req, res) => {
    try {
      const classe = await Classe.create({ nom: req.body.nom });
      res.json(classe);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while creating class' });
    }
  });

    app.put('/api/classes/:id', async (req, res) => {
        try {
        const classe = await Classe.findByPk(req.params.id);
        if (classe) {
            await classe.update({ nom: req.body.nom });
            res.json(classe);
        } else {
            res.status(404).json({ error: 'Class not found' });
        }
        } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating class' });
        }
    });

    app.delete('/api/classes/:id', async (req, res) => {
        try {
        const classe = await Classe.findByPk(req.params.id);
        if (classe) {
            await classe.destroy();
            res.json(classe);
        } else {
            res.status(404).json({ error: 'Class not found' });
        }
        } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting class' });
        }
    });

};