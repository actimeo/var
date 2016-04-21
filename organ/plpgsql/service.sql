CREATE OR REPLACE FUNCTION organ.service_add(prm_token integer, prm_ins_id integer, prm_name text)
RETURNS integer
LANGUAGE plpgsql
VOLATILE
AS $$
DECLARE
  ret integer;
BEGIN
  PERFORM login._token_assert(prm_token, '{organization}');
  INSERT INTO organ.service (ins_id, ser_name, ser_topics) VALUES (prm_ins_id, prm_name, '{}')
    RETURNING ser_id INTO ret;
  RETURN ret;  
END;
$$;
COMMENT ON FUNCTION organ.service_add(prm_token integer, prm_ins_id integer, prm_name text) IS 'Add a new service provided by an institution';

CREATE OR REPLACE FUNCTION organ.service_get(prm_token integer, prm_id integer)
RETURNS organ.service
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  ret organ.service;
BEGIN
  PERFORM login._token_assert(prm_token, '{organization}');
  SELECT * INTO ret FROM organ.service WHERE ser_id = prm_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;
  RETURN ret;
END;
$$;
COMMENT ON FUNCTION organ.service_get(prm_token integer, prm_id integer) IS 'Return basic information about a service';

CREATE OR REPLACE FUNCTION organ.service_delete(prm_token integer, prm_id integer)
RETURNS VOID
LANGUAGE plpgsql
VOLATILE
AS $$
BEGIN
  PERFORM login._token_assert(prm_token, '{organization}');
  DELETE FROM organ.service WHERE ser_id = prm_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;
END;
$$;
COMMENT ON FUNCTION organ.service_delete(prm_token integer, prm_id integer) IS 'Delete a particular service';

CREATE OR REPLACE FUNCTION organ.service_list(prm_token integer, prm_ins_id integer)
RETURNS SETOF organ.service
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  row organ.service;
BEGIN
  PERFORM login._token_assert(prm_token, '{}');
  IF prm_ins_id ISNULL THEN
    RAISE EXCEPTION USING ERRCODE = 'null_value_not_allowed';
  END IF;
  RETURN QUERY SELECT * from organ.service 
    WHERE ins_id = prm_ins_id ORDER BY ser_name;
END;
$$;
COMMENT ON FUNCTION organ.service_list(prm_token integer, prm_ins_id integer) IS 'Return the list of services provided by an institution';

CREATE OR REPLACE FUNCTION organ.service_rename(prm_token integer, prm_id integer, prm_name text)
RETURNS VOID
LANGUAGE plpgsql
VOLATILE
AS $$
BEGIN
  PERFORM login._token_assert(prm_token, '{organization}');
  UPDATE organ.service SET ser_name = prm_name WHERE ser_id = prm_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;  
END;
$$;
COMMENT ON FUNCTION organ.service_rename(prm_token integer, prm_id integer, prm_name text) IS 'Rename a service';

-- service_set_topics(prm_token, prm_id, prm_topics)
CREATE OR REPLACE FUNCTION organ.service_set_topics(prm_token integer, prm_id integer, prm_topics portal.topics[])
RETURNS VOID
LANGUAGE plpgsql
VOLATILE
AS $$
BEGIN
  PERFORM login._token_assert(prm_token, '{organization}');
  UPDATE organ.service SET ser_topics = prm_topics WHERE ser_id = prm_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;
END;
$$;
COMMENT ON FUNCTION organ.service_set_topics(prm_token integer, prm_id integer, prm_topics portal.topics[]) IS 'Set the topics covered by a service';
