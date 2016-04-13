CREATE OR REPLACE FUNCTION organ.care_group_add(prm_token integer, prm_car_id integer, prm_name text)
RETURNS integer
LANGUAGE plpgsql
VOLATILE
AS $$
DECLARE
  ret integer;
BEGIN
  PERFORM login._token_assert(prm_token, '{organization}');
  INSERT INTO organ.care_group (car_id, cgr_name) 
    VALUES (prm_car_id, prm_name)
    RETURNING cgr_id INTO ret;
  RETURN ret;    
END;
$$;
COMMENT ON FUNCTION organ.care_group_add(prm_token integer, prm_car_id integer, prm_name text) IS 'Add a new group of a certain care to an institution';

CREATE OR REPLACE FUNCTION organ.care_group_get(prm_token integer, prm_id integer)
RETURNS organ.care_group
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  ret organ.care_group;
BEGIN
  PERFORM login._token_assert(prm_token, NULL);
  SELECT * INTO ret FROM organ.care_group WHERE cgr_id = prm_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;
  RETURN ret;
END;
$$;
COMMENT ON FUNCTION organ.care_group_get(prm_token integer, prm_id integer) IS 'Get basic information about a care group';

CREATE OR REPLACE FUNCTION organ.care_group_set(prm_token integer, prm_id integer, prm_start_date date, prm_end_date date, prm_notes text)
RETURNS VOID
LANGUAGE plpgsql
VOLATILE
AS $$
BEGIN
  PERFORM login._token_assert(prm_token, '{organization}');
  UPDATE organ.care_group SET 
    cgr_start_date = COALESCE(prm_start_date, '-infinity'),
    cgr_end_date = COALESCE(prm_end_date, 'infinity'),
    cgr_notes = prm_notes
    WHERE cgr_id = prm_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;
END;
$$;
COMMENT ON FUNCTION organ.care_group_set(prm_token integer, prm_id integer, prm_start_date date, prm_end_date date, prm_notes text) IS 'Set basic information about a care group';

CREATE OR REPLACE FUNCTION organ.care_group_list(prm_token integer, prm_car_id integer, prm_active_at date)
RETURNS SETOF organ.care_group
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  row organ.care_group;
BEGIN
  PERFORM login._token_assert(prm_token, '{organization}');
  IF prm_car_id ISNULL THEN
    RAISE EXCEPTION USING ERRCODE = 'null_value_not_allowed';
  END IF;
  RETURN QUERY SELECT * FROM organ.care_group
    WHERE car_id = prm_car_id
    AND (prm_active_at ISNULL OR prm_active_at BETWEEN cgr_start_date AND cgr_end_date)
    ORDER BY cgr_name;
END;
$$;
COMMENT ON FUNCTION organ.care_group_list(prm_token integer, prm_car_id integer, prm_active_at date) IS 'Return a list of care groups of a care, optionally active at a certain date';

CREATE OR REPLACE FUNCTION organ.care_group_delete(prm_token integer, prm_id integer)
RETURNS VOID
LANGUAGE plpgsql
VOLATILE
AS $$
BEGIN
  PERFORM login._token_assert(prm_token, '{organization}');
  DELETE FROM organ.care_group WHERE cgr_id = prm_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;
END;
$$;
COMMENT ON FUNCTION organ.care_group_delete(prm_token integer, prm_id integer) IS 'Delete a care group';

-- care_group_rename
CREATE OR REPLACE FUNCTION organ.care_group_rename(prm_token integer, prm_id integer, prm_name text)
RETURNS VOID
LANGUAGE plpgsql
VOLATILE
AS $$
BEGIN
  PERFORM login._token_assert(prm_token, '{organization}');
  UPDATE organ.care_group SET cgr_name = prm_name WHERE cgr_id = prm_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;  

END;
$$;
COMMENT ON FUNCTION organ.care_group_rename(prm_token integer, prm_id integer, prm_name text) IS 'Rename of care group';
