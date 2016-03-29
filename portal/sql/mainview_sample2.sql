SET search_path = portal;

ALTER TYPE portal.mainview_type ADD VALUE 'sample2';

CREATE TABLE portal.mainview_sample2 (
  mme_id integer PRIMARY KEY REFERENCES portal.mainmenu,
  ms2_text text
);
