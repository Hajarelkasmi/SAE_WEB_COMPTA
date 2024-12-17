const { Etudiant, Classe } = require('../bd');
const { verifyToken, verifyAdmin, authenticate } = require('../auth');
const { Cryptage } = require('../cryptage');

module.exports = (app) => {
    app.get('/api/etudiants', async (req, res) => {
        try {
<<<<<<< HEAD
            const etudiants = await Etudiant.findAll(
                {
                    attributes: ['id', 'nom', 'prenom', 'mail', 'est_abonne', 'est_admin', 'classe_id'],
                    include: {
                        model: Classe,
                        attributes: ['nom']
                    }
                }
            );
            res.json(etudiants);
=======
            const classe_id = req.query.classe_id;
            const est_abonne = req.query.est_abonne;
            const where = {};
            if (classe_id) {
                where.classe_id = classe_id;
            }
            if (est_abonne) {
                where.est_abonne = est_abonne;
            }
        const etudiants = await Etudiant.findAll(
            {
                attributes: ['id', 'nom', 'prenom', 'mail', 'est_abonne', 'est_admin', 'classe_id'],
                include: {
                    model: Classe,
                    attributes: ['nom']
                },
                where: where
            }
        );
        res.json(etudiants);
>>>>>>> 2509d90601e408587d30ff3914663a031c6320d7
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching etudiants' });
        }
    });

    app.get('/api/etudiants/:id', async (req, res) => {
        try {
            const etudiant = await Etudiant.findByPk(req.params.id);
            if (etudiant) {
                const infos = {
                    nom: etudiant.nom,
                    prenom: etudiant.prenom,
                    mail: etudiant.mail,
                    classe: etudiant.classe.nom,
                    est_abonne: etudiant.est_abonne,
                    est_admin: etudiant.est_admin
                }
                res.json(infos);
            } else {
                res.status(404).json({ error: 'Etudiant not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching etudiant' });
        }
    });

    app.get('/api/isAdmin', verifyToken, async (req, res) => {
        res.json({ isAdmin: req.isAdmin });
    });

    app.post('/api/etudiants', verifyToken, verifyAdmin, async (req, res) => {
        // app.post('/api/etudiants', async (req, res) => {
        try {
            const etudiant = await Etudiant.create({
                nom: req.body.nom,
                prenom: req.body.prenom,
                mail: req.body.mail,
                mot_de_passe: req.body.mot_de_passe,
                classe_id: req.body.classe_id,
                est_abonne: req.body.est_abonne,
                est_admin: req.body.est_admin
            });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while creating etudiant' });
        }
    });

    app.post('/api/register', async (req, res) => {
        try {
            const crypted_password = await Cryptage(req.body.mot_de_passe);
            const etudiant = await Etudiant.create({
                nom: req.body.nom,
                prenom: req.body.prenom,
                mail: req.body.mail,
                mot_de_passe: crypted_password,
                classe_id: req.body.classe_id,
                est_abonne: 0,
                est_admin: 0
            });
            const token = await authenticate(req, 0);
            res.json({
                id: etudiant.id,
                token: token
            })
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while creating etudiant' });
        }
    });

    app.put('/api/etudiants/:id', verifyToken, verifyAdmin, async (req, res) => {
        try {
            const etudiant = await Etudiant.findByPk(req.params.id);
            let crypted_password;
            if (req.body.mot_de_passe) {
                crypted_password = await Cryptage(req.body.mot_de_passe);
            }
            if (etudiant) {
                await etudiant.update({
                    nom: req.body.nom,
                    prenom: req.body.prenom,
                    mail: req.body.mail,
                    mot_de_passe: crypted_password,
                    classe_id: req.body.classe_id,
                    est_abonne: req.body.est_abonne,
                    est_admin: req.body.est_admin
                });
                res.json(etudiant);
            } else {
                res.status(404).json({ error: 'Etudiant not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while updating etudiant' });
        }
    });

    app.delete('/api/etudiants/:id', verifyToken, verifyAdmin, async (req, res) => {
        try {
            const etudiant = await Etudiant.findByPk(req.params.id);
            if (etudiant) {
                await etudiant.destroy();
                res.json(etudiant);
            } else {
                res.status(404).json({ error: 'Etudiant not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while deleting etudiant' });
        }
    });
}
