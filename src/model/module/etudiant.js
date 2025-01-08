const { Etudiant, Classe } = require('../bd');
const { verifyToken, verifyAdmin, authenticate } = require('../auth');
const { Cryptage } = require('../cryptage');

module.exports = (app) => {
    app.get('/api/etudiants', async (req, res) => {
        try {
            const class_id = req.query.classe_id;
            const est_abonne = req.query.est_abonne;
            const where = {};
            if (class_id) {
                where.classe_id = class_id;
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
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching etudiants' });
        }
    });

    app.get('/api/etudiants/:id', async (req, res) => {
        try {
            const etudiant = await Etudiant.findByPk(req.params.id, {
                include: {
                    model: Classe,
                    attributes: ['nom']
                }
            });
            if (etudiant) {
                const infos = {
                    nom: etudiant.nom,
                    prenom: etudiant.prenom,
                    mail: etudiant.mail,
                    classe: etudiant.Classe ? etudiant.Classe.nom : null,
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

    app.get('/api/infos', verifyToken, async (req, res) => {
        const etudiant = await Etudiant.findByPk(req.userId);
        if (etudiant) {
            res.json({ isAdmin: etudiant.est_admin, idUser: etudiant.id });
        } else {
            res.status(404).json({ error: 'Etudiant not found' });
        }
    });

    app.post('/api/etudiants', verifyToken, verifyAdmin, async (req, res) => {
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
            let crypted_password = etudiant.mot_de_passe;
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
