<?php
require_once 'pgproc/php/pgprocedures.php';
require_once 'config.inc.php';

$base = new PgProcedures2 ($pg_host, $pg_user, $pg_pass, $pg_database);


$base->execute_sql('LISTEN toto');

for($i=0; $i<60; $i++) {
  $res = pg_get_notify($base->handler);
  if (isset($res['message']))
    print_r($res);
  sleep (1);
}
