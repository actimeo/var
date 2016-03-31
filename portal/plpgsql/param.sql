SET search_path = portal;

DROP FUNCTION IF EXISTS param_list();
DROP TYPE IF EXISTS param_list;
CREATE TYPE param_list AS (
  prm_val portal.param,
  prm_name text,
  prm_type portal.param_type
);

CREATE OR REPLACE FUNCTION param_list()
RETURNS SETOF portal.param_list
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  row RECORD;
BEGIN
  FOR row IN
    SELECT 
      unnest(enum_range(null::portal.param)), 
      split_part(unnest(enum_range(null::portal.param))::text, '.', 1)::text, 
      split_part(unnest(enum_range(null::portal.param))::text, '.', 2)::portal.param_type
  LOOP
    RETURN NEXT row;
  END LOOP;
END;
$$;
COMMENT ON FUNCTION param_list() IS 'Return the list of the portal parameters';

CREATE OR REPLACE FUNCTION portal.param_value_get_bool(prm_token integer, prm_por_id integer, prm_param portal.param)
RETURNS boolean
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  ret boolean;
BEGIN
  PERFORM login._token_assert(prm_token, '{structure}');
  SELECT pva_value_bool INTO ret FROM portal.param_value
    WHERE por_id = prm_por_id AND pva_param = prm_param;
  IF NOT FOUND THEN ret = false; END IF;
  RETURN ret;
END;
$$;
COMMENT ON FUNCTION portal.param_value_get_bool(prm_token integer, prm_por_id integer, prm_param portal.param) IS 'Return the value of a boolean portal parameter';

CREATE OR REPLACE FUNCTION portal.param_value_set_bool(prm_token integer, prm_por_id integer, prm_param portal.param, prm_value boolean)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM login._token_assert(prm_token, '{structure}');
  UPDATE portal.param_value SET 
    pva_value_bool = prm_value,
    pva_value_topic = NULL
    WHERE por_id = prm_por_id AND pva_param = prm_param;
  IF NOT FOUND THEN
    INSERT INTO portal.param_value (por_id, pva_param, pva_value_bool, pva_value_topic)
      VALUES (prm_por_id, prm_param, prm_value, NULL);
  END IF;
END;
$$;
COMMENT ON FUNCTION portal.param_value_set_bool(prm_token integer, prm_por_id integer, prm_param portal.param, prm_value boolean) IS 'Set the value of a boolean portal parameter';
