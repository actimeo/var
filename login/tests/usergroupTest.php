<?php
require_once '../../pgproc/php/pgprocedures.php';
require_once '../../config.inc.php';

class usergroupTest extends PHPUnit_Framework_TestCase {
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
    $login = 'testdejfhcqcsdfkhn';
    $pwd = 'ksfdjgsfdyubg';    
    self::$base->execute_sql("insert into login.user (usr_login, usr_salt, usr_rights) values ('".$login."', pgcrypto.crypt('".$pwd."', pgcrypto.gen_salt('bf', 8)), '{structure,users}');");
    $res = self::$base->login->user_login($login, $pwd, null);
    $this->token = $res['usr_token'];
  }

  protected function assertPostConditions()
  {
    //    echo "\n".'*** post conditions'."\n";
    self::$base->rollback();
  }


  public function testUsergroupAdd() {
    $name1 = 'Usergroup 1';
    $name2 = 'Usergroup 2';
    $ugr1 = self::$base->login->usergroup_add($this->token, $name1);
    $this->assertGreaterThan(0, $ugr1);    
    $ugr2 = self::$base->login->usergroup_add($this->token, $name2);
    $this->assertGreaterThan($ugr1, $ugr2);    
  }

  public function testUsergroupPortalSet() {

    $porName1 = 'portal 1';
    $porName2 = 'portal 2';
    $porName3 = 'portal 3';
    $porId1 = self::$base->portal->portal_add($this->token, $porName1);
    $porId2 = self::$base->portal->portal_add($this->token, $porName2);
    $porId3 = self::$base->portal->portal_add($this->token, $porName3);
    $this->assertGreaterThan($porId1, $porId2);
    $this->assertGreaterThan($porId2, $porId3);

    $usergroupName = 'A user group';
    $ugr = self::$base->login->usergroup_add($this->token, $usergroupName);
    self::$base->login->usergroup_set_portals($this->token, $ugr, array($porId2, $porId1));

    $porIds = self::$base->login->usergroup_portal_list($this->token, $ugr);
    $this->assertEquals(array (array('por_id'=>$porId1, 'por_name'=>$porName1), array('por_id'=>$porId2, 'por_name'=>$porName2)), $porIds);
    self::$base->login->usergroup_set_portals($this->token, $ugr, array($porId3, $porId1, $porId2));

    $porIds = self::$base->login->usergroup_portal_list($this->token, $ugr);
    $this->assertEquals(array (array('por_id'=>$porId1, 'por_name'=>$porName1), array('por_id'=>$porId2, 'por_name'=>$porName2), array('por_id'=>$porId3, 'por_name'=>$porName3)), $porIds);

    self::$base->login->usergroup_set_portals($this->token, $ugr, array($porId3, $porId1));
    $porIds = self::$base->login->usergroup_portal_list($this->token, $ugr);
    $this->assertEquals(array (array('por_id'=>$porId1, 'por_name'=>$porName1), array('por_id'=>$porId3, 'por_name'=>$porName3)), $porIds);

    self::$base->login->usergroup_set_portals($this->token, $ugr, array());
    $porIds = self::$base->login->usergroup_portal_list($this->token, $ugr);
    $this->assertEquals(null, $porIds);

    self::$base->login->usergroup_set_portals($this->token, $ugr, null);
    $porIds = self::$base->login->usergroup_portal_list($this->token, $ugr);
    $this->assertEquals(null, $porIds);

  }
}
?>
