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

  /**
   * Valid authentication 
   */
  public function testUserLoginOk() {
    $login = 'testdejfhcqcsdfkhn';
    $pwd = 'ksfdjgsfdyubg';    
    self::$base->startTransaction();
    self::$base->execute_sql("insert into login.user (usr_login, usr_salt, usr_right_structure, usr_right_config) values ('".$login."', pgcrypto.crypt('".$pwd."', pgcrypto.gen_salt('bf', 8)), true, false);");

    $res = self::$base->login->user_login($login, $pwd);
    $this->assertGreaterThan(0, $res['usr_token']);
    $this->assertFalse($res['usr_temp_pwd']);
    $this->assertTrue($res['usr_right_structure']);
    $this->assertFalse($res['usr_right_config']);
    self::$base->rollback();
  }
  
  /**
   * Login exception
   * @expectedException PgProcException
   */
  public function testUserLoginException() {
    $login = 'testdejfhcqcsdfkhn';
    $pwd = 'ksfdjgsfdyubg';    
    self::$base->startTransaction();
    self::$base->execute_sql("insert into login.user(usr_login, usr_salt, usr_right_structure, usr_right_config) values ('".$login."', pgcrypto.crypt('".$pwd."', pgcrypto.gen_salt('bf', 8)), true, false);");

    $res = self::$base->login->user_login($login, $pwd."X");
    self::$base->rollback();
  }

  /**
   * Login exception
   * @expectedException PgProcException
   */
  public function testUserLoginException2() {
    $login = '';
    $pwd = '';    
    self::$base->startTransaction();
    self::$base->execute_sql("insert into login.user(usr_login, usr_salt, usr_right_structure, usr_right_config) values ('".$login."', pgcrypto.crypt('".$pwd."', pgcrypto.gen_salt('bf', 8)), true, false);");

    $res = self::$base->login->user_login($login, $pwd);
    self::$base->rollback();
  }
}

?>
