<?php
require_once '../../pgproc/php/pgprocedures.php';
require_once '../../config.inc.php';

class careGroupTest extends PHPUnit_Framework_TestCase {
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

  public function testCareGroupAdd() {
    $name = 'an institution';
    $id = self::$base->organ->institution_add($this->token, $name);
    $this->assertGreaterThan(0, $id);

    $car_name = 'a care';
    $carId = self::$base->organ->care_add($this->token, $id, $car_name);
    $this->assertGreaterThan(0, $carId);

    $cgr_name = 'a group';
    $cgrId = self::$base->organ->care_group_add($this->token, $carId, $cgr_name);
    $this->assertGreaterThan(0, $cgrId);
    
  }  

  public function testCareGroupGet() {
    $name = 'an institution';
    $id = self::$base->organ->institution_add($this->token, $name);
    $this->assertGreaterThan(0, $id);

    $car_name = 'a care';
    $carId = self::$base->organ->care_add($this->token, $id, $car_name);
    $this->assertGreaterThan(0, $carId);

    $cgr_name = 'a group';
    $cgrId = self::$base->organ->care_group_add($this->token, $carId, $cgr_name);
    $this->assertGreaterThan(0, $cgrId);

    $cgr = self::$base->organ->care_group_get($this->token, $cgrId);
    $this->assertEquals($carId, $cgr['car_id']);
    $this->assertEquals($cgr_name, $cgr['cgr_name']);
    $this->assertNull($cgr['cgr_start_date']);
    $this->assertNull($cgr['cgr_end_date']);
    $this->assertEquals('', $cgr['cgr_notes']);
  }  

  public function testCareGroupAddSameNameDifferentCare() {
    $name = 'institution';
    $insId = self::$base->organ->institution_add($this->token, $name);

    $carName1 = 'care 1';
    $carName2 = 'care 2';
    $carId1 = self::$base->organ->care_add($this->token, $insId, $carName1);
    $carId2 = self::$base->organ->care_add($this->token, $insId, $carName2);
    $this->assertGreaterThan(0, $carId1);
    $this->assertGreaterThan(0, $carId2);

    $cgrName = 'a same group name';
    $cgrId1 = self::$base->organ->care_group_add($this->token, $carId1, $cgrName);
    $cgrId2 = self::$base->organ->care_group_add($this->token, $carId2, $cgrName);
  }  

  /**
   * Add two portals with same name
   * @expectedException PgProcException
   */  
  public function testCareAddSameNameSameCare() {
    $name = 'institution';
    $insId = self::$base->organ->institution_add($this->token, $name);

    $carName = 'a same care';
    $carId = self::$base->organ->care_add($this->token, $insId, $carName);
    
    $cgrName = 'a same care group';
    $cgrId1 = self::$base->organ->care_group_add($this->token, $carId, $carName);
    $cgrId2 = self::$base->organ->care_group_add($this->token, $carId, $carName);
    $this->assertGreaterThan(0, $cgrId1);
    $this->assertGreaterThan(0, $cgrId2);
  } 

  public function testCareGroupSet() {
    $name = 'institution';
    $insId = self::$base->organ->institution_add($this->token, $name);
    
    $carName = 'a care';
    $carId = self::$base->organ->care_add($this->token, $insId, $carName);
    
    $cgrName = 'a care group';
    $cgrId = self::$base->organ->care_group_add($this->token, $carId, $carName);
    $this->assertGreaterThan(0, $cgrId);
    
    $cgrStartDate = '01/01/2015';
    $cgrEndDate = '01/01/2017';
    $cgrNotes = 'a note';
    self::$base->organ->care_group_set($this->token, $cgrId, $cgrStartDate, $cgrEndDate, $cgrNotes);
    $cgr = self::$base->organ->care_group_get($this->token, $cgrId);
    $this->assertEquals($cgrStartDate, $cgr['cgr_start_date']);
    $this->assertEquals($cgrEndDate, $cgr['cgr_end_date']);
    $this->assertEquals($cgrNotes, $cgr['cgr_notes']);
  }

