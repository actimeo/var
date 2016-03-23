SET search_path = portal;

CREATE OR REPLACE FUNCTION personview_set(prm_token integer, prm_pme_id integer, prm_title text, prm_icon text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM login._token_assert(prm_token, '{structure}');
  UPDATE portal.personview SET pvi_title = prm_title, pvi_icon = prm_icon
    WHERE pme_id = prm_pme_id;
  IF NOT FOUND THEN
    INSERT INTO portal.personview (pme_id, pvi_title, pvi_icon) VALUES(prm_pme_id, prm_title, prm_icon);
  END IF;
END;
$$;
COMMENT ON FUNCTION personview_set(prm_token integer, prm_pme_id integer, prm_title text, prm_icon text) IS 'Set or update information about a view attached to a specified person menu';

CREATE OR REPLACE FUNCTION personview_delete(prm_token integer, prm_pme_id integer)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM login._token_assert(prm_token, '{structure}');
  DELETE FROM portal.personview WHERE pme_id = prm_pme_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;
END;
$$;
COMMENT ON FUNCTION personview_delete(prm_token integer, prm_pme_id integer) IS 'Delete a view attached to a person menu';

CREATE OR REPLACE FUNCTION personview_get(prm_token integer, prm_pme_id integer)
RETURNS portal.personview
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  ret portal.personview;
BEGIN
  PERFORM login._token_assert(prm_token, '{structure}');
  SELECT * INTO ret FROM portal.personview WHERE pme_id = prm_pme_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;
  RETURN ret;
END;
$$;
COMMENT ON FUNCTION personview_get(prm_token integer, prm_pme_id integer) IS 'Get information about a view attached to a person menu';
