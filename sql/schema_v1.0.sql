DELIMITER //

CREATE DATABASE IF NOT EXISTS typescript_server_starter_kit;
USE typescript_server_starter_kit;

DROP PROCEDURE IF EXISTS initialize_db;

CREATE PROCEDURE initialize_db ()
BEGIN

    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
    END;

    START TRANSACTION;

    CREATE TABLE Organization (
        Id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        Name_x NVARCHAR(255) NOT NULL,
        PRIMARY KEY (Id)
    ) CHARACTER SET utf8mb4;

    CREATE TABLE Role (
        Id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        Name_x NVARCHAR(255) NOT NULL,
        Label NVARCHAR(255) NOT NULL,
        Type_x CHAR(1) NOT NULL,
        PRIMARY KEY (Id)
    ) CHARACTER SET utf8mb4;

    CREATE UNIQUE INDEX RoleName ON Role(Name_x);

    INSERT INTO Role (Name_x, Label, Type_x) VALUES
        ('OrganizationAdministrator', 'Organization Administrator', 'd'),
        ('RegisteredUser', 'Registered User', 'd'),
        ('GuestUser', 'Guest User', 'd');

    CREATE TABLE User (
        Id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        Email NVARCHAR(255) NOT NULL,
        Phone NVARCHAR(32),
        FirstName NVARCHAR(255),
        LastName NVARCHAR(255),
        Password_x NVARCHAR(8191),
        PRIMARY KEY (Id)
    ) CHARACTER SET utf8mb4;

    CREATE UNIQUE INDEX UserEmail ON User(email);

    CREATE TABLE OrganizationUser (
        Organization INT UNSIGNED NOT NULL,
        User INT UNSIGNED NOT NULL,
        Role_x INT UNSIGNED NOT NULL,
        CONSTRAINT OrganizationUserOrganization
            FOREIGN KEY (Organization) REFERENCES Organization(Id)
            ON DELETE CASCADE
            ON UPDATE RESTRICT,
        CONSTRAINT OrganizationUserUser
            FOREIGN KEY (User) REFERENCES User(Id)
            ON DELETE CASCADE
            ON UPDATE RESTRICT,
        CONSTRAINT OrganizationUserRole
            FOREIGN KEY (Role_x) REFERENCES Role(Id)
            ON DELETE CASCADE
            ON UPDATE RESTRICT,
        PRIMARY KEY (Organization, User)
    ) CHARACTER SET utf8mb4;

    CREATE TABLE Post (
        Id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        Author INT UNSIGNED NOT NULL,
        Title NVARCHAR(255),
        Body NVARCHAR(8191),
        FOREIGN KEY (Author) REFERENCES User(Id),
        PRIMARY KEY (Id)
    ) CHARACTER SET utf8mb4;

    FLUSH USER_VARIABLES;

    COMMIT;
END //

DELIMITER ;

CALL initialize_db();