  public function testCareGroupSetInfinityDates() {
    $name = 'institution';
    $insId = self::$base->organ->institution_add($this->token, $name);
    
    $carName = 'a care';
    $carId = self::$base->organ->care_add($this->token, $insId, $carName);
    
    $cgrName = 'a care group';
    $cgrId = self::$base->organ->care_group_add($this->token, $carId, $carName);
    $this->assertGreaterThan(0, $cgrId);
    
    $cgrStartDate = NULL;
    $cgrEndDate = NULL;
    $cgrNotes = 'a note';
    self::$base->organ->care_group_set($this->token, $cgrId, $cgrStartDate, $cgrEndDate, $cgrNotes);
    $cgr = self::$base->organ->care_group_get($this->token, $cgrId);
    $this->assertEquals($cgrStartDate, $cgr['cgr_start_date']);
    $this->assertEquals($cgrEndDate, $cgr['cgr_end_date']);
    $this->assertEquals($cgrNotes, $cgr['cgr_notes']);
  }
  
  public function testCareGroupList() {
    $name = 'an institution';
    $id = self::$base->organ->institution_add($this->token, $name);

    $car_name = 'a care';
    $carId = self::$base->organ->care_add($this->token, $id, $car_name);
    $this->assertGreaterThan(0, $carId);
    
    $cgr_name1 = 'care group 1';
    $cgrId1 = self::$base->organ->care_group_add($this->token, $carId, $cgr_name1);
    $this->assertGreaterThan(0, $cgrId1);
    
    $cgr_name2 = 'care group 2';
    $cgrId2 = self::$base->organ->care_group_add($this->token, $carId, $cgr_name2);
    $this->assertGreaterThan(0, $cgrId2);
    
    $cgrs = self::$base->organ->care_group_list($this->token, $carId, '2015-01-01');
    $this->assertEquals(2, count($cgrs));

    $cgrs = self::$base->organ->care_group_list($this->token, $carId, NULL);
    $this->assertEquals(2, count($cgrs));
  }

  public function testCareGroupListWithDate() {
    $name = 'an institution';
    $id = self::$base->organ->institution_add($this->token, $name);

    $car_name = 'a care';
    $carId = self::$base->organ->care_add($this->token, $id, $car_name);
    $this->assertGreaterThan(0, $carId);
    
    $cgr_name1 = 'care group 1';
    $cgrId1 = self::$base->organ->care_group_add($this->token, $carId, $cgr_name1);
    $this->assertGreaterThan(0, $cgrId1);
    self::$base->organ->care_group_set($this->token, $cgrId1, NULL, '31/12/2014', 'end 2014');
    
    $cgr_name2 = 'care group 2';
    $cgrId2 = self::$base->organ->care_group_add($this->token, $carId, $cgr_name2);
    $this->assertGreaterThan(0, $cgrId2);
    self::$base->organ->care_group_set($this->token, $cgrId2, '01/01/2015', NULL, 'start 2015');
    
    $cgrs = self::$base->organ->care_group_list($this->token, $carId, '01/01/2015');
    $this->assertEquals(1, count($cgrs));
    $cgr = $cgrs[0];
    $this->assertEquals($cgr_name2, $cgr['cgr_name']);

    $cgrs = self::$base->organ->care_group_list($this->token, $carId, '31/12/2014');
    $this->assertEquals(1, count($cgrs));
    $cgr = $cgrs[0];
    $this->assertEquals($cgr_name1, $cgr['cgr_name']);
  }

