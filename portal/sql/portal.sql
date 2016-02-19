CREATE SCHEMA portal;
COMMENT ON SCHEMA portal IS 'This module is used to create portals.
Portals are views of user data. Several views can be created, depending on institution category, employee, etc';

SET search_path = portal;

CREATE TYPE portal.entity AS ENUM (
  'patient',
  'staff',
  'contact',
  'family'
);

CREATE TABLE portal (
  por_id serial PRIMARY KEY,
  por_name text NOT NULL UNIQUE
);

CREATE TABLE mainsection (
  mse_id serial PRIMARY KEY,
  por_id integer NOT NULL REFERENCES portal.portal,
  mse_name text NOT NULL,
  mse_order integer NOT NULL CHECK (mse_order > 0) ,
  CONSTRAINT mse_por_name_unique UNIQUE(por_id, mse_name),
  CONSTRAINT mse_por_order_unique UNIQUE(por_id, mse_order) DEFERRABLE INITIALLY IMMEDIATE
);

CREATE TABLE mainmenu (
  mme_id serial PRIMARY KEY,
  mse_id integer NOT NULL REFERENCES portal.mainsection,
  mme_name text NOT NULL,
  mme_order integer NOT NULL CHECK (mme_order > 0) ,
  CONSTRAINT mme_mse_name_unique UNIQUE(mse_id, mme_name),
  CONSTRAINT mme_mse_order_unique UNIQUE(mse_id, mme_order) DEFERRABLE INITIALLY IMMEDIATE
);

CREATE TABLE personsection (
  pse_id serial PRIMARY KEY,  
  por_id integer NOT NULL REFERENCES portal.portal,
  pse_entity portal.entity,
  pse_name text NOT NULL,
  pse_order integer NOT NULL CHECK (pse_order > 0) ,
  CONSTRAINT pse_por_name_unique UNIQUE(por_id, pse_entity, pse_name),
  CONSTRAINT pse_por_order_unique UNIQUE(por_id, pse_entity, pse_order) DEFERRABLE INITIALLY IMMEDIATE
);

CREATE TABLE personmenu (
  pme_id serial PRIMARY KEY,
  pse_id integer NOT NULL REFERENCES portal.personsection,
  pme_name text NOT NULL,
  pme_order integer NOT NULL CHECK (pme_order > 0) ,
  CONSTRAINT pme_pse_name_unique UNIQUE(pse_id, pme_name),
  CONSTRAINT pme_pse_order_unique UNIQUE(pse_id, pme_order) DEFERRABLE INITIALLY IMMEDIATE
);

