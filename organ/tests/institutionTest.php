<?php
require_once '../../pgproc/php/pgprocedures.php';
require_once '../../config.inc.php';

class institutionTest extends PHPUnit_Framework_TestCase {
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
    self::$base->startTransaction();
    $login = 'testdejfhcqcsdfkhn';
    $pwd = 'ksfdjgsfdyubg';    
    self::$base->execute_sql("insert into login.user (usr_login, usr_salt, usr_rights) values ('".$login."', pgcrypto.crypt('".$pwd."', pgcrypto.gen_salt('bf', 8)), '{organization}');");
    $res = self::$base->login->user_login($login, $pwd, null);
    $this->token = $res['usr_token'];
  }

  protected function assertPostConditions()
  {
    self::$base->rollback();
  }

  public function testInstitutionAdd() {
    $name = 'an institution';
    $id = self::$base->organ->institution_add($this->token, $name);
    $this->assertGreaterThan(0, $id);
  }  

  public function testInstitutionGet() {
    $name = 'an institution';
    $id = self::$base->organ->institution_add($this->token, $name);
    $this->assertGreaterThan(0, $id);
    $ins = self::$base->organ->institution_get($this->token, $id);
    $this->assertEquals($name, $ins['ins_name']);
    $this->assertEquals(array(), $ins['ins_topics']);
  }  
  
  /**
   * Add two portals with same name
   * @expectedException PgProcException
   */  
  public function testInstitutionAddSameName() {
    $name = 'an institution';
    $id = self::$base->organ->institution_add($this->token, $name);
    $this->assertGreaterThan(0, $id);
    $id = self::$base->organ->institution_add($this->token, $name);
  }  

  public function testInstitutionList() {
    $name = 'an institution';
    $id = self::$base->organ->institution_add($this->token, $name);
    $inss = self::$base->organ->institution_list($this->token);
    $this->assertGreaterThan(0, count($inss));
    $found = false;
    foreach ($inss as $ins) {
      if ($name == $ins['ins_name']) {
	$found = true;
	break;
      }
    }
    $this->assertTrue($found);
  }

  public function testInstitutionRename() {
    $name1 = 'an institution';
    $name2 = 'another institution';
    $id = self::$base->organ->institution_add($this->token, $name1);
    self::$base->organ->institution_rename($this->token, $id, $name2);
    $inss = self::$base->organ->institution_list($this->token);
    $this->assertGreaterThan(0, count($inss));
    $ins = $inss[0];
    $found = false;
    foreach ($inss as $ins) {
      if ($name2 == $ins['ins_name']) {
	$found = true;
	break;
      }
    }
    $this->assertTrue($found);
  }

  /**
   * Trying to rename an inexistant portal raises an exception
   * @expectedException PgProcException
   */
  public function testPortalRenameUnknown() {
    $name1 = 'a portal';
    $name2 = 'another portal';
    $id = self::$base->organ->institution_add($this->token, $name1);
    self::$base->organ->institution_rename($this->token, $id+1, $name2);
  }

  public function testInstitutionDelete() {
    $name = 'an institution';
    $id = self::$base->organ->institution_add($this->token, $name);
    $inss = self::$base->organ->institution_list($this->token);
    $nAfterAdd = count($inss);
    $this->assertGreaterThan(0, count($inss));
    self::$base->organ->institution_delete($this->token, $id);
    $inss = self::$base->organ->institution_list($this->token);
    $this->assertEquals($nAfterAdd-1, count($inss));
  }

  /**
   * Trying to delete an inexistant portal raises an exception
   * @expectedException PgProcException
   */
  public function testInstitutionDeleteUnknown() {
    $name = 'an institution';
    $id = self::$base->organ->institution_add($this->token, $name);
    self::$base->organ->institution_delete($this->token, $id+1);
  }

  /**
   * Trying to delete a portal with null value as por_id raises an exception
   * @expectedException PgProcException
   */
  public function testInstitutionDeleteNull() {
    $name = 'an institution';
    $id = self::$base->organ->institution_add($this->token, $name);
    self::$base->organ->institution_delete($this->token, null);
  }

  public function testInstitutionSetTopics() {
    $name = 'an institution';
    $id = self::$base->organ->institution_add($this->token, $name);
    $this->assertGreaterThan(0, $id);

    $topics = array('social', 'education');
    self::$base->organ->institution_set_topics($this->token, $id, $topics);
    $ins = self::$base->organ->institution_get($this->token, $id);
    $this->assertEquals($topics, $ins['ins_topics']);
  }
}
