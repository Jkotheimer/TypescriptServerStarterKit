CREATE OR REPLACE USER 'typescript_server_starter_kit_user'@'localhost' IDENTIFIED BY '{password}';
GRANT SELECT, INSERT, UPDATE, DELETE ON typescript_server_starter_kit.* TO 'typescript_server_starter_kit_user'@'localhost';
FLUSH PRIVILEGES;
