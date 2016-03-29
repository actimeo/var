CREATE SCHEMA portal;
COMMENT ON SCHEMA portal IS 'This module is used to create portals.
Portals are views of person data. Several portals can be created, depending on institution category, employee, etc.

A portal contains:
- a main navigation, which will contain information about all persons,
- and a navigation for each entity type (patient, staff, etc), which will contain information about a particular person of this type.

Each navigation is composed of sections containing menu entries.

All functions from this module require the ''structure'' user right.';

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
COMMENT ON TABLE portal IS 'A portal is a particular view of the data contained in the database. It will be defined by several navigation views, one main view (mainsection and mainmenu) and one view per entity type (personsection and personmenu).';
COMMENT ON COLUMN portal.por_id IS 'Unique identifier';
COMMENT ON COLUMN portal.por_name IS 'Portal name';

CREATE TABLE mainsection (
  mse_id serial PRIMARY KEY,
  por_id integer NOT NULL REFERENCES portal.portal,
  mse_name text NOT NULL,
  mse_order integer NOT NULL CHECK (mse_order > 0) ,
  CONSTRAINT mse_por_name_unique UNIQUE(por_id, mse_name),
  CONSTRAINT mse_por_order_unique UNIQUE(por_id, mse_order) DEFERRABLE INITIALLY IMMEDIATE
);
COMMENT ON TABLE mainsection IS 'The main view of a portal consists of menus regrouped in sections. This table defines these sections.';
COMMENT ON COLUMN mainsection.mse_id IS 'Unique identifier';
COMMENT ON COLUMN mainsection.por_id IS 'Portal containing this section';
COMMENT ON COLUMN mainsection.mse_name IS 'Section name';
COMMENT ON COLUMN mainsection.mse_order IS 'Order of the section in the portal';

CREATE TABLE mainmenu (
  mme_id serial PRIMARY KEY,
  mse_id integer NOT NULL REFERENCES portal.mainsection,
  mme_name text NOT NULL,
  mme_order integer NOT NULL CHECK (mme_order > 0) ,
  CONSTRAINT mme_mse_name_unique UNIQUE(mse_id, mme_name),
  CONSTRAINT mme_mse_order_unique UNIQUE(mse_id, mme_order) DEFERRABLE INITIALLY IMMEDIATE
);
COMMENT ON TABLE mainmenu IS 'Menu entries of a main view';
COMMENT ON COLUMN mainmenu.mme_id IS 'Unique identifier';
COMMENT ON COLUMN mainmenu.mse_id IS 'Main section containing this menu entry';
COMMENT ON COLUMN mainmenu.mme_name IS 'Menu name';
COMMENT ON COLUMN mainmenu.mme_order IS 'Menu order in the section';

CREATE TABLE personsection (
  pse_id serial PRIMARY KEY,  
  por_id integer NOT NULL REFERENCES portal.portal,
  pse_entity portal.entity,
  pse_name text NOT NULL,
  pse_order integer NOT NULL CHECK (pse_order > 0) ,
  CONSTRAINT pse_por_name_unique UNIQUE(por_id, pse_entity, pse_name),
  CONSTRAINT pse_por_order_unique UNIQUE(por_id, pse_entity, pse_order) DEFERRABLE INITIALLY IMMEDIATE
);
COMMENT ON TABLE personsection IS 'A view of a portal for an entity type consists of menus regrouped in sections. This table defines these sections.';
COMMENT ON COLUMN personsection.pse_id IS 'Unique identifier';
COMMENT ON COLUMN personsection.por_id IS 'Portal containing this section';
COMMENT ON COLUMN personsection.pse_entity IS 'Entity type for this view';
COMMENT ON COLUMN personsection.pse_name IS 'Section name';
COMMENT ON COLUMN personsection.pse_order IS 'Order of the section in the portal for the entity type';

CREATE TABLE personmenu (
  pme_id serial PRIMARY KEY,
  pse_id integer NOT NULL REFERENCES portal.personsection,
  pme_name text NOT NULL,
  pme_order integer NOT NULL CHECK (pme_order > 0) ,
  CONSTRAINT pme_pse_name_unique UNIQUE(pse_id, pme_name),
  CONSTRAINT pme_pse_order_unique UNIQUE(pse_id, pme_order) DEFERRABLE INITIALLY IMMEDIATE
);
COMMENT ON TABLE personmenu IS 'Menu entries of a view for an entity type';
COMMENT ON COLUMN personmenu.pme_id IS 'Unique identifier';
COMMENT ON COLUMN personmenu.pse_id IS 'Section containing this menu entry';
COMMENT ON COLUMN personmenu.pme_name IS 'Menu name';
COMMENT ON COLUMN personmenu.pme_order IS 'Menu order in the section';

/* person views */
/* ************ */
CREATE TYPE portal.personview_type AS ENUM ();

CREATE TABLE personview (
  pme_id integer PRIMARY KEY REFERENCES portal.personmenu,
  pvi_title text NOT NULL,
  pvi_icon text NOT NULL,
  pvi_type portal.personview_type NOT NULL
);
COMMENT ON TABLE personview IS 'Common information about a page displayed by an entity menu';
COMMENT ON COLUMN personview.pme_id IS 'Person menu to which the page is attached. At most one page can be attached to a menu';
COMMENT ON COLUMN personview.pvi_title IS 'Page title';
COMMENT ON COLUMN personview.pvi_icon IS 'Icon associated with the page';

/* main views */
/* ********** */
CREATE TYPE portal.mainview_type AS ENUM ();

CREATE TABLE mainview (
  mme_id integer PRIMARY KEY REFERENCES portal.mainmenu,
  mvi_title text NOT NULL,
  mvi_icon text NOT NULL,
  mvi_type portal.mainview_type NOT NULL,
  pme_id_associated integer REFERENCES portal.personview(pme_id)
);
COMMENT ON TABLE mainview IS 'Common information about a page displayed by a main menu.';
COMMENT ON COLUMN mainview.mme_id IS 'Main menu to which the page is attached. At most one page can be attached to a menu';
COMMENT ON COLUMN mainview.mvi_title IS 'Page title';
COMMENT ON COLUMN mainview.mvi_icon IS 'Icon associated with the page';
COMMENT ON COLUMN mainview.pme_id_associated IS 'Person view associated with this main view';
