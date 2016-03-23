<?php
require_once '../../pgproc/php/pgprocedures.php';
require_once '../../config.inc.php';

class personviewTest extends PHPUnit_Framework_TestCase {
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

    $por_name = 'a portal';
    $por_id = self::$base->portal->portal_add($this->token, $por_name);

    $pse_name = 'a person section';
    $pse_id = self::$base->portal->personsection_add($this->token, $por_id, 'patient', $pse_name);

    $pme_name = 'a person menu';
    $this->pmeId = self::$base->portal->personmenu_add($this->token, $pse_id, $pme_name);
  }

  protected function assertPostConditions()
  {
    self::$base->rollback();
  }

  public function testPersonviewAdd() {
    $title = 'a title';
    $icon = 'an icon';
    self::$base->portal->personview_set($this->token, $this->pmeId, $title, $icon);
    $pvi = self::$base->portal->personview_get($this->token, $this->pmeId);
    $this->assertEquals($pvi, array('pme_id' => $this->pmeId, 'pvi_title' => $title, 'pvi_icon' => $icon));
  }

  public function testPersonviewDelete() {
    $title = 'a title';
    $icon = 'an icon';
    self::$base->portal->personview_set($this->token, $this->pmeId, $title, $icon);
    self::$base->portal->personview_delete($this->token, $this->pmeId);
    $this->setExpectedException('PgProcException');
    $pvi = self::$base->portal->personview_get($this->token, $this->pmeId);
  }

  public function testPersonviewSet() {
    $title = 'a title';
    $icon = 'an icon';
    $title2 = 'a second title';
    $icon2 = 'an second icon';
    self::$base->portal->personview_set($this->token, $this->pmeId, $title, $icon);
    $pvi = self::$base->portal->personview_get($this->token, $this->pmeId);
    $this->assertEquals($pvi, array('pme_id' => $this->pmeId, 'pvi_title' => $title, 'pvi_icon' => $icon));
    self::$base->portal->personview_set($this->token, $this->pmeId, $title2, $icon2);
    $pvi2 = self::$base->portal->personview_get($this->token, $this->pmeId);
    $this->assertEquals($pvi2, array('pme_id' => $this->pmeId, 'pvi_title' => $title2, 'pvi_icon' => $icon2));
  }
  
}
