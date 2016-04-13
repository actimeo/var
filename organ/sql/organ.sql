CREATE SCHEMA organ;
COMMENT ON SCHEMA organ IS 'This module describes the structure of the organization receiving the patients.';

SET search_path = organ;

CREATE TABLE organ.institution (
  ins_id serial PRIMARY KEY,
  ins_name text NOT NULL UNIQUE,
  ins_topics portal.topics[] NOT NULL
);

COMMENT ON TABLE organ.institution IS 'An institution receiving patients.';
COMMENT ON COLUMN organ.institution.ins_id IS 'Unique identifier';
COMMENT ON COLUMN organ.institution.ins_name IS 'Institution name';
COMMENT ON COLUMN organ.institution.ins_topics IS 'Topics of interest for the institution';

CREATE TABLE organ.care (
  car_id serial PRIMARY KEY,
  car_name text NOT NULL,
  car_topics portal.topics[] NOT NULL
);

COMMENT ON TABLE organ.care IS 'A way patients are cared';
COMMENT ON COLUMN organ.care.car_id IS 'Unique identifier';
COMMENT ON COLUMN organ.care.car_name IS 'Care name';
COMMENT ON COLUMN organ.care.car_topics IS 'Topics covered by the care';

CREATE TABLE organ.care_group (
  cgr_id serial PRIMARY KEY,
  car_id integer NOT NULL REFERENCES organ.care,
  ins_id integer NOT NULL REFERENCES organ.institution,
  cgr_name text NOT NULL,
  cgr_start_date date NOT NULL,
  cgr_end_date date NOT NULL,
  cgr_notes text NOT NULL DEFAULT ''
);

COMMENT ON TABLE organ.care_group IS 'Group of a certain care';
COMMENT ON COLUMN organ.care_group.cgr_id IS 'Unique identifier';
COMMENT ON COLUMN organ.care_group.car_id IS 'Care of the group';
COMMENT ON COLUMN organ.care_group.ins_id IS 'Institution to which the group is attached';
COMMENT ON COLUMN organ.care_group.cgr_name IS 'Name of the group';
COMMENT ON COLUMN organ.care_group.cgr_start_date IS 'Date at which the group activity begins';
COMMENT ON COLUMN organ.care_group.cgr_end_date IS 'Date at which the group activity ends';
COMMENT ON COLUMN organ.care_group.cgr_notes IS 'Free notes about the group';

