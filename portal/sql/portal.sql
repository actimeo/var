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
COMMENT ON TYPE portal.entity IS 'The different types of persons';

CREATE TYPE portal.topics AS ENUM (
  'social',
  'education',
  'health',
  'pedagogy',
  'justice',
  'employment',
  'lodging',
  'sport',
  'culture',
  'transport',
  'decisionmaker',
  'financer',
  'support',
  'entertainment',
  'juridic_protection',
  'catering',
  'housekeeping',
  'personal_assistance',
  'financial_assistance',
  'equipment',
  'family',
  'project',
  'visit',
  'medical_care',
  'dietetic',
  'occupational_therapy',
  'physiotherapy',
  'kinesitherapy',
  'speech_therapy',
  'psychomotor',
  'psychology',
  'residence_right',
  'formalities_assistance'
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
  UNIQUE(por_id, mse_name),
  UNIQUE(por_id, mse_order)
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
  UNIQUE(mse_id, mme_name),
  UNIQUE(mse_id, mme_order) 
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
  UNIQUE(por_id, pse_entity, pse_name),
  UNIQUE(por_id, pse_entity, pse_order)
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
  UNIQUE(pse_id, pme_name),
  UNIQUE(pse_id, pme_order) 
);
COMMENT ON TABLE personmenu IS 'Menu entries of a view for an entity type';
COMMENT ON COLUMN personmenu.pme_id IS 'Unique identifier';
COMMENT ON COLUMN personmenu.pse_id IS 'Section containing this menu entry';
COMMENT ON COLUMN personmenu.pme_name IS 'Menu name';
COMMENT ON COLUMN personmenu.pme_order IS 'Menu order in the section';

/* person views */
/* ************ */
CREATE TYPE portal.personview_element_type AS ENUM (
  'personsample1',
  'personsample2'
);
COMMENT ON TYPE portal.personview_element_type IS 'Different types of person views. Modules can add values to this type';

CREATE TABLE personview_element (
  pve_id serial PRIMARY KEY,
  pve_type portal.personview_element_type NOT NULL,
  pve_name text NOT NULL,
  pve_entities portal.entity[] NOT NULL 
    CHECK (pve_entities <> '{}'),
  UNIQUE(pve_type, pve_name)
);
COMMENT ON TABLE portal.personview_element IS 'Elements that can be attached to a person view';
COMMENT ON COLUMN personview_element.pve_id IS 'Unique identifier';
COMMENT ON COLUMN personview_element.pve_type IS 'Type of person view element';
COMMENT ON COLUMN personview_element.pve_name IS 'Name of person view element';

CREATE TABLE personview (
  pme_id integer PRIMARY KEY REFERENCES portal.personmenu,
  pvi_title text NOT NULL,
  pvi_icon text NOT NULL,
  pve_id integer NOT NULL REFERENCES portal.personview_element
);
COMMENT ON TABLE personview IS 'Common information about a page displayed by an entity menu';
COMMENT ON COLUMN personview.pme_id IS 'Person menu to which the page is attached. At most one page can be attached to a menu';
COMMENT ON COLUMN personview.pvi_title IS 'Page title';
COMMENT ON COLUMN personview.pvi_icon IS 'Icon associated with the page';
COMMENT ON COLUMN personview.pve_id IS 'Person view element attached to this view';

/* main views */
/* ********** */
CREATE TYPE portal.mainview_element_type AS ENUM (
  'sample1',
  'sample2'
);
COMMENT ON TYPE portal.mainview_element_type IS 'Different types of main views. Modules can add values to this type';

CREATE TABLE mainview_element (
  mve_id serial PRIMARY KEY,
  mve_type portal.mainview_element_type NOT NULL,
  mve_name text NOT NULL,
  UNIQUE(mve_type, mve_name)
);
COMMENT ON TABLE portal.mainview_element IS 'Elements that can be attached to a main view';
COMMENT ON COLUMN mainview_element.mve_id IS 'Unique identifier';
COMMENT ON COLUMN mainview_element.mve_type IS 'Type of main view element';
COMMENT ON COLUMN mainview_element.mve_name IS 'Name of main view element';

CREATE TABLE mainview (
  mme_id integer PRIMARY KEY REFERENCES portal.mainmenu,
  mvi_title text NOT NULL,
  mvi_icon text NOT NULL,
  mve_id integer NOT NULL REFERENCES portal.mainview_element,
  pme_id_associated integer REFERENCES portal.personview(pme_id)
);
COMMENT ON TABLE mainview IS 'Common information about a page displayed by a main menu.';
COMMENT ON COLUMN mainview.mme_id IS 'Main menu to which the page is attached. At most one page can be attached to a menu';
COMMENT ON COLUMN mainview.mvi_title IS 'Page title';
COMMENT ON COLUMN mainview.mvi_icon IS 'Icon associated with the page';
COMMENT ON COLUMN mainview.mve_id IS 'Main view element attached to this view';
COMMENT ON COLUMN mainview.pme_id_associated IS 'Person view associated with this main view';

-- portal parameters
CREATE TYPE portal.param_type AS ENUM (
  'topic', 
  'bool'
);
COMMENT ON TYPE portal.param_type IS 'The different types of portal parameters. Modules *cannot* add values to this type';

CREATE TYPE portal.param AS ENUM (
  'topic.topic',
  'add-patient.bool',
  'add-staff.bool',
  'add-contact.bool',
  'add-family.bool',
  'delete-notes.bool'  
);
COMMENT ON TYPE portal.param IS 'The portal parameters. The name is composed of two elements, separated by a dot (.): the name and the type (from portal.param_type). Modules can add values to this type';

CREATE TABLE portal.param_value (
  por_id integer NOT NULL REFERENCES portal.portal,
  pva_param portal.param NOT NULL,
  pva_value_bool boolean,
  pva_value_topic portal.topics, 
  CONSTRAINT pva_pkey PRIMARY KEY(por_id, pva_param)
);
