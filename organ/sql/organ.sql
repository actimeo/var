CREATE SCHEMA organ;

SET search_path = organ;

CREATE TABLE organ.topic (
  top_id serial PRIMARY KEY,
  top_name text NOT NULL UNIQUE
);

CREATE TABLE organ.organization (
  org_id serial PRIMARY KEY,
  org_name text NOT NULL UNIQUE
);

CREATE TABLE organ.dossier (
  dos_id serial PRIMARY KEY,
  dos_firstname text NOT NULL,
  dos_lastname text NOT NULL,
  dos_birthdate date NOT NULL,
  UNIQUE(dos_firstname, dos_lastname, dos_birthdate)
);

CREATE TABLE organ.group (
  grp_id serial PRIMARY KEY,
  org_id integer NOT NULL REFERENCES organ.organization,
  grp_name text NOT NULL,
  grp_notes text NOT NULL DEFAULT '',
  UNIQUE(org_id, grp_name)
);

CREATE TABLE organ.group_topic (
  grt_id serial PRIMARY KEY,
  grp_id integer NOT NULL REFERENCES organ.group,
  top_id integer NOT NULL REFERENCES organ.topic,
  UNIQUE(grp_id, top_id)
);


CREATE TABLE organ.participant (
  par_id serial PRIMARY KEY,
  par_firstname text NOT NULL,
  par_lastname text NOT NULL,
  UNIQUE(par_firstname, par_lastname)
);

-- RELATIONS
CREATE TABLE organ.dossier_assignment (
  doa_id serial PRIMARY KEY,
  dos_id integer NOT NULL REFERENCES organ.dossier,
  grp_id integer NOT NULL REFERENCES organ.group
);

CREATE TABLE organ.participant_assignment (
  paa_id serial PRIMARY KEY,
  grp_id integer NOT NULL REFERENCES organ.group,
  par_id integer NOT NULL REFERENCES organ.participant
);

CREATE TABLE organ.referee (
  ref_id serial PRIMARY KEY,
  doa_id integer NOT NULL REFERENCES organ.dossier_assignment,
  paa_id integer NOT NULL REFERENCES organ.participant_assignment
);
