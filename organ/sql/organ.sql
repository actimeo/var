CREATE SCHEMA organ;
COMMENT ON SCHEMA organ IS 'This module describes the structure of the organization receiving the patients.';

SET search_path = organ;

CREATE TABLE organ.institution (
  ins_id serial PRIMARY KEY,
  ins_name text NOT NULL UNIQUE
);

COMMENT ON TABLE organ.institution IS 'An institution receiving patients.';
COMMENT ON COLUMN organ.institution.ins_id IS 'Unique identifier';
COMMENT ON COLUMN organ.institution.ins_name IS 'Institution name';

CREATE TABLE organ.service (
  ser_id serial PRIMARY KEY,
  ins_id integer NOT NULL REFERENCES organ.institution,
  ser_name text NOT NULL,
  ser_topics portal.topics[] NOT NULL,
  CONSTRAINT ser_ins_name_unique UNIQUE(ins_id, ser_name)
);

COMMENT ON TABLE organ.service IS 'A service to patients';
COMMENT ON COLUMN organ.service.ser_id IS 'Unique identifier';
COMMENT ON COLUMN organ.service.ins_id IS 'Institution providing the service';
COMMENT ON COLUMN organ.service.ser_name IS 'Service name';
COMMENT ON COLUMN organ.service.ser_topics IS 'Topics covered by the service';

CREATE TABLE organ.service_group (
  sgr_id serial PRIMARY KEY,
  ser_id integer NOT NULL REFERENCES organ.service,
  sgr_name text NOT NULL,
  sgr_start_date date NOT NULL DEFAULT '-infinity',
  sgr_end_date date NOT NULL DEFAULT 'infinity',
  sgr_notes text NOT NULL DEFAULT '',
  CONSTRAINT service_group_ser_name_unique UNIQUE(ser_id, sgr_name)
);

COMMENT ON TABLE organ.service_group IS 'Group of a certain service';
COMMENT ON COLUMN organ.service_group.sgr_id IS 'Unique identifier';
COMMENT ON COLUMN organ.service_group.ser_id IS 'Service provided by the group';
COMMENT ON COLUMN organ.service_group.sgr_name IS 'Name of the group';
COMMENT ON COLUMN organ.service_group.sgr_start_date IS 'Date at which the group activity begins';
COMMENT ON COLUMN organ.service_group.sgr_end_date IS 'Date at which the group activity ends';
COMMENT ON COLUMN organ.service_group.sgr_notes IS 'Free notes about the group';

CREATE TABLE organ.staff (
  stf_id serial PRIMARY KEY,
  stf_firstname text NOT NULL,
  stf_lastname text NOT NULL,
  CONSTRAINT stf_name_unique UNIQUE(stf_firstname, stf_lastname)
);

COMMENT ON TABLE organ.staff IS 'Base information about a staff member. Uniqueness of staff members is done in firstname/lastname.';
COMMENT ON COLUMN organ.staff.stf_id IS 'Unique identifier';
COMMENT ON COLUMN organ.staff.stf_firstname IS 'Staff member first name(s)';
COMMENT ON COLUMN organ.staff.stf_lastname IS 'Staff member last name';

CREATE TABLE organ.staff_group_assignment (
  sga_id serial PRIMARY KEY,
  sgr_id integer NOT NULL REFERENCES organ.service_group,
  stf_id integer NOT NULL REFERENCES organ.staff  
  -- todo (sgr_id, stf_id) unique
);
COMMENT ON TABLE organ.staff_group_assignment IS 'Assignation of a staff member to a service group';
COMMENT ON COLUMN organ.staff_group_assignment.sga_id IS 'Unique identifier';
COMMENT ON COLUMN organ.staff_group_assignment.sgr_id IS 'Service group to which the staff member is assigned';
COMMENT ON COLUMN organ.staff_group_assignment.stf_id IS 'Staff member assigned';

CREATE TABLE organ.staff_institution_assignable (
  sia_id serial PRIMARY KEY,
  ins_id integer NOT NULL REFERENCES organ.institution,
  stf_id integer NOT NULL REFERENCES organ.staff  
  -- todo (ins_id, stf_id) unique
);
COMMENT ON TABLE organ.staff_institution_assignable IS 'Assignation possibility of a staff member to service groups of an institution';
COMMENT ON COLUMN organ.staff_institution_assignable.sia_id IS 'Unique identifier';
COMMENT ON COLUMN organ.staff_institution_assignable.ins_id IS 'Staff can be assigned to the service groups of this institution';
COMMENT ON COLUMN organ.staff_institution_assignable.stf_id IS 'Staff member assignable';

----------
-- TODO --
----------
-- list of thematics of institution: move to global config

-- patient = entity with attribute person or regroupment
--   regroup persons in regroupments

-- user
  -- x portals
  -- 1 staff
  -- (x groups via staff)
