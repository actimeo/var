SET search_path = portal;

------------
-- TOPICS --
------------

CREATE OR REPLACE FUNCTION topics_list()
RETURNS SETOF portal.topics
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY SELECT unnest(enum_range(null::portal.topics));
END;
$$;
COMMENT ON FUNCTION topics_list() IS 'Return the list of the defined topics codes';
