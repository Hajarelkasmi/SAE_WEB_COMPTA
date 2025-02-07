const { Etudiant } = require('../bd');
const { verifyToken, verifyAdmin } = require('../auth');
const { create_email_token, send_email } = require('../mail/mail');

module.exports = (app) => {
    app.get('/api/send_email', verifyToken, async (req, res) => {
        try {
            const object = req.query.object;
            if (object === "modifPassword") {
                const token = create_email_token(req.userId);
                const etudiant = await Etudiant.findByPk(req.userId);
                send_email(etudiant.mail, 'Demande de modification de mot de passe', `Veuillez cliquer sur le lien suivant pour modifier votre mot de passe: http://localhost:3000/reset_password/${token}`);
                    //https://laprofdecompta.fr/reset_password/${token}`);
            } 
        } catch (error) {
            res.status(500).json({ error: 'An error occurred' });
        }
    });

    app.get('/api/accept_abonnement', verifyToken, verifyAdmin, async (req, res) => {
        try {
            const etudiant = await Etudiant.findByPk(req.body.id);
            if (etudiant) {
                etudiant.est_abonne = true;
                etudiant.save();
                send_email(etudiant.mail, 'Confirmation d\'inscription', `Votre demande d'abonnement a été acceptée`);
            } else {
                res.status(404).json({ error: 'Etudiant not found' });
            }
            
        } catch (error) {
            res.status(500).json({ error: 'An error occurred' });
        }
    });

    app.get('/api/refuse_abonnement', verifyToken, verifyAdmin, async (req, res) => {
        try {
            const etudiant = await Etudiant.findByPk(req.body.id);
            if (etudiant) {
                send_email(etudiant.mail, 'Confirmation d\'inscription', `Votre demande d'abonnement a été refusée`);
            } else {
                res.status(404).json({ error: 'Etudiant not found' });
            }
            
        } catch (error) {
            res.status(500).json({ error: 'An error occurred' });
        }
    });
}