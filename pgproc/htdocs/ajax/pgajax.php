<?php
require '../../../pgproc/php/pgprocedures.php';
require_once ('../../../config.inc.php');
$base = new PgProcedures2 ($pg_host, $pg_user, $pg_pass, $pg_database);

$cmd = $_SERVER['PHP_SELF'];
$cmd = basename ($cmd, '.php');

$body = json_decode(file_get_contents('php://input'));

if (strpos($cmd, '@')) {
  list($schema, $function) = explode('@', $cmd, 2);
} else {
  $schema = 'public';
  $function = $cmd;
}

$debug = false;

$ret = $base->get_arguments ($schema, $function);

$all = false;
if (count ($ret)) {
  foreach ($ret as $r) {
    $all = true;
    foreach ($r['argnames'] as $argname) {
      if (!property_exists ($body, $argname)) {
	if ($debug) {
	  echo "$argname not found\n" ;
	  print_r ($body);
	}
	$all = false;
	break;
      }
    }
    if ($all) {
      break;
    }    
  }
}

// Continue, $r contains argnames and argtypes
$args = array ();
if ($all) {
  foreach ($r['argnames'] as $argname) {
    $args[] = get_magic_quotes_gpc() ? stripslashes($body->$argname) : $body->$argname;
  }
}

if (isset($body->_count) && $body->_count === true)
  $args[] = $base->count();

if (isset($body->_order)) {
  if (is_object($body->_order))
    $args[] = $base->order($body->_order->col, strtoupper($body->_order->order));
  else
    $args[] = $base->order($body->_order);
}

if (isset($body->_limit)) {
  if (is_object($body->_limit))
    $args[] = $base->limit($body->_limit->limit, $body->_limit->offset);
  else
    $args[] = $base->limit($body->_limit);
}

if (isset($body->_distinct)) {
  $args[] = $base->distinct();
}

try {
  $results = $base->$schema->__call ($function, $args);
} catch (PgProcFunctionNotAvailableException $e) {
  header($_SERVER["SERVER_PROTOCOL"]." 404 Not Found"); 
  echo $e->getMessage();
  exit;
} catch (PgProcException $e) {
  header($_SERVER["SERVER_PROTOCOL"]." 400 Bad Request"); 
  echo $e->getMessage();
  exit;
} catch (Exception $e) {
  header($_SERVER["SERVER_PROTOCOL"]." 400 Bad Request"); 
  echo $e->getMessage();
  exit;
}

header ('Content-Type: application/json ; charset=utf-8');
header ('Cache-Control: no-cache , private');
header ('Pragma: no-cache');
if ($results !== null) 
  echo json_encode ($results);
else 
  echo '[]';
exit;
