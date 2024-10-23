const jwt = require('jsonwebtoken');
const { Etudiant, Connexion_Log } = require('./bd'); 

const secretKey = 'secret';

async function authenticate(req, res) {
    const etudiant = await Etudiant.findOne({ where: { mail: req.body.mail, mot_de_passe: req.body.mot_de_passe } });
    if (!etudiant) {
        return res.status(403).json({ error: 'Connection échouée' });
    }

    const token = jwt.sign({ id: etudiant.id, isAdmin: etudiant.est_admin }, secretKey, {
        expiresIn: 600
    });
    res.json({ token: token });

    const lastLog = await Connexion_Log.findOne({
        where: { id_etudiant: etudiant.id },
        order: [['date', 'DESC']],
    });

    const currentTime = new Date();
    if (!lastLog || (currentTime - new Date(lastLog.date)) >= 3600000) { 
        const connexion_log = await Connexion_Log.create({
            id_etudiant: etudiant.id,
            date: currentTime,
        });
    }
}

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    next();
    // if (!token) {
    //     return res.status(403).json({ error: 'Pas de token fourni' });
    // }
    // jwt.verify(token, secretKey, (err, decoded) => {
    //     if (err) {
    //         return res.status(500).json({ error: 'Problème de token' });
    //     }
    //     req.userId = decoded.id;
    //     req.isAdmin = decoded.isAdmin;
    //     next();
    // });
}

function verifyAdmin(req, res, next) {
    next();
    // if (!req.isAdmin) {
    //     return res.status(403).json({ error: 'Accès refusé' });
    // }
}

module.exports = { authenticate, verifyToken, verifyAdmin };
