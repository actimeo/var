CREATE SCHEMA login;
COMMENT ON SCHEMA login IS 'This module is used for the user to authenticate. 
Each user has a login and a password.

** Adding a user
A first user is created during installation, with the login ''variation'' and a password provided during installation.

Users with privileges can add users.

A password is composed of at least 8 characters, from 3 different types from (uppercase, lowercase, digit, special char).

A password must be changed at least every 6(param) months.

** User Authentication
A user can authenticate with the function user_login(login, pwd). This function returns a token which is used to access other functions of the api.

If authentication fails 5 times in a row for the same user, the account is blocked during a certain period of time and/or can be unblocked from an administrator (depending on parametrization).

The token becomes invalid:
- after a certain period of inactivity (ie no function was called with this token)
- when user disconnects with function user_logout(token)

';

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

INSERT INTO login.user(usr_login, usr_salt, usr_right_structure, usr_right_config) values ('variation', pgcrypto.crypt('variation', pgcrypto.gen_salt('bf', 8)), true, false);
