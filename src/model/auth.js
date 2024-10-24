const jwt = require('jsonwebtoken');
const { Etudiant } = require('./bd');

const secretKey = 'AAA';

async function authenticate(req, res) {
    console.log(req.body);
    const etudiant = await Etudiant.findOne({ where: { mail: req.body.mail, mot_de_passe: req.body.mot_de_passe } });
    if (!etudiant) {
        return res.status(403).json({ error: 'Connection échouée' });
    }
    const token = jwt.sign({ id: etudiant.id, isAdmin: etudiant.est_admin }, secretKey, {
        expiresIn: 600
    });
    res.json({ token: token });
}

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ error: 'Pas de token fourni' });
    }
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(500).json({ error: 'Problème de token' });
        }
        req.userId = decoded.id;
        req.isAdmin = decoded.isAdmin;
        next();
    });
}

function verifyAdmin(req, res, next) {
    if (!req.isAdmin) {
        return res.status(403).json({ error: 'Accès refusé' });
    }
    next();
}

module.exports = { authenticate, verifyToken, verifyAdmin };
