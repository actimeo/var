#! /bin/bash
function err {
  echo $1;
  exit 1;
}

[ $(whoami) = 'postgres' ] || err 'must be postgres'

. config.sh

psql <<EOF
DROP DATABASE IF EXISTS $DBNAME;
CREATE DATABASE $DBNAME WITH ENCODING='UTF8' OWNER=$DBUSER;
EOF

PGPASSWORD=$DBPASS psql $DBNAME <<EOF
CREATE SCHEMA pgcrypto AUTHORIZATION $DBUSER;
CREATE EXTENSION pgcrypto WITH SCHEMA pgcrypto;
EOF
