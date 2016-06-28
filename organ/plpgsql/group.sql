CREATE OR REPLACE FUNCTION organ.group_add(prm_token integer, prm_org_id integer, prm_name text)
RETURNS integer
LANGUAGE plpgsql
VOLATILE
AS $$
DECLARE
  ret integer;
BEGIN
  PERFORM login._token_assert(prm_token, '{organization}');
  INSERT INTO organ.group (org_id, grp_name, grp_topics) 
    VALUES (prm_org_id, prm_name, '{}')
    RETURNING grp_id INTO ret;
  RETURN ret;    
END;
$$;
COMMENT ON FUNCTION organ.group_add(prm_token integer, prm_org_id integer, prm_name text) IS 'Add a new group providing a particular service to an institution';

CREATE OR REPLACE FUNCTION organ.group_get(prm_token integer, prm_id integer)
RETURNS organ.group
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  ret organ.group;
BEGIN
  PERFORM login._token_assert(prm_token, NULL);
  SELECT * INTO ret FROM organ.group WHERE grp_id = prm_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;
  RETURN ret;
END;
$$;
COMMENT ON FUNCTION organ.group_get(prm_token integer, prm_id integer) IS 'Get basic information about a service group';

CREATE OR REPLACE FUNCTION organ.group_set(prm_token integer, prm_id integer, prm_start_date date, prm_end_date date, prm_notes text)
RETURNS VOID
LANGUAGE plpgsql
VOLATILE
AS $$
BEGIN
  PERFORM login._token_assert(prm_token, '{organization}');
  UPDATE organ.group SET 
    grp_start_date = COALESCE(prm_start_date, '-infinity'),
    grp_end_date = COALESCE(prm_end_date, 'infinity'),
    grp_notes = prm_notes
    WHERE grp_id = prm_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;
END;
$$;
COMMENT ON FUNCTION organ.group_set(prm_token integer, prm_id integer, prm_start_date date, prm_end_date date, prm_notes text) IS 'Set basic information about a service group';

CREATE OR REPLACE FUNCTION organ.group_list(prm_token integer, prm_org_id integer, prm_active_at date)
RETURNS SETOF organ.group
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  row organ.group;
BEGIN
  PERFORM login._token_assert(prm_token, '{organization}');
  IF prm_org_id ISNULL THEN
    RAISE EXCEPTION USING ERRCODE = 'null_value_not_allowed';
  END IF;
  RETURN QUERY SELECT * FROM organ.group
    WHERE org_id = prm_org_id
    AND (prm_active_at ISNULL OR prm_active_at BETWEEN grp_start_date AND grp_end_date)
    ORDER BY grp_name;
END;
$$;
COMMENT ON FUNCTION organ.group_list(prm_token integer, prm_org_id integer, prm_active_at date) IS 'Return a list of groups of a particular service, optionally active at a certain date';

CREATE OR REPLACE FUNCTION organ.group_delete(prm_token integer, prm_id integer)
RETURNS VOID
LANGUAGE plpgsql
VOLATILE
AS $$
BEGIN
  PERFORM login._token_assert(prm_token, '{organization}');
  DELETE FROM organ.group WHERE grp_id = prm_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;
END;
$$;
COMMENT ON FUNCTION organ.group_delete(prm_token integer, prm_id integer) IS 'Delete a service group';

-- group_rename
CREATE OR REPLACE FUNCTION organ.group_rename(prm_token integer, prm_id integer, prm_name text)
RETURNS VOID
LANGUAGE plpgsql
VOLATILE
AS $$
BEGIN
  PERFORM login._token_assert(prm_token, '{organization}');
  UPDATE organ.group SET grp_name = prm_name WHERE grp_id = prm_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;  

END;
$$;
COMMENT ON FUNCTION organ.group_rename(prm_token integer, prm_id integer, prm_name text) IS 'Rename of service group';

CREATE OR REPLACE FUNCTION organ.group_set_topics(prm_token integer, prm_id integer, prm_topics portal.topics[])
RETURNS VOID
LANGUAGE plpgsql
VOLATILE
AS $$
BEGIN
  PERFORM login._token_assert(prm_token, '{organization}');
  UPDATE organ.group SET grp_topics = prm_topics WHERE grp_id = prm_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;
END;
$$;
COMMENT ON FUNCTION organ.group_set_topics(prm_token integer, prm_id integer, prm_topics portal.topics[]) IS 'Set the topics covered by a group';