  public function testCareGroupListWithDates() {
    $name = 'an institution';
    $id = self::$base->organ->institution_add($this->token, $name);

    $car_name = 'a care';
    $carId = self::$base->organ->care_add($this->token, $id, $car_name);
    $this->assertGreaterThan(0, $carId);
    
    $cgr_name1 = 'care group 1';
    $cgrId1 = self::$base->organ->care_group_add($this->token, $carId, $cgr_name1);
    $this->assertGreaterThan(0, $cgrId1);
    self::$base->organ->care_group_set($this->token, $cgrId1, '01/01/2014', '31/12/2014', 'all 2014');
    
    $cgr_name2 = 'care group 2';
    $cgrId2 = self::$base->organ->care_group_add($this->token, $carId, $cgr_name2);
    $this->assertGreaterThan(0, $cgrId2);
    self::$base->organ->care_group_set($this->token, $cgrId2, '01/01/2015', '31/12/2015', 'all 2015');
    
    $cgrs = self::$base->organ->care_group_list($this->token, $carId, '01/01/2015');
    $this->assertEquals(1, count($cgrs));
    $cgr = $cgrs[0];
    $this->assertEquals($cgr_name2, $cgr['cgr_name']);

    $cgrs = self::$base->organ->care_group_list($this->token, $carId, '31/12/2015');
    $this->assertEquals(1, count($cgrs));
    $cgr = $cgrs[0];
    $this->assertEquals($cgr_name2, $cgr['cgr_name']);

    $cgrs = self::$base->organ->care_group_list($this->token, $carId, '01/01/2016');
    $this->assertEquals(0, count($cgrs));
    
    $cgrs = self::$base->organ->care_group_list($this->token, $carId, '31/12/2013');
    $this->assertEquals(0, count($cgrs));
  }

  public function testCareGroupDelete() {
    $name = 'an institution';
    $id = self::$base->organ->institution_add($this->token, $name);

    $car_name = 'a care';
    $carId = self::$base->organ->care_add($this->token, $id, $car_name);

    $cgr_name = 'a care group';
    $cgrId = self::$base->organ->care_group_add($this->token, $carId, $cgr_name);

    $cgrs = self::$base->organ->care_group_list($this->token, $carId, NULL);
    $this->assertEquals(1, count($cgrs));
    
    self::$base->organ->care_group_delete($this->token, $cgrId);
    $cgrsAfter = self::$base->organ->care_group_list($this->token, $carId, NULL);
    $this->assertEquals(0, count($cgrsAfter));
  }

  public function testCareGroupRename() {
    $name = 'an institution';
    $id = self::$base->organ->institution_add($this->token, $name);

    $car_name = 'a care';
    $carId = self::$base->organ->care_add($this->token, $id, $car_name);

    $cgr_name1 = 'a care group';
    $cgr_name2 = 'another care group';
    $cgrId = self::$base->organ->care_group_add($this->token, $carId, $cgr_name1);
    self::$base->organ->care_group_rename($this->token, $cgrId, $cgr_name2);
    $cgr = self::$base->organ->care_group_get($this->token, $cgrId);
    $this->assertEquals($cgr_name2, $cgr['cgr_name']);
  }

  /**
   * Trying to rename an inexistant portal raises an exception
   * @expectedException PgProcException
   */
  public function testCareGroupRenameUnknown() {
    $name = 'an institution';
    $id = self::$base->organ->institution_add($this->token, $name);

    $car_name = 'a care';
    $carId = self::$base->organ->care_add($this->token, $id, $car_name);

    $cgr_name1 = 'a care group';
    $cgr_name2 = 'another care group';
    $cgrId = self::$base->organ->care_group_add($this->token, $carId, $cgr_name1);
    self::$base->organ->care_group_rename($this->token, $cgrId+1, $cgr_name2);
  }
   
  /**
   * Trying to delete an inexistant portal raises an exception
   * @expectedException PgProcException
   */
  public function testCareGroupDeleteUnknown() {
    $name = 'an institution';
    $id = self::$base->organ->institution_add($this->token, $name);

    $car_name = 'a care';
    $carId = self::$base->organ->care_add($this->token, $id, $car_name);

    $cgr_name = 'a care group';
    $cgrId = self::$base->organ->care_group_add($this->token, $carId, $cgr_name);

    self::$base->organ->care_group_delete($this->token, $cgrId+1);
  }
  
  /**
   * Trying to delete a portal with null value as por_id raises an exception
   * @expectedException PgProcException
   */
  public function testCareDeleteNull() {
    self::$base->organ->care_group_delete($this->token, null);
  }
}
