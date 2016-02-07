-- user_add
-- user_delete
-- user_change_rights

SET search_path = login;

CREATE OR REPLACE FUNCTION _token_assert (prm_token integer, prm_rights login.user_right[]) 
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
  usr login."user";
BEGIN
  SELECT * INTO usr FROM login."user" WHERE 
    usr_token = prm_token AND
    (prm_rights ISNULL OR prm_rights <@ usr_rights); -- <@ 'is contained by'
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'insufficient_privilege';
  END IF;
END;
$$;
COMMENT ON FUNCTION _token_assert (prm_token integer, prm_rights login.user_right[])  IS 
'[INTERNAL] Assert that a token is valid.
Also assert that the user owns all the rights given in parameter.
If some assertion fails, an ''insufficient_privilege'' exception is raised.';

CREATE OR REPLACE FUNCTION login._token_assert_other_login(prm_token integer, prm_login varchar)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM login."user" WHERE 
      usr_token = prm_token AND 
      usr_login = prm_login) THEN
    RAISE EXCEPTION USING ERRCODE = 'invalid_authorization_specification';
  END IF;
END;
$$;
COMMENT ON FUNCTION login._token_assert_other_login(prm_token integer, prm_login varchar) IS 
'[INTERNAL] Assert that the login and token are not associated.';

CREATE OR REPLACE FUNCTION _user_token_create (prm_login varchar) RETURNS varchar
  LANGUAGE plpgsql
  AS $$
DECLARE
	tok integer DEFAULT NULL;
	found BOOLEAN DEFAULT true;
BEGIN
  WHILE found LOOP
    tok = (RANDOM()*1000000000)::int;
    IF NOT EXISTS (SELECT 1 FROM login."user" WHERE usr_token = tok) THEN
      found = false;
    END IF;
  END LOOP;
  UPDATE login."user" SET 
    usr_token = tok, 
    usr_token_creation_date = CURRENT_TIMESTAMP 
    WHERE usr_login = prm_login;
  RETURN tok;
END;
$$;
COMMENT ON FUNCTION login._user_token_create (prm_login varchar) IS 
'[INTERNAL] Create a new token for the given user';


DROP FUNCTION IF EXISTS user_login(prm_login character varying, prm_pwd character varying, prm_rights login.user_right[]);
DROP TYPE IF EXISTS user_login;
CREATE TYPE user_login AS (
  usr_token integer,
  usr_temp_pwd boolean,
  usr_rights login.user_right[]
);
COMMENT ON TYPE user_login IS 'Type returned by user_login function';
COMMENT ON COLUMN user_login.usr_token IS 'Token to use for other functions';
COMMENT ON COLUMN user_login.usr_temp_pwd IS 'True if the password is temporary';
COMMENT ON COLUMN user_login.usr_rights IS 'List of rights owned by the user.';

CREATE OR REPLACE FUNCTION user_login(prm_login character varying, prm_pwd character varying, prm_rights login.user_right[]) RETURNS user_login
  LANGUAGE plpgsql
  AS $$
DECLARE
  row login.user_login;
  usr varchar;
  tok integer DEFAULT NULL;
BEGIN
  SELECT usr_login INTO usr FROM login."user"
    WHERE usr_login = prm_login AND 
    pgcrypto.crypt (prm_pwd, usr_salt) = usr_salt AND
    (prm_rights ISNULL OR prm_rights <@ usr_rights); -- <@: 'is contained by'
  IF NOT FOUND THEN 
    RAISE EXCEPTION USING ERRCODE = 'invalid_authorization_specification';
  END IF;
  SELECT * INTO tok FROM login._user_token_create (usr);
  SELECT DISTINCT tok, (usr_pwd NOTNULL), usr_rights INTO row FROM login."user"
    WHERE usr_login = usr;
  RETURN row;
END;
$$;
COMMENT ON FUNCTION login.user_login(character varying, character varying, prm_rights login.user_right[]) IS 
'Authenticate a user from its login and password.
If prm_rights is not null, also verify that user owns all the specified rights.
If authorization is ok, returns:
 - usr_token: a new token to be used for the following operations
 - usr_temp_pwd: true if the user is using a temporary password
 - usr_rights: the list of rights owned by the user.
If authorization fails, an exception is raised with code invalid_authorization_specification
';

CREATE OR REPLACE FUNCTION user_logout (prm_token integer)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM login._token_assert(prm_token, NULL);
  UPDATE login."user" SET usr_token = NULL, usr_token_creation_date = NULL
    WHERE "user".usr_token = prm_token;
END;
$$;
COMMENT ON FUNCTION login.user_logout(integer) IS 
'Disconnect the user. The user token will not be usable anymore after this call.';

CREATE OR REPLACE FUNCTION user_change_password(prm_token integer, prm_password varchar)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM login._token_assert(prm_token, NULL);
  UPDATE login."user" SET usr_pwd = NULL, usr_salt = pgcrypto.crypt (prm_password, pgcrypto.gen_salt('bf', 8)) WHERE usr_token = prm_token;
END;
$$;
COMMENT ON FUNCTION user_change_password(prm_token integer, prm_password varchar) IS
'Change the password of the current user.';

CREATE OR REPLACE FUNCTION user_regenerate_password(prm_token integer, prm_login varchar)
RETURNS varchar
LANGUAGE plpgsql
AS $$
DECLARE
  newpwd varchar;
BEGIN
  PERFORM login._token_assert(prm_token, '{users}');
  PERFORM login._token_assert_other_login(prm_token, prm_login);
  newpwd = LPAD((random()*1000000)::int::varchar, 6, '0');
  UPDATE login."user" SET 
    usr_salt = pgcrypto.crypt (newpwd, pgcrypto.gen_salt('bf', 8)), 
    usr_pwd = newpwd
    WHERE usr_login = prm_login;
  RETURN newpwd;
END;
$$;
COMMENT ON FUNCTION user_regenerate_password(prm_token integer, prm_login varchar) IS
'Regenerate a temporary password for the user given in parameter.
The user given in parameter cannot be the current user.
';

/*
CREATE OR REPLACE FUNCTION user_add(prm_token integer, prm_login character varying, prm_right_structure boolean, prm_right_config boolean) 
RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
	ret integer;
	mdp varchar;
BEGIN
	PERFORM login._token_assert (prm_token, FALSE, TRUE);
	mdp = LPAD((100000+random()*900000)::varchar, 6, '0');
	INSERT INTO login.utilisateur (uti_login, per_id, uti_salt, uti_pwd, uti_config, uti_root) VALUES (prm_login, prm_per_id, crypt (mdp, gen_salt('des')), mdp, prm_uti_config, prm_uti_root) RETURNING uti_id INTO ret;
	RETURN ret;
END;
$$;
COMMENT ON FUNCTION user_add(prm_token integer, prm_login character varying, prm_right_structure boolean, prm_right_config boolean) IS
'Create a new user.

 - prm_login : New user login
 - prm_right_structure : New user gets rights to edit structure
 - prm_right_config : New user gets rights to edit configuration
Remarks :
A new temporary password is generated.
';
*/
