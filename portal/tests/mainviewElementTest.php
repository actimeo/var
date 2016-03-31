<?php
require_once '../../pgproc/php/pgprocedures.php';
require_once '../../config.inc.php';

class mainviewElementTest extends PHPUnit_Framework_TestCase {
  private static $base;
  private static $pgHost;
  private static $pgUser;
  private static $pgPass;
  private static $pgDatabase;

  private static $pmeId;

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
    self::$base->execute_sql("insert into login.user (usr_login, usr_salt, usr_rights) values ('".$login."', pgcrypto.crypt('".$pwd."', pgcrypto.gen_salt('bf', 8)), '{structure}');");
    $res = self::$base->login->user_login($login, $pwd, null);
    $this->token = $res['usr_token'];


  }

  protected function assertPostConditions()
  {
    self::$base->rollback();
  }

  public function testMainviewElementAdd() {
    $mve_name1 = 'element 1';
    $mve_type1 = 'sample1';
    self::$base->portal->mainview_element_add($this->token, $mve_type1, $mve_name1);

    $mve_name2 = 'element 2';
    $mve_type2 = 'sample2';
    self::$base->portal->mainview_element_add($this->token, $mve_type2, $mve_name2);

    $listAll = self::$base->portal->mainview_element_list($this->token, null);
    $this->assertEquals(count($listAll), 2);

    $list1 = self::$base->portal->mainview_element_list($this->token, $mve_type1);
    $this->assertEquals(count($list1), 1);

    $list2 = self::$base->portal->mainview_element_list($this->token, $mve_type2);
    $this->assertEquals(count($list2), 1);
  }

  public function testMainviewElementDelete() {
    $mve_name1 = 'element 1';
    $mve_type1 = 'sample1';
    $mve_id1 = self::$base->portal->mainview_element_add($this->token, $mve_type1, $mve_name1);
    
    $mve_name2 = 'element 2';
    $mve_type2 = 'sample2';
    $mve_id2 = self::$base->portal->mainview_element_add($this->token, $mve_type2, $mve_name2);

    $listAll = self::$base->portal->mainview_element_list($this->token, null);
    $this->assertEquals(count($listAll), 2);

    self::$base->portal->mainview_element_delete($this->token, $mve_id1);
    $listAll = self::$base->portal->mainview_element_list($this->token, null);
    $this->assertEquals(count($listAll), 1);
  }

  public function testMainviewElementRename() {
    $mve_name1 = 'element 1';
    $mve_type1 = 'sample1';
    $mve_id1 = self::$base->portal->mainview_element_add($this->token, $mve_type1, $mve_name1);
    
    $mve_name2 = 'element 2';
    self::$base->portal->mainview_element_rename($this->token, $mve_id1, $mve_name2);

    $listAll = self::$base->portal->mainview_element_list($this->token, null);
    $this->assertEquals(count($listAll), 1);
    $this->assertEquals($listAll[0]['mve_name'], $mve_name2);
  }

}
