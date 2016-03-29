SET search_path = portal;

ALTER TYPE portal.personview_type ADD VALUE 'personsample1';

CREATE TABLE portal.personview_sample1 (
  pme_id integer PRIMARY KEY REFERENCES portal.personmenu,
  ps1_text text
);
