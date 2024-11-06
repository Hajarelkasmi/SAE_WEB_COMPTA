const jwt = require('jsonwebtoken');
const { Etudiant, Connexion_Log } = require('./bd'); 

const secretKey = 'secret';
const refreshTokensSecret = 'refreshSecret';
const refreshTokens = [''];


async function authenticate(req, res) {
    const etudiant = await Etudiant.findOne({ where: { mail: req.body.mail, mot_de_passe: req.body.mot_de_passe } });
    if (!etudiant) {
        return res.status(403).json({ error: 'Connection échouée' });
    }

    const token = jwt.sign({ id: etudiant.id, isAdmin: etudiant.est_admin }, secretKey, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: etudiant.id, isAdmin: etudiant.est_admin }, refreshTokensSecret, { expiresIn: '7d' });
    refreshTokens.push(refreshToken);

    if (!res){
        return token;
    }

    res.json({ token: token, refreshToken: refreshToken });

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

function refreshToken(req, res) {
    const {token: refreshToken} = req.body;
    if (!refreshToken) return res.status(401).json({error: 'No refresh token provided'});
    if (!refreshTokens.includes(refreshToken)) return res.status(403).json({error: 'Invalid refresh token'});

    jwt.verify(refreshToken, refreshTokensSecret, (err, user) => {
        if (err) return res.status(403).json({error: 'Problem with refresh token'});

        const currentAccessToken = req.headers['authorization'];
        if (currentAccessToken) {
            jwt.verify(currentAccessToken, secretKey, (err, decoded) => {
                if (err && err.name === 'TokenExpiredError') {
                    const newAccessToken = jwt.sign({
                        id: user.id,
                        isAdmin: user.isAdmin
                    }, secretKey, {expiresIn: '15m'});
                    return res.json({token: newAccessToken});
                } else if (!err) {
                    return res.json({token: currentAccessToken});
                }
            });
        } else {
            return res.status(400).json({error: 'No current access token provided'});
        }
    });
}

module.exports = { authenticate, verifyToken, verifyAdmin, refreshToken };
