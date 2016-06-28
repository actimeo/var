<?php
require_once '../../pgproc/php/pgprocedures.php';
require_once '../../config.inc.php';

class coreTest extends PHPUnit_Framework_TestCase {
    private static $base;
  private static $pgHost;
  private static $pgUser;
  private static $pgPass;
  private static $pgDatabase;

  public static function setUpBeforeClass() {
    
    // Get connection params
    global $pg_host, $pg_user, $pg_pass, $pg_database;
    self::$pgHost = $pg_host;
    self::$pgUser = $pg_user;
    self::$pgPass = $pg_pass;
    self::$pgDatabase = $pg_database;
    self::assertNotNull(self::$pgHost);
    self::assertNotNull(self::$pgUser);
    self::assertNotNull(self::$pgPass);
    self::assertNotNull(self::$pgDatabase);
    
    // Create object
    self::$base = new PgProcedures2 (self::$pgHost, self::$pgUser, self::$pgPass, self::$pgDatabase);
    self::assertNotNull(self::$base);    
  }

  protected function assertPreConditions()
  {
    //    echo "\n".'*** pre conditions'."\n";
    self::$base->startTransaction();
  }

  protected function assertPostConditions()
  {
    //    echo "\n".'*** post conditions'."\n";
    self::$base->rollback();
  }

  /**
   * Valid authentication 
   */
  public function testUserLoginOk() {
    $login = 'testdejfhcqcsdfkhn';
    $pwd = 'ksfdjgsfdyubg';    
    self::$base->execute_sql("insert into login.user (usr_login, usr_salt, usr_rights) values ('".$login."', pgcrypto.crypt('".$pwd."', pgcrypto.gen_salt('bf', 8)), NULL);");

    $res = self::$base->login->user_login($login, $pwd, null);
    $this->assertGreaterThan(0, $res['usr_token']);
    $this->assertFalse($res['usr_temp_pwd']);
    $this->assertNull($res['usr_rights']);
  }
  
  /**
   * Login exception with wrong password
   * @expectedException PgProcException
   */
  public function testUserLoginExceptionWrongPwd() {
    $login = 'testdejfhcqcsdfkhn';
    $pwd = 'ksfdjgsfdyubg';    
    self::$base->execute_sql("insert into login.user(usr_login, usr_salt, usr_rights) values ('".$login."', pgcrypto.crypt('".$pwd."', pgcrypto.gen_salt('bf', 8)), NULL);");

    $res = self::$base->login->user_login($login, $pwd."X", null);
  }

  /**
   * Login exception with insufficient/no rights
   * @expectedException PgProcException
   */
  public function testUserLoginExceptionNoRight() {
    $login = 'testdejfhcqcsdfkhn';
    $pwd = 'ksfdjgsfdyubg';    
    self::$base->execute_sql("insert into login.user(usr_login, usr_salt, usr_rights) values ('".$login."', pgcrypto.crypt('".$pwd."', pgcrypto.gen_salt('bf', 8)), null);");

    $res = self::$base->login->user_login($login, $pwd, '{structure}');
  }

  /**
   * Login exception with insufficient/wrong rights
   * @expectedException PgProcException
   */
  public function testUserLoginExceptionWrongRight() {
    $login = 'testdejfhcqcsdfkhn';
    $pwd = 'ksfdjgsfdyubg';    
    self::$base->execute_sql("insert into login.user(usr_login, usr_salt, usr_rights) values ('".$login."', pgcrypto.crypt('".$pwd."', pgcrypto.gen_salt('bf', 8)), '{users}');");

    $res = self::$base->login->user_login($login, $pwd, '{structure}');
  }

  /**
   * Test user logout
   */
  public function testUserLogoutOk() {
    $login = 'testdejfhcqcsdfkhn';
    $pwd = 'ksfdjgsfdyubg';    
    self::$base->execute_sql("insert into login.user (usr_login, usr_salt, usr_rights) values ('".$login."', pgcrypto.crypt('".$pwd."', pgcrypto.gen_salt('bf', 8)), NULL);");

    $res = self::$base->login->user_login($login, $pwd, null);
    $this->assertGreaterThan(0, $res['usr_token']);

    self::$base->login->user_logout($res['usr_token']);

    // Token should be invalid now
    $this->setExpectedException('PgProcException');
    self::$base->login->user_logout($res['usr_token']);
  }

