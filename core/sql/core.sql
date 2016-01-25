CREATE SCHEMA login;

SET search_path = login;

CREATE TABLE "user" (
  usr_login varchar(64) PRIMARY KEY,
  usr_salt varchar,
  usr_pwd varchar,
  usr_digest varchar,
  usr_right_structure boolean,
  usr_right_config boolean,
  usr_token integer UNIQUE,
  usr_token_creation_date timestamp with time zone
);
COMMENT ON TABLE "user" IS 'Webservice users';
COMMENT ON COLUMN "user".usr_login IS 'User login';
COMMENT ON COLUMN "user".usr_salt IS 'Encrypted password';
COMMENT ON COLUMN "user".usr_pwd IS 'Clear temporary password';
COMMENT ON COLUMN "user".usr_digest IS 'Encrypted password for webdav';
COMMENT ON COLUMN "user".usr_right_structure IS 'Rights to edit structure';
COMMENT ON COLUMN "user".usr_right_config IS 'Rights to edit configuration';
COMMENT ON COLUMN "user".usr_token IS 'Token id returned after authentication';
COMMENT ON COLUMN "user".usr_token_creation_date IS 'Token creation date for validity';
