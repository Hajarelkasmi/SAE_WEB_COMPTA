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
    }
}, {
    tableName: 'Etudiant'
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
    }
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
    tableName: 'Page'
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
    },
    est_public : {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
},
{
    tableName: 'Rubrique'
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
    tableName: 'Lien'
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
    tableName: 'Article'
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
    tableName: 'Video'
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
    tableName: 'Exercice'
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
    tableName: 'Classe_Categorie'
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
    tableName: 'Classe_Page'
});

sequelize.sync().then(() => {
    console.log('Connected to SQLite');
});
  
module.exports = {
    Classe,
    Etudiant,
    Categorie,
    Page,
    Rubrique,
    Lien,
    Article,
    Video,
    Exercice,
    Classe_Categorie,
    Classe_Page
};
