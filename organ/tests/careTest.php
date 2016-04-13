<?php
require_once '../../pgproc/php/pgprocedures.php';
require_once '../../config.inc.php';

class careTest extends PHPUnit_Framework_TestCase {
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

  public function testCareAdd() {
    $name = 'an institution';
    $id = self::$base->organ->institution_add($this->token, $name);
    $this->assertGreaterThan(0, $id);

    $car_name = 'a care';
    $carId = self::$base->organ->care_add($this->token, $id, $car_name);
    $this->assertGreaterThan(0, $carId);
  }  

  public function testCareGet() {
    $name = 'an institution';
    $id = self::$base->organ->institution_add($this->token, $name);
    $this->assertGreaterThan(0, $id);

    $car_name = 'a care';
    $carId = self::$base->organ->care_add($this->token, $id, $car_name);
    $this->assertGreaterThan(0, $carId);
    $car = self::$base->organ->care_get($this->token, $carId);
    $this->assertEquals($id, $car['ins_id']);
    $this->assertEquals($car_name, $car['car_name']);
    $this->assertEquals(array(), $car['car_topics']);
  }  
  
  public function testCareAddSameNameDifferentInstitutions() {
    $name1 = 'institution 1';
    $insId1 = self::$base->organ->institution_add($this->token, $name1);
    $name2 = 'institution 2';
    $insId2 = self::$base->organ->institution_add($this->token, $name2);

    $carName = 'a same care';
    $carId1 = self::$base->organ->care_add($this->token, $insId1, $carName);
    $carId2 = self::$base->organ->care_add($this->token, $insId2, $carName);
    $this->assertGreaterThan(0, $carId1);
    $this->assertGreaterThan(0, $carId2);
  }  

  /**
   * Add two portals with same name
   * @expectedException PgProcException
   */  
  public function testCareAddSameNameSameInstitution() {
    $name = 'institution';
    $insId = self::$base->organ->institution_add($this->token, $name);

    $carName = 'a same care';
    $carId1 = self::$base->organ->care_add($this->token, $insId, $carName);
    $carId2 = self::$base->organ->care_add($this->token, $insId, $carName);
    $this->assertGreaterThan(0, $carId1);
    $this->assertGreaterThan(0, $carId2);
  }  

  public function testCareList() {
    $name = 'an institution';
    $id = self::$base->organ->institution_add($this->token, $name);

    $car_name = 'a care';
    $carId = self::$base->organ->care_add($this->token, $id, $car_name);
    $this->assertGreaterThan(0, $carId);
    
    $cars = self::$base->organ->care_list($this->token, $id);
    $this->assertEquals(1, count($cars));
  }
  
  public function testCareRename() {
    $name = 'an institution';
    $id = self::$base->organ->institution_add($this->token, $name);

    $car_name1 = 'a care';
    $car_name2 = 'another care';
    $carId = self::$base->organ->care_add($this->token, $id, $car_name1);
    self::$base->organ->care_rename($this->token, $carId, $car_name2);
    $car = self::$base->organ->care_get($this->token, $carId);
    $this->assertEquals($car_name2, $car['car_name']);
  }

  /**
   * Trying to rename an inexistant portal raises an exception
   * @expectedException PgProcException
   */
  public function testCareRenameUnknown() {
    $name = 'an institution';
    $id = self::$base->organ->institution_add($this->token, $name);

    $car_name1 = 'a care';
    $car_name2 = 'another care';
    $carId = self::$base->organ->care_add($this->token, $id, $car_name1);
    self::$base->organ->care_rename($this->token, $carId+1, $car_name2);
  }
  
  public function testCareDelete() {
    $name = 'an institution';
    $id = self::$base->organ->institution_add($this->token, $name);

    $car_name = 'a care';
    $carId = self::$base->organ->care_add($this->token, $id, $car_name);

    $cars = self::$base->organ->care_list($this->token, $id);
    $nAfterAdd = count($cars);
    $this->assertGreaterThan(0, count($cars));

    self::$base->organ->care_delete($this->token, $carId);
    $cars = self::$base->organ->care_list($this->token, $id);
    $this->assertEquals($nAfterAdd-1, count($cars));
  }
  
  /**
   * Trying to delete an inexistant portal raises an exception
   * @expectedException PgProcException
   */
  public function testCareDeleteUnknown() {
    $name = 'an institution';
    $id = self::$base->organ->institution_add($this->token, $name);

    $car_name = 'a care';
    $carId = self::$base->organ->care_add($this->token, $id, $car_name);
    self::$base->organ->care_delete($this->token, $carId+1);
  }

  /**
   * Trying to delete a portal with null value as por_id raises an exception
   * @expectedException PgProcException
   */
  public function testCareDeleteNull() {
    self::$base->organ->care_delete($this->token, null);
  }
  
  public function testCareSetTopics() {
    $name = 'an institution';
    $id = self::$base->organ->institution_add($this->token, $name);
    $this->assertGreaterThan(0, $id);

    $car_name = 'a care';
    $carId = self::$base->organ->care_add($this->token, $id, $car_name);
    $this->assertGreaterThan(0, $carId);
    
    $topics = array('social', 'education');
    self::$base->organ->care_set_topics($this->token, $carId, $topics);
    $car = self::$base->organ->care_get($this->token, $carId);
    $this->assertEquals($topics, $car['car_topics']);
  }
}
