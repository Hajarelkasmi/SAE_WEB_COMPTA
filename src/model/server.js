// server.js
const express = require('express');
const cors = require('cors');
const configureClasseRoutes = require('./module/classe'); 
const configureClasseCategorieRoutes = require('./module/classe_categorie');
const configureClassePageRoutes = require('./module/classe_page');
const configureEtudiantRoutes = require('./module/etudiant'); 
const configureLienRoutes = require('./module/lien'); 
const configureArticleRoutes = require('./module/article'); 
const configureCategorieRoutes = require('./module/categorie'); 
const configurePageRoutes = require('./module/page');
const configureVideoRoutes = require('./module/video');
const configureExerciceRoutes = require('./module/exercice');


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

configureClasseRoutes(app);
configureClasseCategorieRoutes(app);
configureClassePageRoutes(app);
configureEtudiantRoutes(app);
configureLienRoutes(app);
configureArticleRoutes(app);
configureCategorieRoutes(app);
configurePageRoutes(app);
configureVideoRoutes(app);
configureExerciceRoutes(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;