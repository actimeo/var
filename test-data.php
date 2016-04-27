#! /usr/bin/php
<?php
require_once 'pgproc/php/pgprocedures.php';
require_once 'config.inc.php';

$base = new PgProcedures2 ($pg_host, $pg_user, $pg_pass, $pg_database);

$base->startTransaction();

$variationUser = $base->login->user_login('variation', 'variation', '{users,organization,structure}');

$token = $variationUser['usr_token'];
$userLogin = 'foo';
$base->login->user_add($token, $userLogin, null, null);
$fooInfo = $base->login->user_info($token, $userLogin);
$stfId = $base->organ->staff_add($token, 'Pierre', 'MARTIN');
$base->login->user_staff_set($token, $userLogin, $stfId);

$porId1 = $base->portal->portal_add($token, 'portal 1');
$porId2 = $base->portal->portal_add($token, 'portal 2');
$porId3 = $base->portal->portal_add($token, 'portal 3');

$base->login->user_portal_set($token, $userLogin, array($porId3, $porId2));

$foo = $base->login->user_login($userLogin, $fooInfo['usr_temp_pwd'], null);
$base->login->user_change_password($foo['usr_token'], 'bar');
$base->commit ();
