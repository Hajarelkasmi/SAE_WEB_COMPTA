// server.js
const express = require('express');
const cors = require('cors');
const configureClasseRoutes = require('./module/classe'); // Chemin correct vers le module classe.js

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

configureClasseRoutes(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;