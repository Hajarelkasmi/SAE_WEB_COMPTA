const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage:  './database'
});

const Classe = sequelize.define('Classe', {
    id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom : {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    tableName: 'Classe',
    timestamps: false
} );
    

const Etudiant = sequelize.define('Etudiant', {
    id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom : {
        type: DataTypes.STRING,
        allowNull: false
    },
    prenom : {
        type: DataTypes.STRING,
        allowNull: false
    },
    mail : {
        type: DataTypes.STRING,
        allowNull: false
    },
    mot_de_passe : {
        type: DataTypes.STRING,
        allowNull: false
    },
    classe_id : {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Classe',
            key: 'id'
        }
    },
    est_abonne : {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    est_admin : {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    tableName: 'Etudiant',
    timestamps: false
});

const Categorie = sequelize.define('Categorie', {
    id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom : {
        type: DataTypes.STRING,
        allowNull: false
    },
    description : {
        type: DataTypes.STRING,
        allowNull: false
    },
    est_public : {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
}, {
    tableName: 'Categorie',
    timestamps: false
});

const SousCategorie = sequelize.define('Sous_Categorie', {
    id_parent : {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Categorie',
            key: 'id'
        }
    },
    id_enfant : {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Categorie',
            key: 'id'
        }
    }
}, {
    tableName: 'Sous_Categorie',
    timestamps: false
});

const Page = sequelize.define('Page', {
    id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom : {
        type: DataTypes.STRING,
        allowNull: false
    },
    description : {
        type: DataTypes.STRING,
        allowNull: false
    },
    categorie_id : {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Categorie',
            key: 'id'
        }
    },
    image : {
        type: DataTypes.STRING,
        allowNull: false
    },
    est_public : {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    tableName: 'Page',
    timestamps: false
});

const Rubrique = sequelize.define('Rubrique', {
    id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom : {
        type: DataTypes.STRING,
        allowNull: false
    },
    description : {
        type: DataTypes.STRING,
        allowNull: false
    },
    page_id : {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Page',
            key: 'id'
        }
    }
},
{
    tableName: 'Rubrique',
    timestamps: false
});

const Lien = sequelize.define('Lien', {
    id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    lien : {
        type: DataTypes.STRING,
        allowNull: false
    },
    rubrique_id : {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Rubrique',
            key: 'id'
        }
    }
}, {
    tableName: 'Lien',
    timestamps: false
});

const Article = sequelize.define('Article', {
    id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    texte : {
        type: DataTypes.STRING,
        allowNull: false
    },
    image : {
        type: DataTypes.STRING,
        allowNull: false
    },
    rubrique_id : {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Rubrique',
            key: 'id'
        }
    }
}, {
    tableName: 'Article',
    timestamps: false
});

const Video = sequelize.define('Video', {
    id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    lien : {
        type: DataTypes.STRING,
        allowNull: false
    },
    rubrique_id : {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Rubrique',
            key: 'id'
        }
    }
}, {
    tableName: 'Video',
    timestamps: false
});

const Exercice = sequelize.define('Exercice', {
    id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    texte : {
        type: DataTypes.STRING,
        allowNull: false
    },
    lien_fichier : {
        type: DataTypes.STRING,
        allowNull: false
    },
    rubrique_id : {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Rubrique',
            key: 'id'
        }
    }
}, {
    tableName: 'Exercice',
    timestamps: false
});

const Classe_Categorie = sequelize.define('Classe_Categorie', {
    classe_id : {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Classe',
            key: 'id'
        }
    },
    categorie_id : {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Categorie',
            key: 'id'
        }
    }
}, {
    tableName: 'Classe_Categorie',
    timestamps: false
});

const Classe_Page = sequelize.define('Classe_Page', {
    classe_id : {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Classe',
            key: 'id'
        }
    },
    page_id : {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Page',
            key: 'id'
        }
    }
}, {
    tableName: 'Classe_Page',
    timestamps: false
});

const Demande_Abonnement = sequelize.define('Demande_Abonnement', {
    etudiant_id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'Etudiant',
            key: 'id'
        }
    },
}, {
    tableName: 'Demande_Abonnement',
    timestamps: false
});

sequelize.sync().then(() => {
    console.log('Connected to SQLite');
});
  
module.exports = {
    Classe,
    Etudiant,
    Categorie,
    SousCategorie,
    Page,
    Rubrique,
    Lien,
    Article,
    Video,
    Exercice,
    Classe_Categorie,
    Classe_Page,
    Demande_Abonnement
};
