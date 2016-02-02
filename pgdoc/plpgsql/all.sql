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
- detail of types
 - description
 - list of columns
 - functions returning type
- detail of functions
 - description
 - sources
 - return type (schema + name)
 - returns set?
 - language
 - volatility ([i]mmutable, [s]table, [v]olatile)
 - arguments
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
    pg_class.relkind='r' AND relname = prm_table AND nspname = prm_schema;
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
    AND pg_class.relkind = 'r'
    AND pg_namespace.nspname = prm_schema
    AND attnum > 0
  ORDER BY attnum;
END;
$$;

CREATE OR REPLACE FUNCTION pgdoc.type_description(prm_schema name, prm_type name)
RETURNS text
LANGUAGE PLPGSQL
STABLE
AS $$
DECLARE
  ret text;
BEGIN
  SELECT pg_description.description INTO ret
    FROM pg_type
    LEFT JOIN pg_namespace ON pg_namespace.oid = pg_type.typnamespace
    LEFT JOIN pg_description ON pg_type.oid = pg_description.objoid AND pg_description.objsubid = 0
  WHERE
    typname = prm_type AND nspname = prm_schema;
  RETURN ret;
END;
$$;

DROP FUNCTION IF EXISTS pgdoc.type_columns(prm_schema name, prm_type name);
DROP TYPE IF EXISTS pgdoc.type_columns;
CREATE TYPE pgdoc.type_columns AS (
  col smallint,
  colname name,
  description text,
  typname name,
  typlen integer
);

CREATE FUNCTION pgdoc.type_columns(prm_schema name, prm_type name)
RETURNS SETOF pgdoc.type_columns
LANGUAGE PLPGSQL
STABLE
AS $$
BEGIN
  RETURN QUERY SELECT 
    attnum,
    attname,
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
    INNER JOIN pg_type ON pg_type.oid = pg_attribute.atttypid
  WHERE
    pg_class.relname = prm_type
    AND pg_class.relkind = 'c'
    AND pg_namespace.nspname = prm_schema
    AND attnum > 0
  ORDER BY attnum;
END;
$$;

CREATE OR REPLACE FUNCTION pgdoc.functions_returning_type(prm_schema name, prm_type name)
RETURNS SETOF name
LANGUAGE PLPGSQL
STABLE
AS $$
BEGIN
  RETURN QUERY SELECT 
    pg_proc.proname --|| '(' || array_to_string(pg_proc.proargnames, ', ') || ')' 
    FROM pg_proc
    INNER JOIN pg_namespace on pg_proc.pronamespace = pg_namespace.oid
    INNER JOIN pg_type ON pg_proc.prorettype = pg_type.oid
    WHERE pg_namespace.nspname = prm_schema
    AND pg_type.typname = prm_type
    ORDER BY pg_proc.proname; --|| '(' || array_to_string(pg_proc.proargnames, ', ') || ')';
END;
$$;

DROP FUNCTION IF EXISTS pgdoc.function_details(prm_schema name, prm_function name);
DROP TYPE IF EXISTS pgdoc.function_details;
CREATE TYPE pgdoc.function_details AS (
  description text,
  src text,
  rettype_schema name,
  rettype_name name,
  retset boolean,
  lang name,
  volatility "char"
);

CREATE FUNCTION pgdoc.function_details(prm_schema name, prm_function name) 
RETURNS pgdoc.function_details
LANGUAGE PLPGSQL
STABLE
AS $$
DECLARE
  ret pgdoc.function_details;
BEGIN
  SELECT 
    description,
    regexp_replace(prosrc, '^\s+', ''),
    retschema.nspname,
    rettype.typname,
    proretset,
    pg_language.lanname,
    pg_proc.provolatile
  INTO ret
  FROM pg_proc
    INNER JOIN pg_description ON pg_description.objoid = pg_proc.oid
    INNER JOIN pg_namespace ON pg_namespace.oid = pg_proc.pronamespace
    INNER JOIN pg_type rettype ON rettype.oid = prorettype
    INNER JOIN pg_namespace retschema ON retschema.oid = rettype.typnamespace
    INNER JOIN pg_language ON pg_language.oid = pg_proc.prolang
  WHERE pg_namespace.nspname = prm_schema AND proname = prm_function;
  RETURN ret;
END;
$$;

DROP FUNCTION IF EXISTS pgdoc.function_arguments(prm_schema name, prm_function name);
DROP TYPE IF EXISTS pgdoc.function_arguments;
CREATE TYPE pgdoc.function_arguments AS (
  argtype text,
  argname text
);

CREATE FUNCTION pgdoc.function_arguments(prm_schema name, prm_function name)
RETURNS SETOF pgdoc.function_arguments
LANGUAGE PLPGSQL
STABLE
AS $$
BEGIN
  RETURN QUERY SELECT 
    format_type(unnest(proargtypes), null) , 
    unnest(proargnames) 
    FROM pg_proc
    INNER JOIN pg_namespace ON pg_namespace.oid = pg_proc.pronamespace
    WHERE proname = prm_function AND nspname = prm_schema;
END;
$$;
