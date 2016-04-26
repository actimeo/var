CREATE SCHEMA patient;

SET search_path = patient;

CREATE TYPE patient.patient_group_assignment_status AS ENUM (
  'requested',
  'accepted',
  'finished',
  'refused'
);

CREATE TABLE patient.patient (
  pat_id serial PRIMARY KEY,
  pat_firstname text NOT NULL,
  pat_lastname text NOT NULL,
  pat_birthdate date NOT NULL,
  UNIQUE(pat_firstname, pat_lastname, pat_birthdate)
);

CREATE TABLE patient.patient_group_assignment (
  pga_id serial PRIMARY KEY,
  sgr_id integer NOT NULL REFERENCES organ.service_group,
  pat_id integer NOT NULL REFERENCES patient.patient,
  pga_status patient.patient_group_assignment_status NOT NULL,
  pga_start_date date,
  pga_end_date date,
  pga_request_date date,
  pga_renew_request_date date,
  pga_notes text NOT NULL DEFAULT '',
  UNIQUE(sgr_id, pat_id)
);

CREATE TABLE patient.patient_group_referent (
  pgr_id serial PRIMARY KEY,
  pga_id integer NOT NULL REFERENCES patient.patient_group_assignment,
  stf_id integer NOT NULL REFERENCES organ.staff,
  UNIQUE(pga_id, stf_id)
);

------------
-- STATUS --
------------
CREATE TYPE patient.institution_status AS ENUM (
  'preadmission',
  'admission',
  'present',
  'left',
  'unknown'
);

CREATE TABLE patient.status (
  sta_id serial PRIMARY KEY,
  pat_id integer REFERENCES patient.patient NOT NULL,
  ins_id integer REFERENCES organ.institution NOT NULL,
  sta_status patient.institution_status NOT NULL,
  UNIQUE(pat_id, ins_id)
);
