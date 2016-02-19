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


CREATE TABLE personsection (
  pse_id serial PRIMARY KEY,  
  por_id integer NOT NULL REFERENCES portal.portal,
  pse_entity portal.entity,
  pse_name text NOT NULL,
  pse_order integer NOT NULL CHECK (pse_order > 0) ,
  CONSTRAINT pse_por_name_unique UNIQUE(por_id, pse_entity, pse_name),
  CONSTRAINT pse_por_order_unique UNIQUE(por_id, pse_entity, pse_order) DEFERRABLE INITIALLY IMMEDIATE
);
