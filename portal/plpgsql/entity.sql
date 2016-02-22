SET search_path = portal;

--------------
-- ENTITIES --
--------------

CREATE OR REPLACE FUNCTION entity_list()
RETURNS SETOF portal.entity
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY SELECT unnest(enum_range(null::portal.entity));
END;
$$;
