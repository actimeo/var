<?php
require_once '../../pgproc/php/pgprocedures.php';
require_once '../../config.inc.php';

class serviceGroupTest extends PHPUnit_Framework_TestCase {
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

  public function testServiceGroupAdd() {
    $name = 'an institution';
    $id = self::$base->organ->institution_add($this->token, $name);
    $this->assertGreaterThan(0, $id);

    $ser_name = 'a service';
    $serId = self::$base->organ->service_add($this->token, $id, $ser_name);
    $this->assertGreaterThan(0, $serId);

    $sgr_name = 'a group';
    $sgrId = self::$base->organ->service_group_add($this->token, $serId, $sgr_name);
    $this->assertGreaterThan(0, $sgrId);
    
  }  

  public function testServiceGroupGet() {
    $name = 'an institution';
    $id = self::$base->organ->institution_add($this->token, $name);
    $this->assertGreaterThan(0, $id);

    $ser_name = 'a service';
    $serId = self::$base->organ->service_add($this->token, $id, $ser_name);
    $this->assertGreaterThan(0, $serId);

    $sgr_name = 'a group';
    $sgrId = self::$base->organ->service_group_add($this->token, $serId, $sgr_name);
    $this->assertGreaterThan(0, $sgrId);

    $cgr = self::$base->organ->service_group_get($this->token, $sgrId);
    $this->assertEquals($serId, $cgr['ser_id']);
    $this->assertEquals($sgr_name, $cgr['sgr_name']);
    $this->assertNull($cgr['sgr_start_date']);
    $this->assertNull($cgr['sgr_end_date']);
    $this->assertEquals('', $cgr['sgr_notes']);
  }  

  public function testServiceGroupAddSameNameDifferentService() {
    $name = 'institution';
    $insId = self::$base->organ->institution_add($this->token, $name);

    $carName1 = 'service 1';
    $carName2 = 'service 2';
    $serId1 = self::$base->organ->service_add($this->token, $insId, $carName1);
    $serId2 = self::$base->organ->service_add($this->token, $insId, $carName2);
    $this->assertGreaterThan(0, $serId1);
    $this->assertGreaterThan(0, $serId2);

    $cgrName = 'a same group name';
    $sgrId1 = self::$base->organ->service_group_add($this->token, $serId1, $cgrName);
    $sgrId2 = self::$base->organ->service_group_add($this->token, $serId2, $cgrName);
  }  

  /**
   * Add two portals with same name
   * @expectedException PgProcException
   */  
  public function testServiceAddSameNameSameService() {
    $name = 'institution';
    $insId = self::$base->organ->institution_add($this->token, $name);

    $carName = 'a same service';
    $serId = self::$base->organ->service_add($this->token, $insId, $carName);
    
    $cgrName = 'a same service group';
    $sgrId1 = self::$base->organ->service_group_add($this->token, $serId, $carName);
    $sgrId2 = self::$base->organ->service_group_add($this->token, $serId, $carName);
    $this->assertGreaterThan(0, $sgrId1);
    $this->assertGreaterThan(0, $sgrId2);
  } 

  public function testServiceGroupSet() {
    $name = 'institution';
    $insId = self::$base->organ->institution_add($this->token, $name);
    
    $carName = 'a service';
    $serId = self::$base->organ->service_add($this->token, $insId, $carName);
    
    $cgrName = 'a service group';
    $sgrId = self::$base->organ->service_group_add($this->token, $serId, $carName);
    $this->assertGreaterThan(0, $sgrId);
    
    $cgrStartDate = '01/01/2015';
    $cgrEndDate = '01/01/2017';
    $cgrNotes = 'a note';
    self::$base->organ->service_group_set($this->token, $sgrId, $cgrStartDate, $cgrEndDate, $cgrNotes);
    $cgr = self::$base->organ->service_group_get($this->token, $sgrId);
    $this->assertEquals($cgrStartDate, $cgr['sgr_start_date']);
    $this->assertEquals($cgrEndDate, $cgr['sgr_end_date']);
    $this->assertEquals($cgrNotes, $cgr['sgr_notes']);
  }

