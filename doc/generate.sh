#! /bin/sh

. ../config.sh

postgresql_autodoc -d $DBNAME -h localhost -u $DBUSER --password=$DBPASS -t dia -s portal -f portal
postgresql_autodoc -d $DBNAME -h localhost -u $DBUSER --password=$DBPASS -t dia -s 'patient|organ' -f organ_patient
postgresql_autodoc -d $DBNAME -h localhost -u $DBUSER --password=$DBPASS  -f all -t dia
