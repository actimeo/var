SET search_path = portal;

ALTER TYPE portal.personview_type ADD VALUE 'personsample2';

CREATE TABLE portal.personview_sample2 (
  pme_id integer PRIMARY KEY REFERENCES portal.personmenu,
  ps2_text text
);
