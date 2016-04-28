<?php
require_once '../../pgproc/php/pgprocedures.php';
require_once '../../config.inc.php';

class staffGroupAssignmentTest extends PHPUnit_Framework_TestCase {
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
    self::$base->execute_sql("insert into login.user (usr_login, usr_salt, usr_rights) values ('".$login."', pgcrypto.crypt('".$pwd."', pgcrypto.gen_salt('bf', 8)), '{organization,users}');");
    $res = self::$base->login->user_login($login, $pwd, null);
    $this->token = $res['usr_token'];

    // Create a user
    $this->userLogin = 'a user';
    self::$base->login->user_add($this->token, $this->userLogin, null, null);
    $this->stfId = self::$base->organ->staff_add($this->token, 'Pierre', 'MARTIN');
    self::$base->login->user_staff_set($this->token, $this->userLogin, $this->stfId);

    // Create an institution, service and group
    $inst = self::$base->organ->institution_add($this->token, "An institution");
    $serv = self::$base->organ->service_add($this->token, $inst, 'A service');
    $this->grpId = self::$base->organ->service_group_add($this->token, $serv, 'A group');
  }

  protected function assertPostConditions()
  {
    self::$base->rollback();
  }

  public function testSgaAdd() {
    $id = self::$base->organ->staff_group_assignment_add($this->token, $this->grpId, $this->stfId);
    $this->assertGreaterThan(0, $id);
  }

  public function testSgaLists() {
    $id = self::$base->organ->staff_group_assignment_add($this->token, $this->grpId, $this->stfId);
    $grps = self::$base->organ->staff_group_assignment_list_groups($this->token, $this->stfId);    
    $this->assertEquals(1, count($grps));
    $this->assertEquals('A group', $grps[0]['sgr_name']);

    $stfs = self::$base->organ->staff_group_assignment_list_staffs($this->token, $this->grpId);
    $this->assertEquals(1, count($stfs));
    $this->assertEquals('Pierre', $stfs[0]['stf_firstname']);
    $this->assertEquals('MARTIN', $stfs[0]['stf_lastname']);
  }

  public function testSgaDelete() {
    $id = self::$base->organ->staff_group_assignment_add($this->token, $this->grpId, $this->stfId);
    $grps = self::$base->organ->staff_group_assignment_list_groups($this->token, $this->stfId);    
    $this->assertEquals(1, count($grps));
    self::$base->organ->staff_group_assignment_delete($this->token, $this->grpId, $this->stfId);
    $grps = self::$base->organ->staff_group_assignment_list_groups($this->token, $this->stfId);    
    $this->assertEquals(0, count($grps));    
  }

  /**
   * Trying to delete an inexistant assignment raises an exception
   * @expectedException PgProcException
   */
  public function testSgaDeleteUnknown() {
    $id = self::$base->organ->staff_group_assignment_add($this->token, $this->grpId, $this->stfId);
    $grps = self::$base->organ->staff_group_assignment_list_groups($this->token, $this->stfId);    
    self::$base->organ->staff_group_assignment_delete($this->token, $this->grpId+1, $this->stfId+1);
  }
}
