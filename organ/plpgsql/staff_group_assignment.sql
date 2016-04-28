CREATE OR REPLACE FUNCTION organ.staff_group_assignment_add(prm_token integer, prm_sgr_id integer, prm_stf_id integer)
RETURNS integer
LANGUAGE plpgsql
VOLATILE
AS $$
DECLARE
  ret integer;
BEGIN
  PERFORM login._token_assert(prm_token, '{organization}');
  INSERT INTO organ.staff_group_assignment (sgr_id, stf_id)
    VALUES (prm_sgr_id, prm_stf_id)
    RETURNING sga_id INTO ret;
  RETURN ret;
END;
$$;
COMMENT ON FUNCTION organ.staff_group_assignment_add(prm_token integer, prm_sgr_id integer, prm_stf_id integer) IS 'Assign a staff member to a new service group';

CREATE OR REPLACE FUNCTION organ.staff_group_assignment_delete(prm_token integer, prm_sgr_id integer, prm_stf_id integer)
RETURNS VOID
LANGUAGE plpgsql
VOLATILE
AS $$
DECLARE

BEGIN
  PERFORM login._token_assert(prm_token, '{organization}');
  DELETE FROM organ.staff_group_assignment 
    WHERE sgr_id = prm_sgr_id AND stf_id = prm_stf_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'no_data_found';
  END IF;
END;
$$;
COMMENT ON FUNCTION organ.staff_group_assignment_delete(prm_token integer, prm_sgr_id integer, prm_stf_id integer) IS 'Unassign a staff member from a service group';

CREATE OR REPLACE FUNCTION organ.staff_group_assignment_list_staffs(prm_token integer, prm_sgr_id integer)
RETURNS SETOF organ.staff
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  row organ.staff;
BEGIN
  PERFORM login._token_assert(prm_token, null);
  RETURN QUERY SELECT staff.*
    FROM organ.staff_group_assignment
    INNER JOIN organ.staff USING(stf_id)
    WHERE sgr_id = prm_sgr_id;
END;
$$;
COMMENT ON FUNCTION organ.staff_group_assignment_list_staffs(prm_token integer, prm_sgr_id integer) IS 'Return the list of staff members assigned to a group';

CREATE OR REPLACE FUNCTION organ.staff_group_assignment_list_groups(prm_token integer, prm_stf_id integer)
RETURNS SETOF organ.service_group
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  row organ.service_group;
BEGIN
  PERFORM login._token_assert(prm_token, null);
  RETURN QUERY SELECT service_group.*
    FROM organ.staff_group_assignment
    INNER JOIN organ.service_group USING(sgr_id)
    WHERE stf_id = prm_stf_id;
END;
$$;
COMMENT ON FUNCTION organ.staff_group_assignment_list_groups(prm_token integer, prm_stf_id integer) IS 'Return the list of groups a staff member is assigned to';
