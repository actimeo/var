<?php
/*
** portal
 - add 
 - rename
 - delete
 - clean 
 - list

 ** mainsection
 - add
 - remove
 - reorder
 - unique order
*/
require_once '../../pgproc/php/pgprocedures.php';
require_once '../../config.inc.php';

class portalTest extends PHPUnit_Framework_TestCase {
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
  }

  protected function assertPostConditions()
  {
    self::$base->rollback();
  }

  public function testPortalAdd() {
    $name = 'a portal';
    $id = self::$base->portal->portal_add($name);
    $this->assertGreaterThan(0, $id);
  }  

  /**
   * Add two portals with same name
   * @expectedException PgProcException
   */
  public function testPortalAddSameName() {
    $name = 'a portal';
    $id = self::$base->portal->portal_add($name);
    $this->assertGreaterThan(0, $id);
    $id = self::$base->portal->portal_add($name);
  }  

  public function testPortalList() {
    $name = 'a portal';
    $id = self::$base->portal->portal_add($name);
    $portals = self::$base->portal->portal_list();
    $this->assertEquals(1, count($portals));
    $portal = $portals[0];
    $this->assertEquals($name, $portal['por_name']);
  }

  public function testPortalRename() {
    $name1 = 'a portal';
    $name2 = 'another portal';
    $id = self::$base->portal->portal_add($name1);
    self::$base->portal->portal_rename($id, $name2);
    $portals = self::$base->portal->portal_list();
    $this->assertEquals(1, count($portals));
    $portal = $portals[0];
    $this->assertEquals($name2, $portal['por_name']);
  }

  /**
   * Trying to rename an inexistant portal raises an exception
   * @expectedException PgProcException
   */
  public function testPortalRenameUnknown() {
    $name1 = 'a portal';
    $name2 = 'another portal';
    $id = self::$base->portal->portal_add($name1);
    self::$base->portal->portal_rename($id+1, $name2);
  }

  public function testPortalDelete() {
    $name = 'a portal';
    $id = self::$base->portal->portal_add($name);
    $portals = self::$base->portal->portal_list();
    $this->assertEquals(1, count($portals));   
    self::$base->portal->portal_delete($id);
    $portals = self::$base->portal->portal_list();
    $this->assertEquals(0, count($portals));
  }

  /**
   * Trying to delete an inexistant portal raises an exception
   * @expectedException PgProcException
   */
  public function testPortalDeleteUnknown() {
    $name = 'a portal';
    $id = self::$base->portal->portal_add($name);
    self::$base->portal->portal_delete($id+1);
  }

  public function testPortalClean() {
    $por_name = 'a portal';
    $por_id = self::$base->portal->portal_add($por_name);
    
    $mse_name1 = 'a first section';
    $mse_name2 = 'a second section';
    $pse_name1 = 'a first section';
    $pse_name2 = 'a second section';
    $id1 = self::$base->portal->mainsection_add($por_id, $mse_name1);
    $id2 = self::$base->portal->mainsection_add($por_id, $mse_name2);
    self::$base->portal->personsection_add($por_id, 'patient', $pse_name1);
    self::$base->portal->personsection_add($por_id, 'staff', $pse_name2);
    self::$base->portal->portal_clean($por_id);
    $this->setExpectedException('PgProcException');
    self::$base->portal->portal_rename($por_id, 'new name');
  }

}
