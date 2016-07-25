#! /usr/bin/php
<?php
require_once '../pgproc/php/pgprocedures.php';
require_once '../config.inc.php';

$base = new PgProcedures2 ($pg_host, $pg_user, $pg_pass, $pg_database);

$base->startTransaction();

$variationUser = $base->login->user_login('variation', 'variation', '{users,organization,structure}');

$token = $variationUser['usr_token'];

// Create topics
$tSocial = $base->organ->topic_add($token, 'Social', 'Social');
$tJustice = $base->organ->topic_add($token, 'Justice', 'Justice');
$tSport = $base->organ->topic_add($token, 'Sport', 'Sport');
$tCulture = $base->organ->topic_add($token, 'Culture', 'Culture');
$tFinancer = $base->organ->topic_add($token, 'Financer', 'Financer');
$tSupport = $base->organ->topic_add($token, 'Support', 'Support');


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

$ug1 = $base->login->usergroup_add($token, 'Usergroup 1');
$ug2 = $base->login->usergroup_add($token, 'Usergroup 2');

// Give user1 access to 1 portal
$base->login->usergroup_set_portals($token, $ug1, array($porId3));
$base->login->user_usergroup_set($token, $userLogin1, $ug1);

// Give user2 access to 2 portals
$base->login->usergroup_set_portals($token, $ug2, array($porId3, $porId1));
$base->login->user_usergroup_set($token, $userLogin2, $ug2);

// Create organizations with groups
$orgI = $base->organ->organization_add($token, "Organization I", "First organization", true);
$orgII = $base->organ->organization_add($token, "Organization II", "Second organization", true);

$grpI1 = $base->organ->group_add($token, $orgI, 'Group 1 institution I', 'Group I 1');
$base->organ->group_set_topics($token, $grpI1, array($tSocial, $tJustice));

$grpI2 = $base->organ->group_add($token, $orgI, 'Group 2 institution I', 'Group I 2');
$base->organ->group_set_topics($token, $grpI2, array($tSocial, $tSport, $tCulture));

$grpII1 = $base->organ->group_add($token, $orgII, 'Group 1 institution II', 'Group II 1');
$base->organ->group_set_topics($token, $grpII1, array($tSport));

$grpII2 = $base->organ->group_add($token, $orgII, 'Group 2 institution II', 'Group II 2');
$base->organ->group_set_topics($token, $grpII2, array($tFinancer, $tSupport));

// Assign user1 to 1 group
$base->organ->participant_assignment_add($token, $grpI1, $stfId1);

// Assign user2 to 3 groups
$base->organ->participant_assignment_add($token, $grpI1, $stfId2);
$base->organ->participant_assignment_add($token, $grpI2, $stfId2);
$base->organ->participant_assignment_add($token, $grpII2, $stfId2);

$base->commit ();
