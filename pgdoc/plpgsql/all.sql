--  Copyright © 2014 ELOL
--    Written by Philippe Martin (contact@elol.fr)
-- --------------------------------------------------------------------------------
--     This file is part of pgprocedures.

--     pgprocedures is free software: you can redistribute it and/or modify
--     it under the terms of the GNU General Public License as published by
--     the Free Software Foundation, either version 3 of the License, or
--     (at your option) any later version.

--     pgprocedures is distributed in the hope that it will be useful,
--     but WITHOUT ANY WARRANTY; without even the implied warranty of
--     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
--     GNU General Public License for more details.

--     You should have received a copy of the GNU General Public License
--     along with pgprocedures.  If not, see <http://www.gnu.org/licenses/>.

/*
- list of schemas
- in a schema:
  - description
  - list of tables
  - list of types
  - list of functions

- details of table
 - description
 - list of columns
*/

CREATE OR REPLACE FUNCTION pgdoc.list_schemas(prm_ignore varchar[])
RETURNS SETOF name
LANGUAGE PLPGSQL
STABLE
AS $$
BEGIN
   RETURN QUERY SELECT nspname FROM pg_namespace WHERE nspname NOT like all(prm_ignore);
END;
$$;

CREATE OR REPLACE FUNCTION pgdoc.schema_description(prm_schema name)
RETURNS text
LANGUAGE PLPGSQL
STABLE
AS $$
DECLARE
  ret text;
BEGIN
  SELECT pg_description.description INTO ret
    FROM pg_namespace
    LEFT JOIN pg_description ON pg_namespace.oid = pg_description.objoid AND pg_description.objsubid = 0
  WHERE
    nspname = $1;
  RETURN ret;
END;
$$;

CREATE OR REPLACE FUNCTION pgdoc.schema_list_tables(prm_schema name)
RETURNS SETOF name
LANGUAGE PLPGSQL
STABLE
AS $$
BEGIN
  RETURN QUERY SELECT pg_class.relname 
    FROM pg_class
    LEFT JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace
    WHERE pg_class.relkind = 'r' AND pg_namespace.nspname = $1;
END;
$$;

CREATE OR REPLACE FUNCTION pgdoc.schema_list_types(prm_schema name)
RETURNS SETOF name
LANGUAGE PLPGSQL
STABLE
AS $$
BEGIN
  RETURN QUERY SELECT pg_class.relname
    FROM pg_class
    LEFT JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace
    WHERE pg_class.relkind = 'c' AND pg_namespace.nspname = $1;
END;
$$;

CREATE OR REPLACE FUNCTION pgdoc.schema_list_functions(prm_schema name)
RETURNS SETOF name
LANGUAGE PLPGSQL
STABLE
AS $$
BEGIN
  RETURN QUERY SELECT pg_proc.proname
    FROM pg_proc
    LEFT JOIN pg_namespace ON pg_namespace.oid = pg_proc.pronamespace
    WHERE pg_namespace.nspname = $1;
END;
$$;

CREATE OR REPLACE FUNCTION pgdoc.table_description(prm_schema name, prm_table name)
RETURNS text
LANGUAGE PLPGSQL
STABLE
AS $$
DECLARE
  ret text;
BEGIN
  SELECT pg_description.description INTO ret
    FROM pg_class
    LEFT JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace
    LEFT JOIN pg_description ON pg_class.oid = pg_description.objoid AND pg_description.objsubid = 0
  WHERE
    relname = prm_table AND nspname = prm_schema;
  RETURN ret;
END;
$$;

DROP FUNCTION IF EXISTS pgdoc.table_columns(prm_schema name, prm_table name);
DROP TYPE IF EXISTS pgdoc.table_columns;
CREATE TYPE pgdoc.table_columns AS (
  col smallint,
  colname name,
  isnotnull boolean,
  hasdefault boolean,
  deftext text,
  description text,
  typname name,
  typlen integer
);

CREATE FUNCTION pgdoc.table_columns(prm_schema name, prm_table name)
RETURNS SETOF pgdoc.table_columns
LANGUAGE PLPGSQL
STABLE
AS $$
BEGIN
  RETURN QUERY SELECT 
    attnum,
    attname,
    attnotnull,
    atthasdef,
    pg_attrdef.adsrc,
    description,
    pg_type.typname,
    CASE WHEN pg_attribute.atttypmod > 4 
      THEN pg_attribute.atttypmod - 4 
      ELSE atttypmod END
  FROM pg_attribute  
    INNER JOIN pg_class ON pg_class.oid = pg_attribute.attrelid
    INNER JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace
    LEFT JOIN pg_description
      ON pg_description.objoid = pg_attribute.attrelid
      AND pg_description.objsubid = pg_attribute.attnum
    LEFT JOIN pg_attrdef ON pg_attrdef.adrelid = pg_class.oid
    INNER JOIN pg_type ON pg_type.oid = pg_attribute.atttypid
  WHERE
    pg_class.relname = prm_table 
    AND pg_namespace.nspname = prm_schema
    AND attnum > 0
  ORDER BY attnum;
END;
$$;
