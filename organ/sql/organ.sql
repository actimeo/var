CREATE SCHEMA organ;

SET search_path = organ;

CREATE TABLE organ.institution (
  ins_id serial PRIMARY KEY,
  ins_name text NOT NULL UNIQUE
);


CREATE TABLE organ.service (
  ser_id serial PRIMARY KEY,
  ins_id integer NOT NULL REFERENCES organ.institution,
  ser_name text NOT NULL,
  ser_topics portal.topics[] NOT NULL,
  UNIQUE(ins_id, ser_name)
);


CREATE TABLE organ.service_group (
  sgr_id serial PRIMARY KEY,
  ser_id integer NOT NULL REFERENCES organ.service,
  sgr_name text NOT NULL,
  sgr_start_date date NOT NULL DEFAULT '-infinity',
  sgr_end_date date NOT NULL DEFAULT 'infinity',
  sgr_notes text NOT NULL DEFAULT '',
  UNIQUE(ser_id, sgr_name)
);


CREATE TABLE organ.staff (
  stf_id serial PRIMARY KEY,
  stf_firstname text NOT NULL,
  stf_lastname text NOT NULL,
  UNIQUE(stf_firstname, stf_lastname)
);


CREATE TABLE organ.staff_group_assignment (
  sga_id serial PRIMARY KEY,
  sgr_id integer NOT NULL REFERENCES organ.service_group,
  stf_id integer NOT NULL REFERENCES organ.staff,
  UNIQUE(sgr_id, stf_id)
);

CREATE TABLE organ.staff_institution_assignable (
  sia_id serial PRIMARY KEY,
  ins_id integer NOT NULL REFERENCES organ.institution,
  stf_id integer NOT NULL REFERENCES organ.staff,
  UNIQUE(ins_id, stf_id)
);

----------
-- TODO --
----------
-- list of thematics of institution: move to global config

-- patient = entity with attribute person or regroupment
--   regroup persons in regroupments

