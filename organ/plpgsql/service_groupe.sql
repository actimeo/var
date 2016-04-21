CREATE OR REPLACE FUNCTION organ.service_group_add(prm_token integer, prm_ser_id integer, prm_name text)
RETURNS integer
LANGUAGE plpgsql
VOLATILE
AS $$
DECLARE
  ret integer;
BEGIN
  PERFORM login._token_assert(prm_token, '{organization}');
  INSERT INTO organ.service_group (ser_id, sgr_name) 
    VALUES (prm_ser_id, prm_name)
    RETURNING sgr_id INTO ret;
  RETURN ret;    
END;
$$;
COMMENT ON FUNCTION organ.service_group_add(prm_token integer, prm_ser_id integer, prm_name text) IS 'Add a new group providing a particular service to an institution';

CREATE OR REPLACE FUNCTION organ.service_group_get(prm_token integer, prm_id integer)
RETURNS organ.service_group
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  ret organ.service_group;
BEGIN
  PERFORM login._token_assert(prm_token, NULL);
  SELECT * INTO ret FROM organ.service_group WHERE sgr_id = prm_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;
  RETURN ret;
END;
$$;
COMMENT ON FUNCTION organ.service_group_get(prm_token integer, prm_id integer) IS 'Get basic information about a service group';

CREATE OR REPLACE FUNCTION organ.service_group_set(prm_token integer, prm_id integer, prm_start_date date, prm_end_date date, prm_notes text)
RETURNS VOID
LANGUAGE plpgsql
VOLATILE
AS $$
BEGIN
  PERFORM login._token_assert(prm_token, '{organization}');
  UPDATE organ.service_group SET 
    sgr_start_date = COALESCE(prm_start_date, '-infinity'),
    sgr_end_date = COALESCE(prm_end_date, 'infinity'),
    sgr_notes = prm_notes
    WHERE sgr_id = prm_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;
END;
$$;
COMMENT ON FUNCTION organ.service_group_set(prm_token integer, prm_id integer, prm_start_date date, prm_end_date date, prm_notes text) IS 'Set basic information about a service group';

CREATE OR REPLACE FUNCTION organ.service_group_list(prm_token integer, prm_ser_id integer, prm_active_at date)
RETURNS SETOF organ.service_group
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  row organ.service_group;
BEGIN
  PERFORM login._token_assert(prm_token, '{organization}');
  IF prm_ser_id ISNULL THEN
    RAISE EXCEPTION USING ERRCODE = 'null_value_not_allowed';
  END IF;
  RETURN QUERY SELECT * FROM organ.service_group
    WHERE ser_id = prm_ser_id
    AND (prm_active_at ISNULL OR prm_active_at BETWEEN sgr_start_date AND sgr_end_date)
    ORDER BY sgr_name;
END;
$$;
COMMENT ON FUNCTION organ.service_group_list(prm_token integer, prm_ser_id integer, prm_active_at date) IS 'Return a list of groups of a particular service, optionally active at a certain date';

CREATE OR REPLACE FUNCTION organ.service_group_delete(prm_token integer, prm_id integer)
RETURNS VOID
LANGUAGE plpgsql
VOLATILE
AS $$
BEGIN
  PERFORM login._token_assert(prm_token, '{organization}');
  DELETE FROM organ.service_group WHERE sgr_id = prm_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;
END;
$$;
COMMENT ON FUNCTION organ.service_group_delete(prm_token integer, prm_id integer) IS 'Delete a service group';

-- service_group_rename
CREATE OR REPLACE FUNCTION organ.service_group_rename(prm_token integer, prm_id integer, prm_name text)
RETURNS VOID
LANGUAGE plpgsql
VOLATILE
AS $$
BEGIN
  PERFORM login._token_assert(prm_token, '{organization}');
  UPDATE organ.service_group SET sgr_name = prm_name WHERE sgr_id = prm_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;  

END;
$$;
COMMENT ON FUNCTION organ.service_group_rename(prm_token integer, prm_id integer, prm_name text) IS 'Rename of service group';
