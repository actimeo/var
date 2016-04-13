CREATE OR REPLACE FUNCTION organ.care_add(prm_token integer, prm_ins_id integer, prm_name text)
RETURNS integer
LANGUAGE plpgsql
VOLATILE
AS $$
DECLARE
  ret integer;
BEGIN
  PERFORM login._token_assert(prm_token, '{organization}');
  INSERT INTO organ.care (ins_id, car_name, car_topics) VALUES (prm_ins_id, prm_name, '{}')
    RETURNING car_id INTO ret;
  RETURN ret;  
END;
$$;
COMMENT ON FUNCTION organ.care_add(prm_token integer, prm_ins_id integer, prm_name text) IS 'Add new new care to an institution';

CREATE OR REPLACE FUNCTION organ.care_get(prm_token integer, prm_id integer)
RETURNS organ.care
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  ret organ.care;
BEGIN
  PERFORM login._token_assert(prm_token, '{organization}');
  SELECT * INTO ret FROM organ.care WHERE car_id = prm_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;
  RETURN ret;
END;
$$;
COMMENT ON FUNCTION organ.care_get(prm_token integer, prm_id integer) IS 'Return basic information about a care';

CREATE OR REPLACE FUNCTION organ.care_delete(prm_token integer, prm_id integer)
RETURNS VOID
LANGUAGE plpgsql
VOLATILE
AS $$
BEGIN
  PERFORM login._token_assert(prm_token, '{organization}');
  DELETE FROM organ.care WHERE car_id = prm_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;
END;
$$;
COMMENT ON FUNCTION organ.care_delete(prm_token integer, prm_id integer) IS 'Delete a particular care';

CREATE OR REPLACE FUNCTION organ.care_list(prm_token integer, prm_ins_id integer)
RETURNS SETOF organ.care
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  row organ.care;
BEGIN
  PERFORM login._token_assert(prm_token, '{}');
  IF prm_ins_id ISNULL THEN
    RAISE EXCEPTION USING ERRCODE = 'null_value_not_allowed';
  END IF;
  RETURN QUERY SELECT * from organ.care 
    WHERE ins_id = prm_ins_id ORDER BY car_name;
END;
$$;
COMMENT ON FUNCTION organ.care_list(prm_token integer, prm_ins_id integer) IS 'Return the list of cares for an institution';

CREATE OR REPLACE FUNCTION organ.care_rename(prm_token integer, prm_id integer, prm_name text)
RETURNS VOID
LANGUAGE plpgsql
VOLATILE
AS $$
BEGIN
  PERFORM login._token_assert(prm_token, '{organization}');
  UPDATE organ.care SET car_name = prm_name WHERE car_id = prm_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;  
END;
$$;
COMMENT ON FUNCTION organ.care_rename(prm_token integer, prm_id integer, prm_name text) IS 'Rename a care';

-- care_set_topics(prm_token, prm_id, prm_topics)
CREATE OR REPLACE FUNCTION organ.care_set_topics(prm_token integer, prm_id integer, prm_topics portal.topics[])
RETURNS VOID
LANGUAGE plpgsql
VOLATILE
AS $$
BEGIN
  PERFORM login._token_assert(prm_token, '{organization}');
  UPDATE organ.care SET car_topics = prm_topics WHERE car_id = prm_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;
END;
$$;
COMMENT ON FUNCTION organ.care_set_topics(prm_token integer, prm_id integer, prm_topics portal.topics[]) IS 'Set the topics covered by a care';
