<?php
require_once '../../pgproc/php/pgprocedures.php';
require_once '../../config.inc.php';

class mainviewTest extends PHPUnit_Framework_TestCase {
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

    $mse_name = 'a main section';
    $mse_id = self::$base->portal->mainsection_add($this->token, $por_id, $mse_name);

    $mme_name = 'a main menu';
    $this->mmeId = self::$base->portal->mainmenu_add($this->token, $mse_id, $mme_name);

  }

  protected function assertPostConditions()
  {
    self::$base->rollback();
  }

  public function testMainviewAdd() {
    $title = 'a title';
    $icon = 'an icon';
    self::$base->portal->mainview_set($this->token, $this->mmeId, $title, $icon, null);
    $mvi = self::$base->portal->mainview_get($this->token, $this->mmeId);
    $this->assertEquals($mvi, array('mme_id' => $this->mmeId, 'mvi_title' => $title, 'mvi_icon' => $icon, 'pme_id_associated' => null));
  }

  public function testMainviewAddWithPme() {
    $title = 'a title';
    $icon = 'an icon';

    $ptitle = 'a person title';
    $picon = 'an person icon';
    self::$base->portal->personview_set($this->token, $this->pmeId, $ptitle, $picon);
    $pvi = self::$base->portal->personview_get($this->token, $this->pmeId);

    self::$base->portal->mainview_set($this->token, $this->mmeId, $title, $icon, $this->pmeId);
    $mvi = self::$base->portal->mainview_get($this->token, $this->mmeId);
    $this->assertEquals($mvi, array('mme_id' => $this->mmeId, 'mvi_title' => $title, 'mvi_icon' => $icon, 'pme_id_associated' => $this->pmeId));
  }

  public function testMainviewDelete() {
    $title = 'a title';
    $icon = 'an icon';
    self::$base->portal->mainview_set($this->token, $this->mmeId, $title, $icon, null);
    self::$base->portal->mainview_delete($this->token, $this->mmeId);
    $this->setExpectedException('PgProcException');
    $mvi = self::$base->portal->mainview_get($this->token, $this->mmeId);
  }

  public function testMainviewSet() {
    $title = 'a title';
    $icon = 'an icon';
    $title2 = 'a second title';
    $icon2 = 'an second icon';
    self::$base->portal->mainview_set($this->token, $this->mmeId, $title, $icon, null);
    $mvi = self::$base->portal->mainview_get($this->token, $this->mmeId);
    $this->assertEquals($mvi, array('mme_id' => $this->mmeId, 'mvi_title' => $title, 'mvi_icon' => $icon, 'pme_id_associated' => null));
    self::$base->portal->mainview_set($this->token, $this->mmeId, $title2, $icon2, null);
    $mvi2 = self::$base->portal->mainview_get($this->token, $this->mmeId);
    $this->assertEquals($mvi2, array('mme_id' => $this->mmeId, 'mvi_title' => $title2, 'mvi_icon' => $icon2, 'pme_id_associated' => null));
  }
  
}
