SET search_path = organ;

CREATE OR REPLACE FUNCTION organ.institution_add(prm_token integer, prm_name text)
RETURNS integer
LANGUAGE plpgsql
VOLATILE
AS $$
DECLARE
  ret integer;
BEGIN
  PERFORM login._token_assert(prm_token, '{organization}');
  INSERT INTO organ.institution (ins_name, ins_topics) VALUES (prm_name, '{}')
    RETURNING ins_id INTO ret;
  RETURN ret;
END;
$$;
COMMENT ON FUNCTION organ.institution_add(prm_token integer, prm_name text) IS 'Add a new institution';

CREATE OR REPLACE FUNCTION organ.institution_get(prm_token integer, prm_id integer)
RETURNS organ.institution
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  ret organ.institution;
BEGIN
  SELECT * INTO ret FROM organ.institution WHERE ins_id = prm_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;
  RETURN ret;
END;
$$;
COMMENT ON FUNCTION organ.institution_get(prm_token integer, prm_id integer) IS 'Return basic information about a particular institution';

CREATE OR REPLACE FUNCTION organ.institution_delete(prm_token integer, prm_id integer)
RETURNS VOID
LANGUAGE plpgsql
VOLATILE
AS $$
BEGIN
  PERFORM login._token_assert(prm_token, '{organization}');
  DELETE FROM organ.institution WHERE ins_id = prm_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;
END;
$$;
COMMENT ON FUNCTION organ.institution_delete(prm_token integer, prm_id integer) IS 'Delete a particular institution';

CREATE OR REPLACE FUNCTION organ.institution_list(prm_token integer)
RETURNS SETOF organ.institution
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  PERFORM login._token_assert(prm_token, NULL);
  RETURN QUERY SELECT * FROM organ.institution ORDER BY ins_name;
END;
$$;
COMMENT ON FUNCTION organ.institution_list(prm_token integer) IS 'Return the list of all the institutions';

CREATE OR REPLACE FUNCTION organ.institution_rename(prm_token integer, prm_id integer, prm_name text)
RETURNS VOID
LANGUAGE plpgsql
VOLATILE
AS $$
BEGIN
  PERFORM login._token_assert(prm_token, '{organization}');
  UPDATE organ.institution SET ins_name = prm_name WHERE ins_id = prm_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;
END;
$$;
COMMENT ON FUNCTION organ.institution_rename(prm_token integer, prm_id integer, prm_name text) IS 'Rename a particular institution';

CREATE OR REPLACE FUNCTION organ.institution_set_topics(prm_token integer, prm_id integer, prm_topics portal.topics[])
RETURNS VOID
LANGUAGE plpgsql
VOLATILE
AS $$
BEGIN
  PERFORM login._token_assert(prm_token, '{organization}');
  UPDATE organ.institution SET ins_topics = prm_topics WHERE ins_id = prm_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;
END;
$$;
COMMENT ON FUNCTION organ.institution_set_topics(prm_token integer, prm_id integer, prm_topics portal.topics[]) IS 'Set the topics of interest for a particular institution';
