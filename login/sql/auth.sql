CREATE SCHEMA login;
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
  par_id integer REFERENCES organ.participant,
  usr_token integer UNIQUE,
  usr_token_creation_date timestamp with time zone
);

INSERT INTO login.user(usr_login, usr_salt, usr_rights) values ('variation', pgcrypto.crypt('variation', pgcrypto.gen_salt('bf', 8)), '{users,structure,organization}');
INSERT INTO login.user(usr_login, usr_salt, usr_rights) values ('portaluser', pgcrypto.crypt('portal/user', pgcrypto.gen_salt('bf', 8)), '{structure}');
INSERT INTO login.user(usr_login, usr_salt, usr_rights) values ('organuser', pgcrypto.crypt('organ/user', pgcrypto.gen_salt('bf', 8)), '{organization}');

CREATE TABLE login.user_portal (
  usp_id serial PRIMARY KEY,
  usr_login text NOT NULL REFERENCES login."user",
  por_id integer NOT NULL REFERENCES portal.portal,
  UNIQUE (usr_login, por_id)
);