  /**
   * Test password change
   */
  public function testUserChangePassword() {
    $login = 'testdejfhcqcsdfkhn';
    $pwd = 'ksfdjgsfdyubg';    
    $newpwd = 'sdfjkgh';    
    self::$base->execute_sql("insert into login.user (usr_login, usr_salt, usr_rights) values ('".$login."', pgcrypto.crypt('".$pwd."', pgcrypto.gen_salt('bf', 8)), NULL);");

    $res = self::$base->login->user_login($login, $pwd, null);
    $this->assertGreaterThan(0, $res['usr_token']);

    self::$base->login->user_change_password($res['usr_token'], $newpwd);
    self::$base->login->user_logout($res['usr_token']);

    $res = self::$base->login->user_login($login, $newpwd, null);
    $this->assertGreaterThan(0, $res['usr_token']);
    $this->assertFalse($res['usr_temp_pwd']);
    
    self::$base->login->user_logout($res['usr_token']);
    $this->setExpectedException('PgProcException');
    $res = self::$base->login->user_login($login, 'wrong_pwd', null);
  }

  /**
   * Test password regenerate
   */
  public function testUserRegeneratePassword() {
    $loginAdmin = 'admin';
    $pwdAdmin = 'ksfdjgsfdyubg';    
    
    $loginLost = 'toto';
    $pwdLost = 'tata';

    self::$base->execute_sql("insert into login.user (usr_login, usr_salt, usr_rights) values ('".$loginAdmin."', pgcrypto.crypt('".$pwdAdmin."', pgcrypto.gen_salt('bf', 8)), '{users}');");

    self::$base->execute_sql("insert into login.user (usr_login, usr_salt, usr_rights) values ('".$loginLost."', pgcrypto.crypt('".$pwdLost."', pgcrypto.gen_salt('bf', 8)), NULL);");

    $admin = self::$base->login->user_login($loginAdmin, $pwdAdmin, null);
    $this->assertGreaterThan(0, $admin['usr_token']);

    $toto = self::$base->login->user_login($loginLost, $pwdLost, null);
    $this->assertGreaterThan(0, $toto['usr_token']);
    self::$base->login->user_logout($toto['usr_token']);
    
    $tmppwd = self::$base->login->user_regenerate_password($admin['usr_token'], $loginLost);

    $toto2 = self::$base->login->user_login($loginLost, $tmppwd, null);
    $this->assertGreaterThan(0, $toto2['usr_token']);
    $this->assertTrue($toto2['usr_temp_pwd']);
    self::$base->login->user_logout($toto2['usr_token']);
    
  }

  /**
   * Test password regenerate on same user
   */
  public function testUserRegenerateMyPassword() {
    $loginAdmin = 'admin';
    $pwdAdmin = 'ksfdjgsfdyubg';    
    
    self::$base->execute_sql("insert into login.user (usr_login, usr_salt, usr_rights) values ('".$loginAdmin."', pgcrypto.crypt('".$pwdAdmin."', pgcrypto.gen_salt('bf', 8)), NULL);");

    $admin = self::$base->login->user_login($loginAdmin, $pwdAdmin, null);
    $this->assertGreaterThan(0, $admin['usr_token']);
    
    $this->setExpectedException('PgProcException');
    $tmppwd = self::$base->login->user_regenerate_password($admin['usr_token'], $loginAdmin);    
  }

