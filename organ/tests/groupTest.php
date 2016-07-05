<?php
require_once '../../pgproc/php/pgprocedures.php';
require_once '../../config.inc.php';

class groupTest extends PHPUnit_Framework_TestCase {
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

  public function testGroupAdd() {
    $name = 'an organization';
    $orgId = self::$base->organ->organization_add($this->token, $name);
    $this->assertGreaterThan(0, $orgId);

    $grp_name = 'a group';
    $grpId = self::$base->organ->group_add($this->token, $orgId, $grp_name);
    $this->assertGreaterThan(0, $grpId);
  }  

  public function testGroupGet() {
    $name = 'an organization';
    $orgId = self::$base->organ->organization_add($this->token, $name);
    $this->assertGreaterThan(0, $orgId);

    $grp_name = 'a group';
    $grpId = self::$base->organ->group_add($this->token, $orgId, $grp_name);
    $this->assertGreaterThan(0, $grpId);

    $grp = self::$base->organ->group_get($this->token, $grpId);
    $this->assertEquals($grp_name, $grp['grp_name']);
    $this->assertEquals('', $grp['grp_notes']);
  }  

  public function testGroupAddSameNameDifferentOrganization() {
    $name1 = 'organization 1';
    $orgId1 = self::$base->organ->organization_add($this->token, $name1);
    $name2 = 'organization 2';
    $orgId2 = self::$base->organ->organization_add($this->token, $name2);

    $this->assertGreaterThan(0, $orgId1);
    $this->assertGreaterThan(0, $orgId2);

    $grpName = 'a same group name';
    $grpId1 = self::$base->organ->group_add($this->token, $orgId1, $grpName);
    $grpId2 = self::$base->organ->group_add($this->token, $orgId2, $grpName);
  }  

  /**
   * Add two groups with same name to the same organization
   * @expectedException PgProcException
   */  
  public function testGroupAddSameNameSameOrganization() {
    $name = 'organization';
    $orgId = self::$base->organ->organization_add($this->token, $name);

    $grpName = 'a same group';
    $grpId1 = self::$base->organ->group_add($this->token, $orgId, $grpName);
    $grpId2 = self::$base->organ->group_add($this->token, $orgId, $grpName);
  } 

  public function testGroupSet() {
    $name = 'organization';
    $orgId = self::$base->organ->organization_add($this->token, $name);
    
    $grpName = 'a group';
    $grpId = self::$base->organ->group_add($this->token, $orgId, $grpName);
    $this->assertGreaterThan(0, $grpId);
    
    $grpNotes = 'a note';
    self::$base->organ->group_set($this->token, $grpId, $grpNotes);
    $grp = self::$base->organ->group_get($this->token, $grpId);
    $this->assertEquals($grpNotes, $grp['grp_notes']);
  }
  
  public function testGroupList() {
    $name = 'an organization';
    $orgId = self::$base->organ->organization_add($this->token, $name);

    $grp_name1 = 'group 1';
    $grpId1 = self::$base->organ->group_add($this->token, $orgId, $grp_name1);
    $this->assertGreaterThan(0, $grpId1);
    
    $grp_name2 = 'group 2';
    $grpId2 = self::$base->organ->group_add($this->token, $orgId, $grp_name2);
    $this->assertGreaterThan(0, $grpId2);
    
    $grps = self::$base->organ->group_list($this->token, $orgId);
    $this->assertEquals(2, count($grps));
  }
  
  public function testGroupDelete() {
    $name = 'an organization';
    $orgId = self::$base->organ->organization_add($this->token, $name);

    $grp_name = 'a group';
    $grpId = self::$base->organ->group_add($this->token, $orgId, $grp_name);

    $grps = self::$base->organ->group_list($this->token, $orgId);
    $this->assertEquals(1, count($grps));
    
    self::$base->organ->group_delete($this->token, $grpId);
    $grpsAfter = self::$base->organ->group_list($this->token, $orgId);
    $this->assertEquals(0, count($grpsAfter));
  }

  public function testGroupRename() {
    $name = 'an organization';
    $orgId = self::$base->organ->organization_add($this->token, $name);

    $grp_name1 = 'a group';
    $grp_name2 = 'another group';
    $grpId = self::$base->organ->group_add($this->token, $orgId, $grp_name1);
    self::$base->organ->group_rename($this->token, $grpId, $grp_name2);
    $grp = self::$base->organ->group_get($this->token, $grpId);
    $this->assertEquals($grp_name2, $grp['grp_name']);
  }

  /**
   * Trying to rename an inexistant portal raises an exception
   * @expectedException PgProcException
   */
  public function testGroupRenameUnknown() {
    $name = 'an organization';
    $orgId = self::$base->organ->organization_add($this->token, $name);

    $grp_name1 = 'a group';
    $grp_name2 = 'another group';
    $grpId = self::$base->organ->group_add($this->token, $orgId, $grp_name1);
    self::$base->organ->group_rename($this->token, $grpId+1, $grp_name2);
  }

  /**
   * Trying to delete an inexistant portal raises an exception
   * @expectedException PgProcException
   */
  public function testGroupDeleteUnknown() {
    $name = 'an organization';
    $id = self::$base->organ->organization_add($this->token, $name);

    $grp_name = 'a service group';
    $grpId = self::$base->organ->group_add($this->token, $id, $grp_name);

    self::$base->organ->group_delete($this->token, $grpId+1);
  }

  /**
   * Trying to delete a portal with null value as por_id raises an exception
   * @expectedException PgProcException
   */
  public function testServiceDeleteNull() {
    self::$base->organ->group_delete($this->token, null);
  }
}
