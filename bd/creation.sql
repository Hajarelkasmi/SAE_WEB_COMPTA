drop table if exists Abonnement_Categorie;
drop table if exists Abonnement_Page;
drop table if exists Abonnement;
drop table if exists Role_Categorie;
drop table if exists Role_Page;
drop table if exists Etudiant;
drop table if exists Role;
drop table if exists Lien;
drop table if exists Article;
drop table if exists Video;
drop table if exists Exercice;
drop table if exists Rubrique;
drop table if exists Page;
drop table if exists Categorie;


create table Role(
    id INTEGER PRIMARY KEY AUTOINCREMENT not null ,
    nom varchar(255)
);

create table Etudiant(
    id INTEGER PRIMARY KEY AUTOINCREMENT not null,
    nom varchar(255),
    prenom varchar(255),
    mail varchar(255),
    role_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES role(id)
);

create table Abonnement(
    etudiant_id INTEGER,
    PRIMARY KEY (etudiant_id),
    FOREIGN KEY (etudiant_id) REFERENCES etudiant(id)
);

create table Categorie(
    id INTEGER PRIMARY KEY AUTOINCREMENT not null,
    nom varchar(255),
    description varchar(255),
    est_publie boolean
);
create table Page(
    id INTEGER PRIMARY KEY AUTOINCREMENT not null,
    nom varchar(255),
    description varchar(255),
    categorie_id INTEGER,
    image varchar(255),
    est_publie boolean,
    FOREIGN KEY (categorie_id) REFERENCES categorie(id)
);

create table Abonnement_Categorie(
    abonnement_id INTEGER,
    categorie_id INTEGER,
    PRIMARY KEY (abonnement_id, categorie_id),
    FOREIGN KEY (abonnement_id) REFERENCES abonnement(etudiant_id),
    FOREIGN KEY (categorie_id) REFERENCES categorie(id)
);

create table Abonnement_Page(
    abonnement_id INTEGER,
    page_id INTEGER,
    PRIMARY KEY (abonnement_id, page_id),
    FOREIGN KEY (abonnement_id) REFERENCES abonnement(etudiant_id),
    FOREIGN KEY (page_id) REFERENCES page(id)
);

create table Rubrique(
    id INTEGER PRIMARY KEY AUTOINCREMENT not null,
    nom varchar(255),
    description varchar(255),
    page_id INTEGER,
    FOREIGN KEY (page_id) REFERENCES page(id)
);

create table Lien(
    id INTEGER PRIMARY KEY AUTOINCREMENT not null,
    lien varchar(255),
    rubrique_id INTEGER,
    FOREIGN KEY (rubrique_id) REFERENCES rubrique(id)
);

create table Article(
    id INTEGER PRIMARY KEY AUTOINCREMENT not null,
    texte varchar(255),
    image varchar(255),
    rubrique_id INTEGER,
    FOREIGN KEY (rubrique_id) REFERENCES rubrique(id)
);

create table Video(
    id INTEGER PRIMARY KEY AUTOINCREMENT not null,
    lien varchar(255),
    rubrique_id INTEGER,
    FOREIGN KEY (rubrique_id) REFERENCES rubrique(id)
);

create table Exercice(
    id INTEGER PRIMARY KEY AUTOINCREMENT not null,
    lien_fichier varchar(255),
    texte varchar(255),
    rubrique_id INTEGER,
    FOREIGN KEY (rubrique_id) REFERENCES rubrique(id)
);

create table Role_Categorie(
    role_id INTEGER,
    categorie_id INTEGER,
    PRIMARY KEY (role_id, categorie_id),
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (categorie_id) REFERENCES categorie(id)
);

create table Role_Page(
    role_id INTEGER,
    page_id INTEGER,
    PRIMARY KEY (role_id, page_id),
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (page_id) REFERENCES page(id)
);