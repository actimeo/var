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

-- list of thematics of institution: move to global config

-- staff: 
--   link to group for rights
--   link to *institutions for affectation

-- care_group_assignment: list of staff referents

-- patient = entity with attribute person or regroupment
--   regroup persons in regroupments



-- user
  -- x portals
  -- (x groups)
