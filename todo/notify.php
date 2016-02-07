<?php
require_once 'pgproc/php/pgprocedures.php';
require_once 'config.inc.php';

$base = new PgProcedures2 ($pg_host, $pg_user, $pg_pass, $pg_database);

$ret = $base->execute_sql('NOTIFY toto');
print_r($ret);
