drop database if exists RubikDB;
create database RubikDB;
use RubikDB;

create table Person (
    id int(11) AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(30),
    lastName VARCHAR(30) not null,
    email VARCHAR(30) not null,
    password VARCHAR(50),
    whenRegistered DATETIME not null,
    role int(11) UNSIGNED not null,
    UNIQUE KEY(email)
);

create table CubeType (
   id int(11) AUTO_INCREMENT primary key,
   name varchar(30) not null,
   scrambleLength int(11) not null default 25
);

create table Solve (
   id int(11) AUTO_INCREMENT primary key,
   ownerId int(11) not null,
   cubeTypeId int(11) not null,
   scramble VARCHAR(2048) not null,
   time int(11) not null default 0,
   whenSolved DATETIME not null default NOW(),
   constraint FKSolve_ownerId foreign key (ownerId)
      references Person(id) on delete cascade on update cascade,
   constraint FKSolve_cubeTypeId foreign key (cubeTypeId)
      references CubeType(id) on delete cascade on update cascade
);

insert into CubeType values
   (1, "3x3", 25),
   (2, "4x4", 40),
   (3, "5x5", 60);
