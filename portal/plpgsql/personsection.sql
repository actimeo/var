SET search_path = portal;

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

-- todo clean
