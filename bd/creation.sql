drop table if exists Etudiant;
drop table if exists Role;


create table Role(
    id int PRIMARY KEY autoincrement not null,
    nom varchar(255)
);

create table Etudiant(
    id int PRIMARY KEY autoincrement not null,
    nom varchar(255),
    prenom varchar(255),
    mail varchar(255),
    abonne boolean,
    role_id int,
    FOREIGN KEY (role_id) REFERENCES role(id)
);

create table Categorie(
    id int PRIMARY KEY autoincrement not null,
    nom varchar(255),
    description varchar(255),
    estAbonne boolean
);