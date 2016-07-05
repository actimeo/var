#! /usr/bin/php
<?php
require_once '../pgproc/php/pgprocedures.php';
require_once '../config.inc.php';

$base = new PgProcedures2 ($pg_host, $pg_user, $pg_pass, $pg_database);

$base->startTransaction();

$variationUser = $base->login->user_login('variation', 'variation', '{users,organization,structure}');

$token = $variationUser['usr_token'];

// Create topics
$tHygiene = $base->organ->topic_add($token, 'Hygiène corporelle');
$tBudget = $base->organ->topic_add($token, 'Argent de poche et gestion du budget');
$tPlacement = $base->organ->topic_add($token, 'Mesures lacement (ASE, PJJ, TE)');
$tEtatCivil = $base->organ->topic_add($token, 'État civil et droits de séjour');
$tEducation = $base->organ->topic_add($token, 'Accompagnement éducatif');
$tStage = $base->organ->topic_add($token, 'Stages et apprentissage');
$tEntretien = $base->organ->topic_add($token, 'Entretien et participation aux services');
$tVeture = $base->organ->topic_add($token, 'Vêture et autres fournitures');
$tFamille = $base->organ->topic_add($token, 'Famille, tuteur et parrainage');
$tLogement = $base->organ->topic_add($token, 'Logement collectif ou individuel');
$tScolarite = $base->organ->topic_add($token, 'Scolarité');
$tPriseEnCharge = $base->organ->topic_add($token, 'Prises en charge, admission et autorisations');
$tProjet = $base->organ->topic_add($token, 'Projet individuel');
$tPsy = $base->organ->topic_add($token, 'Accompagnement psychologique');
$tRestauration = $base->organ->topic_add($token, 'Restauration et alimentation');
$tSante = $base->organ->topic_add($token, 'Suivi médical');
$tSocial = $base->organ->topic_add($token, 'Vie sociale, loisirs et séjours');
$tTransport = $base->organ->topic_add($token, 'Transport');


// Create user marie, Secrétaire
$loginMarie = 'marie';
$uMarie = create_user($base, $token, $loginMarie, 'marie', 'Marie', 'SECRET');

// Create user jeanne, Psychologue
$loginJeanne = 'jeanne';
$uJeanne = create_user($base, $token, $loginJeanne, 'jeanne', 'Jeanne', 'PSYCHO');

// Create paul, jean, pierre, sophie, Éducateurs
$loginPaul = 'paul';
$loginJean = 'jean';
$loginPierre = 'pierre';
$loginSophie = 'sophie';
$uPaul = create_user($base, $token, $loginPaul, 'paul', 'Paul', 'ÉDUC');
$uJean = create_user($base, $token, $loginJean, 'jean', 'Jean', 'ÉDUC');
$uPierre = create_user($base, $token, $loginPierre, 'pierre', 'Pierre', 'ÉDUC');
$uSophie = create_user($base, $token, $loginSophie, 'sophie', 'Sophie', 'ÉDUC');

// Create portals
$pEncadrement = $base->portal->portal_add($token, 'Encadrement');
$pEducateur = $base->portal->portal_add($token, 'Éducateur');

// Give marie and jeanne access to portal Encadrement
foreach (array($loginMarie, $loginJeanne) as $login) {
  $base->login->user_portal_set($token, $login, array($pEncadrement));
}

// Give paul, jean, pierre and sophie access to portal Éducateur
foreach (array($loginPaul, $loginJean, $loginPierre, $loginSophie) as $login) {
  $base->login->user_portal_set($token, $login, array($pEducateur));
}

// Create MECS Sauvegarde organization with groups
$oMecs = $base->organ->organization_add($token, "MECS Sauvegarde", true);

// Groups Pavillon 1, 2
$topicsPavillons = array($tLogement, $tRestauration, $tEducation, $tProjet, $tVeture, $tEntretien, $tBudget, $tTransport);
$gPavillon1 = $base->organ->group_add($token, $oMecs, 'Pavillon 1');
$gPavillon2 = $base->organ->group_add($token, $oMecs, 'Pavillon 2');
$base->organ->group_set_topics($token, $gPavillon1, $topicsPavillons);
$base->organ->group_set_topics($token, $gPavillon2, $topicsPavillons);

// Group Suivi psychologique
$gPsy = $base->organ->group_add($token, $oMecs, 'Suivi psychologique'); // TODO mandatory
$base->organ->group_set_topics($token, $gPsy, array($tPsy, $tProjet));

// Group Suivi administratif
$gAdmin = $base->organ->group_add($token, $oMecs, 'Suivi administratif'); // TODO mandatory
$base->organ->group_set_topics($token, $gAdmin, array($tPriseEnCharge));

// Create Ecole Georges Brassens with classes
$oEcole = $base->organ->organization_add($token, "École Georges Brassens", false);
$topicsEcole = array($tEducation);

$gCp = $base->organ->group_add($token, $oEcole, 'CP');
$gCe1 = $base->organ->group_add($token, $oEcole, 'CE1');
$gCe2 = $base->organ->group_add($token, $oEcole, 'CE2');
$gCm1 = $base->organ->group_add($token, $oEcole, 'CM1');
$gCm2 = $base->organ->group_add($token, $oEcole, 'CM2');

foreach (array($gCp, $gCe1, $gCe2, $gCm1, $gCm2) as $group) { 
  $base->organ->group_set_topics($token, $group, $topicsEcole);
}



/*
// Assign user1 to 1 group
$base->organ->participant_assignment_add($token, $grpI1, $stfId1);

// Assign user2 to 3 groups
$base->organ->participant_assignment_add($token, $grpI1, $stfId2);
$base->organ->participant_assignment_add($token, $grpI2, $stfId2);
$base->organ->participant_assignment_add($token, $grpII2, $stfId2);
*/
$base->commit ();

function create_user($base, $token, $login, $pwd, $firstname, $lastname) {
  $base->login->user_add($token, $login, null, null);
  $userInfo = $base->login->user_info($token, $login);
  $parId = $base->organ->participant_add($token, $firstname, $lastname);
  $base->login->user_participant_set($token, $login, $parId);
  $user = $base->login->user_login($login, $userInfo['usr_temp_pwd'], null);
  $base->login->user_change_password($user['usr_token'], $pwd);
  return $parId;
}