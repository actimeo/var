SET search_path = portal;

------------
-- PORTAL --
------------

CREATE OR REPLACE FUNCTION portal_add(prm_name text)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE 
  ret integer;
BEGIN
  INSERT INTO portal.portal (por_name) VALUES(prm_name)
    RETURNING por_id INTO ret;
  RETURN ret;
END;
$$;

CREATE OR REPLACE FUNCTION portal_list()
RETURNS SETOF portal.portal
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY SELECT * FROM portal.portal ORDER BY por_name;
END;
$$;

CREATE OR REPLACE FUNCTION portal_rename(prm_id integer, prm_name text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE portal.portal SET por_name = prm_name WHERE por_id = prm_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION portal_delete(prm_id integer)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM portal.portal WHERE por_id = prm_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION portal_clean(prm_id integer)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM portal.mainsection WHERE por_id = prm_id;
  DELETE FROM portal.personsection WHERE por_id = prm_id;
  DELETE FROM portal.portal WHERE por_id = prm_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;
END;
$$;

-----------------
-- MAINSECTION --
-----------------

CREATE OR REPLACE FUNCTION mainsection_add(prm_por_id integer, prm_name text)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  new_order integer;
  ret integer;
BEGIN
  SELECT COALESCE(MAX(mse_order), 0) + 1 INTO new_order FROM portal.mainsection WHERE por_id = prm_por_id;
  INSERT INTO portal.mainsection (por_id, mse_name, mse_order)
    VALUES (prm_por_id, prm_name, new_order)
    RETURNING mse_id INTO ret;
  RETURN ret;
END;
$$;

CREATE OR REPLACE FUNCTION mainsection_list(prm_por_id integer)
RETURNS SETOF portal.mainsection
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY SELECT * FROM portal.mainsection 
    WHERE por_id = prm_por_id ORDER BY mse_order;
END;
$$;

CREATE OR REPLACE FUNCTION mainsection_rename(prm_id integer, prm_name text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE portal.mainsection SET mse_name = prm_name WHERE mse_id = prm_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION mainsection_delete(prm_id integer)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM portal.mainsection WHERE mse_id = prm_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION mainsection_move_before_position(prm_id integer, prm_position integer)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE 
  por integer;
  i integer;
  mse integer;
BEGIN
  SELECT por_id INTO por FROM portal.mainsection WHERE mse_id = prm_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;
  IF prm_position > 1 + (SELECT count(*) FROM portal.mainsection WHERE por_id = por) THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;
  IF prm_position < 1 THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;

  -- make space between indices
  SET CONSTRAINTS portal.mse_por_order_unique DEFERRED;
  UPDATE portal.mainsection SET mse_order = 2 * mse_order WHERE por_id = por;

  -- reorder
  UPDATE portal.mainsection SET mse_order = 2 * prm_position - 1 WHERE mse_id = prm_id;

  -- 1-increment indices again
  i = 1;
  FOR mse IN
    SELECT mse_id FROM portal.mainsection WHERE por_id = por ORDER BY mse_order
  LOOP
    UPDATE portal.mainsection SET mse_order = i WHERE mse_id = mse;
    i = i + 1;
  END LOOP;
END;
$$;

-----------------
-- PERSONSECTION --
-----------------

CREATE OR REPLACE FUNCTION personsection_add(prm_por_id integer, prm_entity portal.entity, prm_name text)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  new_order integer;
  ret integer;
BEGIN
  SELECT COALESCE(MAX(pse_order), 0) + 1 INTO new_order FROM portal.personsection 
    WHERE por_id = prm_por_id AND pse_entity = prm_entity;
  INSERT INTO portal.personsection (por_id, pse_entity, pse_name, pse_order)
    VALUES (prm_por_id, prm_entity, prm_name, new_order)
    RETURNING pse_id INTO ret;
  RETURN ret;
END;
$$;

CREATE OR REPLACE FUNCTION personsection_list(prm_por_id integer, prm_entity portal.entity)
RETURNS SETOF portal.personsection
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY SELECT * FROM portal.personsection 
    WHERE por_id = prm_por_id AND pse_entity = prm_entity
    ORDER BY pse_order;
END;
$$;

CREATE OR REPLACE FUNCTION personsection_rename(prm_id integer, prm_name text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE portal.personsection SET pse_name = prm_name WHERE pse_id = prm_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION personsection_delete(prm_id integer)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM portal.personsection WHERE pse_id = prm_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION personsection_move_before_position(prm_id integer, prm_position integer)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE 
  por integer;
  ent portal.entity;
  i integer;
  mse integer;
BEGIN
  SELECT por_id, pse_entity INTO por, ent FROM portal.personsection WHERE pse_id = prm_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;
  IF prm_position > 1 + (SELECT count(*) FROM portal.personsection WHERE por_id = por) THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;
  IF prm_position < 1 THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;

  -- make space between indices
  SET CONSTRAINTS portal.pse_por_order_unique DEFERRED;
  UPDATE portal.personsection SET pse_order = 2 * pse_order WHERE por_id = por AND pse_entity = ent;

  -- reorder
  UPDATE portal.personsection SET pse_order = 2 * prm_position - 1 WHERE pse_id = prm_id;

  -- 1-increment indices again
  i = 1;
  FOR mse IN
    SELECT pse_id FROM portal.personsection WHERE por_id = por AND pse_entity = ent ORDER BY pse_order
  LOOP
    UPDATE portal.personsection SET pse_order = i WHERE pse_id = mse;
    i = i + 1;
  END LOOP;
END;
$$;
