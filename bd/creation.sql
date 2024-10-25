drop table if exists Classe_Categorie;
drop table if exists Classe_Page;
drop table if exists Etudiant;
drop table if exists Classe;
drop table if exists Lien;
drop table if exists Article;
drop table if exists Video;
drop table if exists Exercice;
drop table if exists Rubrique;
drop table if exists Page;
drop table if exists Categorie;

create table Classe(
    id INTEGER PRIMARY KEY AUTOINCREMENT not null ,
    nom varchar(255)
);

create table Etudiant(
    id INTEGER PRIMARY KEY AUTOINCREMENT not null,
    nom varchar(255),
    prenom varchar(255),
    mail varchar(255),
    mdp varchar(255),
    classe_id INTEGER,
    est_abonne boolean,
    FOREIGN KEY (classe_id) REFERENCES Classe(id)
);

create table Categorie(
    id INTEGER PRIMARY KEY AUTOINCREMENT not null,
    nom varchar(255),
    description varchar(255),
    est_publie boolean
);

create table Sous_Categorie(
    id_parent INTEGER,
    id_enfant INTEGER,
    PRIMARY KEY (id_parent, id_enfant),
    FOREIGN KEY (id_parent) REFERENCES Categorie(id),
    FOREIGN KEY (id_enfant) REFERENCES Categorie(id)
);

create table Page(
    id INTEGER PRIMARY KEY AUTOINCREMENT not null,
    nom varchar(255),
    description varchar(255),
    categorie_id INTEGER,
    image varchar(255),
    est_publie boolean,
    FOREIGN KEY (categorie_id) REFERENCES Categorie(id)
);

create table Rubrique(
    id INTEGER PRIMARY KEY AUTOINCREMENT not null,
    nom varchar(255),
    description varchar(255),
    position INTEGER,
    page_id INTEGER,
    FOREIGN KEY (page_id) REFERENCES Page(id)
);

create table Lien(
    id INTEGER PRIMARY KEY AUTOINCREMENT not null,
    lien varchar(255),
    rubrique_id INTEGER,
    FOREIGN KEY (rubrique_id) REFERENCES Rubrique(id)
);

create table Article(
    id INTEGER PRIMARY KEY AUTOINCREMENT not null,
    texte varchar(255),
    image varchar(255),
    rubrique_id INTEGER,
    FOREIGN KEY (rubrique_id) REFERENCES Rubrique(id)
);

create table Video(
    id INTEGER PRIMARY KEY AUTOINCREMENT not null,
    lien varchar(255),
    rubrique_id INTEGER,
    FOREIGN KEY (rubrique_id) REFERENCES Rubrique(id)
);

create table Exercice(
    id INTEGER PRIMARY KEY AUTOINCREMENT not null,
    lien_fichier varchar(255),
    texte varchar(255),
    rubrique_id INTEGER,
    FOREIGN KEY (rubrique_id) REFERENCES Rubrique(id)
);

create table Classe_Categorie(
    classe_id INTEGER,
    categorie_id INTEGER,
    PRIMARY KEY (classe_id, categorie_id),
    FOREIGN KEY (classe_id) REFERENCES Classe(id),
    FOREIGN KEY (categorie_id) REFERENCES categorie(id)
);

create table Classe_Page(
    classe_id INTEGER,
    page_id INTEGER,
    PRIMARY KEY (classe_id, page_id),
    FOREIGN KEY (classe_id) REFERENCES Classe(id),
    FOREIGN KEY (page_id) REFERENCES page(id)
);

create table Demande_Abonnement(
    etudiant_id INTEGER PRIMARY KEY,
    FOREIGN KEY (etudiant_id) REFERENCES Etudiant(id)
);