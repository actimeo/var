SET search_path = portal;

ALTER TYPE portal.mainview_type ADD VALUE 'sample1';

CREATE TABLE portal.mainview_sample1 (
  mme_id integer PRIMARY KEY REFERENCES portal.mainmenu,
  ms1_text text
);
