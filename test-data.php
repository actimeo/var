#! /usr/bin/php
<?php
require_once 'pgproc/php/pgprocedures.php';
require_once 'config.inc.php';

$base = new PgProcedures2 ($pg_host, $pg_user, $pg_pass, $pg_database);

$base->startTransaction();

$variationUser = $base->login->user_login('variation', 'variation', '{users,organization,structure}');

$token = $variationUser['usr_token'];

// Create user foo1
$userLogin1 = 'foo1';
$base->login->user_add($token, $userLogin1, null, null);
$fooInfo1 = $base->login->user_info($token, $userLogin1);
$stfId1 = $base->organ->staff_add($token, 'Pierre', 'MARTIN');
$base->login->user_staff_set($token, $userLogin1, $stfId1);
$foo1 = $base->login->user_login($userLogin1, $fooInfo1['usr_temp_pwd'], null);
$base->login->user_change_password($foo1['usr_token'], 'bar');

// Create user foo2
$userLogin2 = 'foo2';
$base->login->user_add($token, $userLogin2, null, null);
$fooInfo2 = $base->login->user_info($token, $userLogin2);
$stfId2 = $base->organ->staff_add($token, 'Paul', 'DURAND');
$base->login->user_staff_set($token, $userLogin2, $stfId2);
$foo2 = $base->login->user_login($userLogin2, $fooInfo2['usr_temp_pwd'], null);
$base->login->user_change_password($foo2['usr_token'], 'bar');

// Create portals
$porId1 = $base->portal->portal_add($token, 'portal 1');
$porId2 = $base->portal->portal_add($token, 'portal 2');
$porId3 = $base->portal->portal_add($token, 'portal 3');

// Give user1 access to 1 portal
$base->login->user_portal_set($token, $userLogin1, array($porId3));

// Give user2 access to 2 portals
$base->login->user_portal_set($token, $userLogin2, array($porId3, $porId1));

// Create institutions with services and groups
$instI = $base->organ->institution_add($token, "Institution I");
$instII = $base->organ->institution_add($token, "Institution II");

$servIA = $base->organ->service_add($token, $instI, 'Service A institution I');
$base->organ->service_set_topics($token, $servIA, array('social', 'justice'));
$servIB = $base->organ->service_add($token, $instI, 'Service B institution I');
$base->organ->service_set_topics($token, $servIB, array('social', 'sport', 'culture'));

$servIIA = $base->organ->service_add($token, $instII, 'Service A institution II');
$base->organ->service_set_topics($token, $servIIA, array('sport'));
$servIIB = $base->organ->service_add($token, $instII, 'Service B institution II');
$base->organ->service_set_topics($token, $servIIB, array('financer', 'support'));

$grpIA1 = $base->organ->service_group_add($token, $servIA, 'Group 1, service A institution I');
$grpIA2 = $base->organ->service_group_add($token, $servIA, 'Group 2, service A institution I');

$grpIB1 = $base->organ->service_group_add($token, $servIB, 'Group 1, service B institution I');
$grpIB2 = $base->organ->service_group_add($token, $servIB, 'Group 2, service B institution I');

$grpIIA1 = $base->organ->service_group_add($token, $servIIA, 'Group 1, service A institution II');
$grpIIA2 = $base->organ->service_group_add($token, $servIIA, 'Group 2, service A institution II');

$grpIIB1 = $base->organ->service_group_add($token, $servIIB, 'Group 1, service B institution II');
$grpIIB2 = $base->organ->service_group_add($token, $servIIB, 'Group 2, service B institution II');

// Assign user1 to 1 group
$base->organ->staff_group_assignment_add($token, $grpIA1, $stfId1);

// Assign user1 to 3 groups
$base->organ->staff_group_assignment_add($token, $grpIA1, $stfId2);
$base->organ->staff_group_assignment_add($token, $grpIB2, $stfId2);
$base->organ->staff_group_assignment_add($token, $grpIIA2, $stfId2);

$base->commit ();
