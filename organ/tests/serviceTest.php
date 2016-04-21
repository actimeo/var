<?php
require_once '../../pgproc/php/pgprocedures.php';
require_once '../../config.inc.php';

class serviceTest extends PHPUnit_Framework_TestCase {
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

  public function testServiceAdd() {
    $name = 'an institution';
    $id = self::$base->organ->institution_add($this->token, $name);
    $this->assertGreaterThan(0, $id);

    $ser_name = 'a service';
    $serId = self::$base->organ->service_add($this->token, $id, $ser_name);
    $this->assertGreaterThan(0, $serId);
  }  

  public function testServiceGet() {
    $name = 'an institution';
    $id = self::$base->organ->institution_add($this->token, $name);
    $this->assertGreaterThan(0, $id);

    $ser_name = 'a service';
    $serId = self::$base->organ->service_add($this->token, $id, $ser_name);
    $this->assertGreaterThan(0, $serId);
    $car = self::$base->organ->service_get($this->token, $serId);
    $this->assertEquals($id, $car['ins_id']);
    $this->assertEquals($ser_name, $car['ser_name']);
    $this->assertEquals(array(), $car['ser_topics']);
  }  
  
  public function testServiceAddSameNameDifferentInstitutions() {
    $name1 = 'institution 1';
    $insId1 = self::$base->organ->institution_add($this->token, $name1);
    $name2 = 'institution 2';
    $insId2 = self::$base->organ->institution_add($this->token, $name2);

    $carName = 'a same service';
    $serId1 = self::$base->organ->service_add($this->token, $insId1, $carName);
    $serId2 = self::$base->organ->service_add($this->token, $insId2, $carName);
    $this->assertGreaterThan(0, $serId1);
    $this->assertGreaterThan(0, $serId2);
  }  

  /**
   * Add two portals with same name
   * @expectedException PgProcException
   */  
  public function testServiceAddSameNameSameInstitution() {
    $name = 'institution';
    $insId = self::$base->organ->institution_add($this->token, $name);

    $carName = 'a same service';
    $serId1 = self::$base->organ->service_add($this->token, $insId, $carName);
    $serId2 = self::$base->organ->service_add($this->token, $insId, $carName);
    $this->assertGreaterThan(0, $serId1);
    $this->assertGreaterThan(0, $serId2);
  }  

  public function testServiceList() {
    $name = 'an institution';
    $id = self::$base->organ->institution_add($this->token, $name);

    $ser_name = 'a service';
    $serId = self::$base->organ->service_add($this->token, $id, $ser_name);
    $this->assertGreaterThan(0, $serId);
    
    $cars = self::$base->organ->service_list($this->token, $id);
    $this->assertEquals(1, count($cars));
  }
  
  public function testServiceRename() {
    $name = 'an institution';
    $id = self::$base->organ->institution_add($this->token, $name);

    $ser_name1 = 'a service';
    $ser_name2 = 'another service';
    $serId = self::$base->organ->service_add($this->token, $id, $ser_name1);
    self::$base->organ->service_rename($this->token, $serId, $ser_name2);
    $car = self::$base->organ->service_get($this->token, $serId);
    $this->assertEquals($ser_name2, $car['ser_name']);
  }

  /**
   * Trying to rename an inexistant portal raises an exception
   * @expectedException PgProcException
   */
  public function testServiceRenameUnknown() {
    $name = 'an institution';
    $id = self::$base->organ->institution_add($this->token, $name);

    $ser_name1 = 'a service';
    $ser_name2 = 'another service';
    $serId = self::$base->organ->service_add($this->token, $id, $ser_name1);
    self::$base->organ->service_rename($this->token, $serId+1, $ser_name2);
  }
  
  public function testServiceDelete() {
    $name = 'an institution';
    $id = self::$base->organ->institution_add($this->token, $name);

    $ser_name = 'a service';
    $serId = self::$base->organ->service_add($this->token, $id, $ser_name);

    $cars = self::$base->organ->service_list($this->token, $id);
    $nAfterAdd = count($cars);
    $this->assertGreaterThan(0, count($cars));

    self::$base->organ->service_delete($this->token, $serId);
    $cars = self::$base->organ->service_list($this->token, $id);
    $this->assertEquals($nAfterAdd-1, count($cars));
  }
  
  /**
   * Trying to delete an inexistant portal raises an exception
   * @expectedException PgProcException
   */
  public function testServiceDeleteUnknown() {
    $name = 'an institution';
    $id = self::$base->organ->institution_add($this->token, $name);

    $ser_name = 'a service';
    $serId = self::$base->organ->service_add($this->token, $id, $ser_name);
    self::$base->organ->service_delete($this->token, $serId+1);
  }

  /**
   * Trying to delete a portal with null value as por_id raises an exception
   * @expectedException PgProcException
   */
  public function testServiceDeleteNull() {
    self::$base->organ->service_delete($this->token, null);
  }
  
  public function testServiceSetTopics() {
    $name = 'an institution';
    $id = self::$base->organ->institution_add($this->token, $name);
    $this->assertGreaterThan(0, $id);

    $ser_name = 'a service';
    $serId = self::$base->organ->service_add($this->token, $id, $ser_name);
    $this->assertGreaterThan(0, $serId);
    
    $topics = array('social', 'education');
    self::$base->organ->service_set_topics($this->token, $serId, $topics);
    $car = self::$base->organ->service_get($this->token, $serId);
    $this->assertEquals($topics, $car['ser_topics']);
  }
}
