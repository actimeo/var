#! /bin/bash
. config.sh
if [ "$DBNAME" = "" ]; then
    echo "ERR: DBNAME non défini dans inc/config.sh";
    exit;
fi
if [ "$DBPASS" = "" ]; then
    echo "ERR: DBPASS non défini dans inc/config.sh";
    exit;
fi
if [ "$DBUSER" = "" ]; then
    echo "ERR: DBUSER non défini dans inc/config.sh";
    exit;
fi

FILES=
FILES="$FILES ./login/plpgsql/user.sql"
FILES="$FILES ./organ/plpgsql/organization.sql"
FILES="$FILES ./organ/plpgsql/group.sql"
FILES="$FILES ./organ/plpgsql/participant_assignment.sql"
FILES="$FILES ./organ/plpgsql/participant.sql"
FILES="$FILES ./organ/sql/comments.sql"
FILES="$FILES ./pgdoc/plpgsql/all.sql"
FILES="$FILES ./pgproc/plpgsql/all.sql"
FILES="$FILES ./portal/plpgsql/entity.sql"
FILES="$FILES ./portal/plpgsql/mainmenu.sql"
FILES="$FILES ./portal/plpgsql/mainsection.sql"
FILES="$FILES ./portal/plpgsql/mainview_element.sql"
FILES="$FILES ./portal/plpgsql/mainview.sql"
FILES="$FILES ./portal/plpgsql/param.sql"
FILES="$FILES ./portal/plpgsql/personmenu.sql"
FILES="$FILES ./portal/plpgsql/personsection.sql"
FILES="$FILES ./portal/plpgsql/personview_element.sql"
FILES="$FILES ./portal/plpgsql/personview.sql"
FILES="$FILES ./portal/plpgsql/portal.sql"
FILES="$FILES ./portal/plpgsql/topics.sql"
FILES="$FILES ./login/sql/comments.sql"
FILES="$FILES ./portal/sql/comments.sql"
FILES="$FILES ./pgproc/tests/tests.sql"

echo 'Updating PL/PgSQL from files:'
for i in $FILES; do 
    echo " - $i";
done
(echo 'BEGIN TRANSACTION; ' && cat $FILES && echo 'COMMIT; ' ) |  PGPASSWORD=$DBPASS PGOPTIONS="--client-min-messages=warning" psql -q -h localhost -U $DBUSER $DBNAME
