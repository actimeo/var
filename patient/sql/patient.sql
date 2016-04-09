CREATE SCHEMA patient;
COMMENT ON SCHEMA patient IS 'This module collects all the information about the patients.';

SET search_path = patient;

CREATE TYPE patient.care_group_assignment_status AS ENUM (
  'requested',
  'accepted',
  'finished',
  'refused'
);
COMMENT ON TYPE patient.care_group_assignment_status IS 'Status of the assignment request of a patient in a care group';

CREATE TYPE patient.institution_status AS ENUM (
  'preadmission',
  'admission',
  'present',
  'left',
  'unknown'
);
COMMENT ON TYPE patient.institution_status IS 'Presence status of a patient in an institution';

CREATE TABLE patient.patient (
  pat_id serial PRIMARY KEY,
  pat_firstname text NOT NULL,
  pat_lastname text NOT NULL,
  pat_birthdate date NOT NULL,
  CONSTRAINT pat_name_birth_unique UNIQUE(pat_firstname, pat_lastname, pat_birthdate)
);
COMMENT ON TABLE patient.patient IS 'Base information about a patient. Uniqueness of patients is done in firstname/lastname/birthdate.';
COMMENT ON COLUMN patient.patient.pat_id IS 'Unique identifier';
COMMENT ON COLUMN patient.patient.pat_firstname IS 'Patient first name(s)';
COMMENT ON COLUMN patient.patient.pat_lastname IS 'Patient last name';
COMMENT ON COLUMN patient.patient.pat_birthdate IS 'Patient birth date';

CREATE TABLE patient.care_group_assignment (
  cga_id serial PRIMARY KEY,
  cgr_id integer NOT NULL REFERENCES organ.care_group,
  pat_id integer NOT NULL REFERENCES patient.patient,
  cga_status patient.care_group_assignment_status NOT NULL,
  cga_start_date date,
  cga_end_date date,
  cga_request_date date,
  cga_renew_request_date date,
  cga_notes text NOT NULL DEFAULT ''
);
COMMENT ON TABLE patient.care_group_assignment IS 'Information about the assignment of a patient to a care group';
COMMENT ON COLUMN patient.care_group_assignment.cga_id IS 'Unique identifier';
COMMENT ON COLUMN patient.care_group_assignment.cgr_id IS 'The care group of assignment';
COMMENT ON COLUMN patient.care_group_assignment.pat_id IS 'The assigned patient';
COMMENT ON COLUMN patient.care_group_assignment.cga_status IS 'Status of the assignment';
COMMENT ON COLUMN patient.care_group_assignment.cga_start_date IS 'Assignment start date';
COMMENT ON COLUMN patient.care_group_assignment.cga_end_date IS 'Assignment end date';
COMMENT ON COLUMN patient.care_group_assignment.cga_request_date IS 'Date of assignment request';
COMMENT ON COLUMN patient.care_group_assignment.cga_renew_request_date IS 'Date of assignment renewal request';
COMMENT ON COLUMN patient.care_group_assignment.cga_notes IS 'Free notes about the assignment';

CREATE TABLE patient.status (
  sta_id serial PRIMARY KEY,
  pat_id integer REFERENCES patient.patient NOT NULL,
  ins_id integer REFERENCES organ.institution NOT NULL,
  sta_status patient.institution_status NOT NULL
);
COMMENT ON TABLE patient.status IS 'Presence status of a patient in an institution';
COMMENT ON COLUMN patient.status.sta_id IS 'Unique identifier';
COMMENT ON COLUMN patient.status.pat_id IS 'Patient';
COMMENT ON COLUMN patient.status.ins_id IS 'Institution';
COMMENT ON COLUMN patient.status.sta_status IS 'Status';