  public function testUserAdd() {
    $loginAdmin = 'admin';
    $pwdAdmin = 'ksfdjgsfdyubg';    
    
    self::$base->execute_sql("insert into login.user (usr_login, usr_salt, usr_rights) values ('".$loginAdmin."', pgcrypto.crypt('".$pwdAdmin."', pgcrypto.gen_salt('bf', 8)), '{users}');");

    $admin = self::$base->login->user_login($loginAdmin, $pwdAdmin, array('users'));

    $loginUser = 'a user';
    self::$base->login->user_add($admin['usr_token'], $loginUser, array('users'), null);
    $user = self::$base->login->user_info($admin['usr_token'], $loginUser);
    $this->assertEquals($user['usr_login'], $loginUser);
    $this->assertEquals($user['usr_rights'], array('users'));			      

    $res = self::$base->login->user_login($loginUser, $user['usr_temp_pwd'], array('users'));
    $this->assertGreaterThan(0, $res['usr_token']);
  }

  public function testUserSParticipantSet() {
    $loginAdmin = 'admin';
    $pwdAdmin = 'ksfdjgsfdyubg';    
    
    self::$base->execute_sql("insert into login.user (usr_login, usr_salt, usr_rights) values ('".$loginAdmin."', pgcrypto.crypt('".$pwdAdmin."', pgcrypto.gen_salt('bf', 8)), '{users, organization}');");

    $admin = self::$base->login->user_login($loginAdmin, $pwdAdmin, array('users', 'organization'));

    $loginUser = 'user';
    $parFirstname = 'Paul';
    $parLastname = 'Napoléon';
    self::$base->login->user_add($admin['usr_token'], $loginUser, null, null);
    $parId = self::$base->organ->participant_add($admin['usr_token'], $parFirstname, $parLastname);
    self::$base->login->user_participant_set($admin['usr_token'], $loginUser, $parId);
    $user = self::$base->login->user_info($admin['usr_token'], $loginUser);
    $this->assertEquals($user['par_id'], $parId);
  }

  public function testUserPortalSet() {
    $loginAdmin = 'admin';
    $pwdAdmin = 'ksfdjgsfdyubg';    
    
    self::$base->execute_sql("insert into login.user (usr_login, usr_salt, usr_rights) values ('".$loginAdmin."', pgcrypto.crypt('".$pwdAdmin."', pgcrypto.gen_salt('bf', 8)), '{users, organization,structure}');");

    $admin = self::$base->login->user_login($loginAdmin, $pwdAdmin, array('users', 'organization'));
    $token = $admin['usr_token'];
    $loginUser = 'user';
    self::$base->login->user_add($token, $loginUser, null, null);

    $porName1 = 'portal 1';
    $porName2 = 'portal 2';
    $porName3 = 'portal 3';
    $porId1 = self::$base->portal->portal_add($token, $porName1);
    $porId2 = self::$base->portal->portal_add($token, $porName2);
    $porId3 = self::$base->portal->portal_add($token, $porName3);
    $this->assertGreaterThan($porId1, $porId2);
    $this->assertGreaterThan($porId2, $porId3);

    self::$base->login->user_portal_set($token, $loginUser, array($porId2, $porId1));
    $porIds = self::$base->login->user_portal_list($token, $loginUser);
    $this->assertEquals(array (array('por_id'=>$porId1, 'por_name'=>$porName1), array('por_id'=>$porId2, 'por_name'=>$porName2)), $porIds);

    self::$base->login->user_portal_set($token, $loginUser, array($porId3, $porId1, $porId2));
    $porIds = self::$base->login->user_portal_list($token, $loginUser);
    $this->assertEquals(array (array('por_id'=>$porId1, 'por_name'=>$porName1), array('por_id'=>$porId2, 'por_name'=>$porName2), array('por_id'=>$porId3, 'por_name'=>$porName3)), $porIds);

    self::$base->login->user_portal_set($token, $loginUser, array($porId3, $porId1));
    $porIds = self::$base->login->user_portal_list($token, $loginUser);
    $this->assertEquals(array (array('por_id'=>$porId1, 'por_name'=>$porName1), array('por_id'=>$porId3, 'por_name'=>$porName3)), $porIds);

    self::$base->login->user_portal_set($token, $loginUser, array());
    $porIds = self::$base->login->user_portal_list($token, $loginUser);
    $this->assertEquals(null, $porIds);

    self::$base->login->user_portal_set($token, $loginUser, null);
    $porIds = self::$base->login->user_portal_list($token, $loginUser);
    $this->assertEquals(null, $porIds);
  }
}
?>
