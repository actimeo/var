CREATE SCHEMA login;
COMMENT ON SCHEMA login IS 'This module is used for the user to authenticate. 
Each user has a login and a password.

** Adding a user
A first user is created during installation, with the login ''variation'' and a password provided during installation.

Users with "users" privileges can add users.

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

CREATE TYPE login.user_right AS ENUM (
  'structure',    -- can edit portal structure
  'organization', -- can edit organization
  'users'         -- can manage users
);

CREATE TABLE login."user" (
  usr_login text PRIMARY KEY,
  usr_salt text,
  usr_pwd text,
  usr_digest text,
  usr_rights login.user_right[],
  stf_id integer REFERENCES organ.staff,
  usr_token integer UNIQUE,
  usr_token_creation_date timestamp with time zone
);
COMMENT ON TABLE login."user" IS 'Webservice users';
COMMENT ON COLUMN login."user".usr_login IS 'User login';
COMMENT ON COLUMN login."user".usr_salt IS 'Encrypted password';
COMMENT ON COLUMN login."user".usr_pwd IS 'Clear temporary password';
COMMENT ON COLUMN login."user".usr_digest IS 'Encrypted password for webdav';
COMMENT ON COLUMN login."user".usr_rights IS 'Array of special rights for this user';
COMMENT ON COLUMN login."user".usr_token IS 'Token id returned after authentication';
COMMENT ON COLUMN login."user".usr_token_creation_date IS 'Token creation date for validity';

INSERT INTO login.user(usr_login, usr_salt, usr_rights) values ('variation', pgcrypto.crypt('variation', pgcrypto.gen_salt('bf', 8)), '{users}');
INSERT INTO login.user(usr_login, usr_salt, usr_rights) values ('portaluser', pgcrypto.crypt('portal/user', pgcrypto.gen_salt('bf', 8)), '{structure}');

CREATE TABLE login.user_portal (
  usp_id serial PRIMARY KEY,
  usr_login text NOT NULL REFERENCES login."user",
  por_id integer NOT NULL REFERENCES portal.portal,
  UNIQUE (usr_login, por_id)
);