  public function testServiceGroupSetInfinityDates() {
    $name = 'institution';
    $insId = self::$base->organ->institution_add($this->token, $name);
    
    $carName = 'a service';
    $serId = self::$base->organ->service_add($this->token, $insId, $carName);
    
    $cgrName = 'a service group';
    $sgrId = self::$base->organ->service_group_add($this->token, $serId, $carName);
    $this->assertGreaterThan(0, $sgrId);
    
    $cgrStartDate = NULL;
    $cgrEndDate = NULL;
    $cgrNotes = 'a note';
    self::$base->organ->service_group_set($this->token, $sgrId, $cgrStartDate, $cgrEndDate, $cgrNotes);
    $cgr = self::$base->organ->service_group_get($this->token, $sgrId);
    $this->assertEquals($cgrStartDate, $cgr['sgr_start_date']);
    $this->assertEquals($cgrEndDate, $cgr['sgr_end_date']);
    $this->assertEquals($cgrNotes, $cgr['sgr_notes']);
  }
  
  public function testServiceGroupList() {
    $name = 'an institution';
    $id = self::$base->organ->institution_add($this->token, $name);

    $ser_name = 'a service';
    $serId = self::$base->organ->service_add($this->token, $id, $ser_name);
    $this->assertGreaterThan(0, $serId);
    
    $sgr_name1 = 'service group 1';
    $sgrId1 = self::$base->organ->service_group_add($this->token, $serId, $sgr_name1);
    $this->assertGreaterThan(0, $sgrId1);
    
    $sgr_name2 = 'service group 2';
    $sgrId2 = self::$base->organ->service_group_add($this->token, $serId, $sgr_name2);
    $this->assertGreaterThan(0, $sgrId2);
    
    $cgrs = self::$base->organ->service_group_list($this->token, $serId, '2015-01-01');
    $this->assertEquals(2, count($cgrs));

    $cgrs = self::$base->organ->service_group_list($this->token, $serId, NULL);
    $this->assertEquals(2, count($cgrs));
  }

  public function testServiceGroupListWithDate() {
    $name = 'an institution';
    $id = self::$base->organ->institution_add($this->token, $name);

    $ser_name = 'a service';
    $serId = self::$base->organ->service_add($this->token, $id, $ser_name);
    $this->assertGreaterThan(0, $serId);
    
    $sgr_name1 = 'service group 1';
    $sgrId1 = self::$base->organ->service_group_add($this->token, $serId, $sgr_name1);
    $this->assertGreaterThan(0, $sgrId1);
    self::$base->organ->service_group_set($this->token, $sgrId1, NULL, '31/12/2014', 'end 2014');
    
    $sgr_name2 = 'service group 2';
    $sgrId2 = self::$base->organ->service_group_add($this->token, $serId, $sgr_name2);
    $this->assertGreaterThan(0, $sgrId2);
    self::$base->organ->service_group_set($this->token, $sgrId2, '01/01/2015', NULL, 'start 2015');
    
    $cgrs = self::$base->organ->service_group_list($this->token, $serId, '01/01/2015');
    $this->assertEquals(1, count($cgrs));
    $cgr = $cgrs[0];
    $this->assertEquals($sgr_name2, $cgr['sgr_name']);

    $cgrs = self::$base->organ->service_group_list($this->token, $serId, '31/12/2014');
    $this->assertEquals(1, count($cgrs));
    $cgr = $cgrs[0];
    $this->assertEquals($sgr_name1, $cgr['sgr_name']);
  }

