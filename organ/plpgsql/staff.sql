SET search_path = organ;

CREATE OR REPLACE FUNCTION organ.staff_add(prm_token integer, prm_firstname text, prm_lastname text)
RETURNS integer
LANGUAGE plpgsql
VOLATILE
AS $$
DECLARE
  ret integer;
BEGIN
  PERFORM login._token_assert(prm_token, '{organization}');
  INSERT INTO organ.staff (stf_firstname, stf_lastname) VALUES (prm_firstname, prm_lastname)
    RETURNING stf_id INTO ret;
  RETURN ret;
END;
$$;
COMMENT ON FUNCTION organ.staff_add(prm_token integer, prm_firstname text, prm_lastname text) IS 'Add a new staff member';
