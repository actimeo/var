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
*/

CREATE OR REPLACE FUNCTION pgdoc.list_schemas(varchar)
RETURNS SETOF name
LANGUAGE SQL
STABLE
AS $$
   SELECT nspname FROM pg_namespace WHERE nspname NOT like $1 || '%';
$$;

CREATE OR REPLACE FUNCTION pgdoc.schema_description(varchar)
RETURNS text
LANGUAGE SQL
STABLE
AS $$
  SELECT pg_description.description                                                                                   
    FROM pg_namespace
    LEFT JOIN pg_description ON pg_namespace.oid = pg_description.objoid AND pg_description.objsubid = 0
  WHERE
    nspname = $1;
$$;

CREATE OR REPLACE FUNCTION pgdoc.schema_list_tables(varchar)
RETURNS SETOF name
LANGUAGE SQL
STABLE
AS $$
  SELECT pg_class.relname 
    FROM pg_class
    LEFT JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace
    WHERE pg_class.relkind = 'r' AND pg_namespace.nspname = $1;
$$;

CREATE OR REPLACE FUNCTION pgdoc.schema_list_types(varchar)
RETURNS SETOF name
LANGUAGE SQL
STABLE
AS $$
  SELECT pg_class.relname
    FROM pg_class
    LEFT JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace
    WHERE pg_class.relkind = 'c' AND pg_namespace.nspname = $1;
$$;

CREATE OR REPLACE FUNCTION pgdoc.schema_list_functions(varchar)
RETURNS SETOF name
LANGUAGE SQL
STABLE
AS $$
  SELECT pg_proc.proname
    FROM pg_proc
    LEFT JOIN pg_namespace ON pg_namespace.oid = pg_proc.pronamespace
    WHERE pg_namespace.nspname = $1;
$$;