  public function testServiceGroupListWithDates() {
    $name = 'an institution';
    $id = self::$base->organ->institution_add($this->token, $name);

    $ser_name = 'a service';
    $serId = self::$base->organ->service_add($this->token, $id, $ser_name);
    $this->assertGreaterThan(0, $serId);
    
    $sgr_name1 = 'service group 1';
    $sgrId1 = self::$base->organ->service_group_add($this->token, $serId, $sgr_name1);
    $this->assertGreaterThan(0, $sgrId1);
    self::$base->organ->service_group_set($this->token, $sgrId1, '01/01/2014', '31/12/2014', 'all 2014');
    
    $sgr_name2 = 'service group 2';
    $sgrId2 = self::$base->organ->service_group_add($this->token, $serId, $sgr_name2);
    $this->assertGreaterThan(0, $sgrId2);
    self::$base->organ->service_group_set($this->token, $sgrId2, '01/01/2015', '31/12/2015', 'all 2015');
    
    $cgrs = self::$base->organ->service_group_list($this->token, $serId, '01/01/2015');
    $this->assertEquals(1, count($cgrs));
    $cgr = $cgrs[0];
    $this->assertEquals($sgr_name2, $cgr['sgr_name']);

    $cgrs = self::$base->organ->service_group_list($this->token, $serId, '31/12/2015');
    $this->assertEquals(1, count($cgrs));
    $cgr = $cgrs[0];
    $this->assertEquals($sgr_name2, $cgr['sgr_name']);

    $cgrs = self::$base->organ->service_group_list($this->token, $serId, '01/01/2016');
    $this->assertEquals(0, count($cgrs));
    
    $cgrs = self::$base->organ->service_group_list($this->token, $serId, '31/12/2013');
    $this->assertEquals(0, count($cgrs));
  }

  public function testServiceGroupDelete() {
    $name = 'an institution';
    $id = self::$base->organ->institution_add($this->token, $name);

    $ser_name = 'a service';
    $serId = self::$base->organ->service_add($this->token, $id, $ser_name);

    $sgr_name = 'a service group';
    $sgrId = self::$base->organ->service_group_add($this->token, $serId, $sgr_name);

    $cgrs = self::$base->organ->service_group_list($this->token, $serId, NULL);
    $this->assertEquals(1, count($cgrs));
    
    self::$base->organ->service_group_delete($this->token, $sgrId);
    $cgrsAfter = self::$base->organ->service_group_list($this->token, $serId, NULL);
    $this->assertEquals(0, count($cgrsAfter));
  }

  public function testServiceGroupRename() {
    $name = 'an institution';
    $id = self::$base->organ->institution_add($this->token, $name);

    $ser_name = 'a service';
    $serId = self::$base->organ->service_add($this->token, $id, $ser_name);

    $sgr_name1 = 'a service group';
    $sgr_name2 = 'another service group';
    $sgrId = self::$base->organ->service_group_add($this->token, $serId, $sgr_name1);
    self::$base->organ->service_group_rename($this->token, $sgrId, $sgr_name2);
    $cgr = self::$base->organ->service_group_get($this->token, $sgrId);
    $this->assertEquals($sgr_name2, $cgr['sgr_name']);
  }

  /**
   * Trying to rename an inexistant portal raises an exception
   * @expectedException PgProcException
   */
  public function testServiceGroupRenameUnknown() {
    $name = 'an institution';
    $id = self::$base->organ->institution_add($this->token, $name);

    $ser_name = 'a service';
    $serId = self::$base->organ->service_add($this->token, $id, $ser_name);

    $sgr_name1 = 'a service group';
    $sgr_name2 = 'another service group';
    $sgrId = self::$base->organ->service_group_add($this->token, $serId, $sgr_name1);
    self::$base->organ->service_group_rename($this->token, $sgrId+1, $sgr_name2);
  }
   
  /**
   * Trying to delete an inexistant portal raises an exception
   * @expectedException PgProcException
   */
  public function testServiceGroupDeleteUnknown() {
    $name = 'an institution';
    $id = self::$base->organ->institution_add($this->token, $name);

    $ser_name = 'a service';
    $serId = self::$base->organ->service_add($this->token, $id, $ser_name);

    $sgr_name = 'a service group';
    $sgrId = self::$base->organ->service_group_add($this->token, $serId, $sgr_name);

    self::$base->organ->service_group_delete($this->token, $sgrId+1);
  }
  
  /**
   * Trying to delete a portal with null value as por_id raises an exception
   * @expectedException PgProcException
   */
  public function testServiceDeleteNull() {
    self::$base->organ->service_group_delete($this->token, null);
  }
}
