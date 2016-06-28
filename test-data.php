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
$stfId1 = $base->organ->participant_add($token, 'Pierre', 'MARTIN');
$base->login->user_participant_set($token, $userLogin1, $stfId1);
$foo1 = $base->login->user_login($userLogin1, $fooInfo1['usr_temp_pwd'], null);
$base->login->user_change_password($foo1['usr_token'], 'bar');

// Create user foo2
$userLogin2 = 'foo2';
$base->login->user_add($token, $userLogin2, null, null);
$fooInfo2 = $base->login->user_info($token, $userLogin2);
$stfId2 = $base->organ->participant_add($token, 'Paul', 'DURAND');
$base->login->user_participant_set($token, $userLogin2, $stfId2);
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

// Create organizations with groups
$orgI = $base->organ->organization_add($token, "Organization I");
$orgII = $base->organ->organization_add($token, "Organization II");

$grpI1 = $base->organ->group_add($token, $orgI, 'Group 1 institution I');
$base->organ->group_set_topics($token, $grpI1, array('social', 'justice'));

$grpI2 = $base->organ->group_add($token, $orgI, 'Group 2 institution I');
$base->organ->group_set_topics($token, $grpI2, array('social', 'sport', 'culture'));

$grpII1 = $base->organ->group_add($token, $orgII, 'Group 1 institution II');
$base->organ->group_set_topics($token, $grpII1, array('sport'));

$grpII2 = $base->organ->group_add($token, $orgII, 'Group 2 institution II');
$base->organ->group_set_topics($token, $grpII2, array('financer', 'support'));

// Assign user1 to 1 group
//$base->organ->staff_group_assignment_add($token, $grpIA1, $stfId1);

// Assign user2 to 3 groups
/*
$base->organ->staff_group_assignment_add($token, $grpIA1, $stfId2);
$base->organ->staff_group_assignment_add($token, $grpIB2, $stfId2);
$base->organ->staff_group_assignment_add($token, $grpIIA2, $stfId2);
*/
$base->commit ();
