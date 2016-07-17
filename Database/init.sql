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

create table SolveGroup (
   id int(11) AUTO_INCREMENT primary key,
   numSolves int(11) not null default 5,
   ownerId int(11) not null,
   cubeType int(11) not null default 0,
   constraint FKSolveGroup_ownerId foreign key(ownerId)
      references Person(id) on delete cascade on update cascade
);

create table Solve (
   id int(11) AUTO_INCREMENT primary key,
   groupId int(11) not null,
   scramble VARCHAR(200) not null,
   time TIME not null default '00:00:00',
   constraint FKSolve_groupId foreign key (groupId)
      references SolveGroup(id) on delete cascade on update cascade
);
