SET search_path = organ;

CREATE OR REPLACE FUNCTION organ.topic_add(prm_token integer, prm_name text)
RETURNS integer
LANGUAGE plpgsql
VOLATILE
AS $$
DECLARE
  ret integer;
BEGIN
  PERFORM login._token_assert(prm_token, '{organization}');
  INSERT INTO organ.topic (top_name) VALUES (prm_name)
    RETURNING top_id INTO ret;
  RETURN ret;
END;
$$;
COMMENT ON FUNCTION organ.topic_add(prm_token integer, prm_name text) IS 'Add a new topic';
