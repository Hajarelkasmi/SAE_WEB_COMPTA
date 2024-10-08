import app from './server';
import { Classe } from './bd';

app.get('/api/classes', async (req, res) => {
    try {
      const classes = await Classe.findAll();
      res.json(classes);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching classes' });
    }
  });
  
  app.post('/api/classes', async (req, res) => {
    console.log(req.body);
    try {
      const classe = await Classe.create({ nom: req.body.name });
      res.json(classe);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while creating class' });
    }
  } );