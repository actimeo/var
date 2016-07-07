SET search_path = organ;

CREATE OR REPLACE FUNCTION organ.topic_add(prm_token integer, prm_name text, prm_description text)
RETURNS integer
LANGUAGE plpgsql
VOLATILE
AS $$
DECLARE
  ret integer;
BEGIN
  PERFORM login._token_assert(prm_token, '{organization}');
  INSERT INTO organ.topic (top_name, top_description) VALUES (prm_name, prm_description)
    RETURNING top_id INTO ret;
  RETURN ret;
END;
$$;
COMMENT ON FUNCTION organ.topic_add(prm_token integer, prm_name text, prm_description text) IS 'Add a new topic';

CREATE OR REPLACE FUNCTION organ.topics_list(prm_token integer)
RETURNS setof organ.topic
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  PERFORM login._token_assert(prm_token, NULL);
  RETURN QUERY SELECT * FROM organ.topic ORDER BY top_name;
END;
$$;
COMMENT ON FUNCTION organ.topics_list(prm_token integer) IS 'Returns the list of topics';
