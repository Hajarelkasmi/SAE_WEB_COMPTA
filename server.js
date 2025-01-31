const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const app = express();

// Servir les fichiers statiques de l'application React
app.use(express.static(path.join(__dirname, 'build')));

// Gérer les requêtes API
app.use('/api', require('./src/model/server.js'));

// Servir l'application React pour toutes les autres routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Chemins des fichiers de certificat et de clé SSL
const sslOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/laprofdecompta.fr/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/laprofdecompta.fr/fullchain.pem')
};

// Créer le serveur HTTPS
https.createServer(sslOptions, app).listen(443, () => {
    console.log('Serveur HTTPS en cours d\'exécution sur le port 443');
});

// Optionnellement, rediriger HTTP vers HTTPS
const http = require('http');
http.createServer((req, res) => {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(80, () => {
    console.log('Serveur HTTP en cours d\'exécution sur le port 80 et redirigeant vers HTTPS');
});