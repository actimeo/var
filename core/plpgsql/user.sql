SET search_path = login;

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


DROP FUNCTION IF EXISTS user_login(prm_login character varying, prm_pwd character varying);
DROP TYPE IF EXISTS user_login;
CREATE TYPE user_login AS (
  usr_token integer,
  usr_temp_pwd boolean,
  usr_right_structure boolean,
  usr_right_config boolean
);
COMMENT ON TYPE user_login IS 'Type returned by user_login function';
COMMENT ON COLUMN user_login.usr_token IS 'Token to use for other functions';
COMMENT ON COLUMN user_login.usr_temp_pwd IS 'True if the password is temporary';
COMMENT ON COLUMN user_login.usr_right_structure IS 'True if the user gets rights to edit structure';
COMMENT ON COLUMN user_login.usr_right_config IS 'True if the user gets rights to edit configuration';

CREATE OR REPLACE FUNCTION user_login(prm_login character varying, prm_pwd character varying) RETURNS user_login
  LANGUAGE plpgsql
  AS $$
DECLARE
  row login.user_login;
  usr varchar;
  tok integer DEFAULT NULL;
BEGIN
  SELECT usr_login INTO usr FROM login."user"
    WHERE usr_login = prm_login AND pgcrypto.crypt (prm_pwd, usr_salt) = usr_salt;
  IF NOT FOUND THEN 
    RAISE EXCEPTION USING ERRCODE = 'invalid_authorization_specification';
  END IF;
  SELECT * INTO tok FROM login._user_token_create (usr);
  SELECT DISTINCT tok, (usr_pwd NOTNULL), usr_right_structure, usr_right_config INTO row FROM login."user"
    WHERE usr_login = usr;
  RETURN row;
END;
$$;

COMMENT ON FUNCTION login.user_login(character varying, character varying) IS 
'Authenticate a user from its login and password.
If authorization is ok, returns:
 - usr_token: a new token to be used for the following operations
 - usr_temp_pwd: true if the user is using a temporary password
 - usr_right_structure: true if the user has privileges to edit structure
 - usr_tight_config: true if the user has privileges to edit config
If authorization fails, an exception is raised with code invalid_authorization_specification
';


/*
CREATE OR REPLACE FUNCTION user_add(prm_token integer, prm_login character varying, prm_right_structure boolean, prm_right_config boolean) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
	ret integer;
	mdp varchar;
BEGIN
	PERFORM login._token_assert (prm_token, TRUE, FALSE);
	mdp = LPAD((100000+random()*900000)::varchar, 6, '0');
	INSERT INTO login.utilisateur (uti_login, per_id, uti_salt, uti_pwd, uti_config, uti_root) VALUES (prm_login, prm_per_id, crypt (mdp, gen_salt('des')), mdp, prm_uti_config, prm_uti_root) RETURNING uti_id INTO ret;
	RETURN ret;
END;
$$;
COMMENT ON FUNCTION utilisateur_add(prm_token integer, prm_login character varying, prm_per_id integer, prm_uti_config boolean, prm_uti_root boolean) IS 
'Ajoute un utilisateur.

Entrée :
 - prm_token : Token d''authentification
 - prm_login : Login du nouvel utilisateur
 - prm_per_id : Id du personnel lié à l''utilisateur
 - prm_uti_config : l''utilisateur a-t-il droit à la config "Etablissement" ?
 - prm_uti_root : l''utilisateur a-t-il droit à la config "Réseau" ?
Retour :
 - L''identifiant de l''utilisateur créé
Remarques :
Un mot de passe temporaire est généré. Il peut être connu avec la fonction utilisateur_get.
Nécessite les droits à la configuration "Etablissement"
';
*/
