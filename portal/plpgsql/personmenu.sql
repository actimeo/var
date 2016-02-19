SET search_path = portal;

----------------
-- PERSONMENU --
----------------

CREATE OR REPLACE FUNCTION personmenu_add(prm_token integer, prm_pse_id integer, prm_name text)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  new_order integer;
  ret integer;
BEGIN
  PERFORM login._token_assert(prm_token, '{structure}');
  SELECT COALESCE(MAX(pme_order), 0) + 1 INTO new_order FROM portal.personmenu WHERE pse_id = prm_pse_id;
  INSERT INTO portal.personmenu (pse_id, pme_name, pme_order)
    VALUES (prm_pse_id, prm_name, new_order)
    RETURNING pme_id INTO ret;
  RETURN ret;
END;
$$;

CREATE OR REPLACE FUNCTION personmenu_list(prm_token integer, prm_pse_id integer)
RETURNS SETOF portal.personmenu
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  PERFORM login._token_assert(prm_token, '{structure}');
  RETURN QUERY SELECT * FROM portal.personmenu
    WHERE pse_id = prm_pse_id ORDER BY pme_order;
END;
$$;

CREATE OR REPLACE FUNCTION personmenu_rename(prm_token integer, prm_id integer, prm_name text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM login._token_assert(prm_token, '{structure}');
  UPDATE portal.personmenu SET pme_name = prm_name WHERE pme_id = prm_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION personmenu_delete(prm_token integer, prm_id integer)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM login._token_assert(prm_token, '{structure}');
  DELETE FROM portal.personmenu WHERE pme_id = prm_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION personmenu_move_before_position(prm_token integer, prm_id integer, prm_position integer)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE 
  pse integer;
  i integer;
  pme integer;
BEGIN
  PERFORM login._token_assert(prm_token, '{structure}');
  SELECT pse_id INTO pse FROM portal.personmenu WHERE pme_id = prm_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;
  IF prm_position > 1 + (SELECT count(*) FROM portal.personmenu WHERE pse_id = pse) THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;
  IF prm_position < 1 THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;

  -- make space between indices
  SET CONSTRAINTS portal.pme_pse_order_unique DEFERRED;
  UPDATE portal.personmenu SET pme_order = 2 * pme_order WHERE pse_id = pse;

  -- reorder
  UPDATE portal.personmenu SET pme_order = 2 * prm_position - 1 WHERE pme_id = prm_id;

  -- 1-increment indices again
  i = 1;
  FOR pme IN
    SELECT pme_id FROM portal.personmenu WHERE pse_id = pse ORDER BY pme_order
  LOOP
    UPDATE portal.personmenu SET pme_order = i WHERE pme_id = pme;
    i = i + 1;
  END LOOP;
END;
$$;
