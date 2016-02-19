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

  public function testMainsectionAdd() {
    $por_name = 'a portal';
    $por_id = self::$base->portal->portal_add($por_name);

    $mse_name = 'a main section';
    $id = self::$base->portal->mainsection_add($por_id, $mse_name);
    $this->assertGreaterThan(0, $id);
  }

  public function testMainsectionAddTwice() {
    $por_name = 'a portal';
    $por_id = self::$base->portal->portal_add($por_name);
    
    $mse_name1 = 'a first section';
    $mse_name2 = 'a second section';
    $id1 = self::$base->portal->mainsection_add($por_id, $mse_name1);
    $id2 = self::$base->portal->mainsection_add($por_id, $mse_name2);
    $this->assertGreaterThan($id1, $id2);
  }

  /**
   * Add two mainsections with same name in same portal
   * @expectedException PgProcException
   */
  public function testMainsectionAddSameName() {
    $por_name = 'a portal';
    $por_id = self::$base->portal->portal_add($por_name);
    
    $mse_name = 'a first section';
    $id1 = self::$base->portal->mainsection_add($por_id, $mse_name);
    $id2 = self::$base->portal->mainsection_add($por_id, $mse_name);
  }  

  /**
   * Add two mainsections with same name in different portals
   */
  public function testMainsectionAddSameNameOtherPortal() {
    $por_name1 = 'a first portal';
    $por_id1 = self::$base->portal->portal_add($por_name1);
    $por_name2 = 'a second portal';
    $por_id2 = self::$base->portal->portal_add($por_name2);
    
    $mse_name = 'a section';
    $id1 = self::$base->portal->mainsection_add($por_id1, $mse_name);
    $id2 = self::$base->portal->mainsection_add($por_id2, $mse_name);
    $this->assertGreaterThan($id1, $id2);
  }  

  public function testMainsectionAddAndList() {
    $por_name = 'a portal';
    $por_id = self::$base->portal->portal_add($por_name);

    $mse_name = 'a main section';
    $id = self::$base->portal->mainsection_add($por_id, $mse_name);
    $mainsections = self::$base->portal->mainsection_list($por_id);
    $this->assertEquals(1, count($mainsections));
  }

  public function testMainsectionAddTwiceAndList() {
    $por_name = 'a portal';
    $por_id = self::$base->portal->portal_add($por_name);
    
    $mse_name1 = 'a first section';
    $mse_name2 = 'a second section';
    $id1 = self::$base->portal->mainsection_add($por_id, $mse_name1);
    $id2 = self::$base->portal->mainsection_add($por_id, $mse_name2);
    
    $mainsections = self::$base->portal->mainsection_list($por_id);
    $this->assertEquals(2, count($mainsections));    
  }

  public function testMainsectionAddDifferentPortalsAndList() {
    $por_name1 = 'a first portal';
    $por_id1 = self::$base->portal->portal_add($por_name1);
    $por_name2 = 'a second portal';
    $por_id2 = self::$base->portal->portal_add($por_name2);
    
    $mse_name = 'a section';
    $id1 = self::$base->portal->mainsection_add($por_id1, $mse_name);
    $id2 = self::$base->portal->mainsection_add($por_id2, $mse_name);

    $mainsections = self::$base->portal->mainsection_list($por_id1);
    $this->assertEquals(1, count($mainsections));

    $mainsections = self::$base->portal->mainsection_list($por_id2);
    $this->assertEquals(1, count($mainsections));
  }

  public function testMainsectionAddAndCheckOrder() {
    $por_name = 'a portal';
    $por_id = self::$base->portal->portal_add($por_name);
    
    $mse_name[0] = 'a first section';
    $mse_name[1] = 'a second section';
    $mse_name[2] = 'a third section';
    $mse_name[3] = 'a fourth section';
    for ($i=0; $i<4; $i++)
      $id[$i] = self::$base->portal->mainsection_add($por_id, $mse_name[$i]);
    
    $mainsections = self::$base->portal->mainsection_list($por_id);
    $this->assertEquals(4, count($mainsections));
    for ($i=0; $i<4; $i++) {
      $this->assertEquals($i+1, $mainsections[$i]['mse_order']);
      $this->assertEquals($mse_name[$i], $mainsections[$i]['mse_name']);
    }
  }

  public function testMainsectionRename() {
    $name1 = 'a section';
    $name2 = 'another section';
    $por = self::$base->portal->portal_add('a portal');
    
    $id = self::$base->portal->mainsection_add($por, $name1);
    self::$base->portal->mainsection_rename($id, $name2);
    $mainsections = self::$base->portal->mainsection_list($por);
    $this->assertEquals(1, count($mainsections));
    $mainsection = $mainsections[0];
    $this->assertEquals($name2, $mainsection['mse_name']);
    
  }

 /**
   * Trying to rename an inexistant mainsection raises an exception
   * @expectedException PgProcException
   */
   public function testMainsectionRenameUnknown() {
    $name1 = 'a section';
    $name2 = 'another section';
    $por = self::$base->portal->portal_add('a portal');
    
    $id = self::$base->portal->mainsection_add($por, $name1);
    self::$base->portal->mainsection_rename($id+1, $name2);
  }

  public function testMainsectionDelete() {
    $por = self::$base->portal->portal_add('a portal');
    $id = self::$base->portal->mainsection_add($por, 'a section');
    $mainsections = self::$base->portal->mainsection_list($por);
    $this->assertEquals(1, count($mainsections));
    self::$base->portal->mainsection_delete($id);
    $mainsections = self::$base->portal->mainsection_list($por);
    $this->assertEquals(0, count($mainsections));
  }

  /**
   * Trying to delete an inexistant portal raises an exception
   * @expectedException PgProcException
   */
  public function testMainsectionDeleteUnknown() {
    $name = 'a portal';
    $por = self::$base->portal->portal_add($name);
    $id = self::$base->portal->mainsection_add($por, 'a section');
    self::$base->portal->portal_delete($id+1);
  }

  public function testMainsectionAddAndMoveToMiddle() {
    $por_name = 'a portal';
    $por_id = self::$base->portal->portal_add($por_name);
    
    $mse_name[0] = '1';
    $mse_name[1] = '2';
    $mse_name[2] = '3';
    $mse_name[3] = '4';
    for ($i=0; $i<4; $i++)
      $id[$i] = self::$base->portal->mainsection_add($por_id, $mse_name[$i]);
    
    $mainsections = self::$base->portal->mainsection_list($por_id);
    $this->assertEquals(4, count($mainsections));

    self::$base->portal->mainsection_move_before_position($id[2], 1);
    $mainsections = self::$base->portal->mainsection_list($por_id);
    $this->assertEquals(array('3', '1', '2', '4'), $this->getMseNames($mainsections));
  }

  public function testMainsectionAddAndMoveToStart() {
    $por_name = 'a portal';
    $por_id = self::$base->portal->portal_add($por_name);
    
    $mse_name[0] = '1';
    $mse_name[1] = '2';
    $mse_name[2] = '3';
    $mse_name[3] = '4';
    for ($i=0; $i<4; $i++)
      $id[$i] = self::$base->portal->mainsection_add($por_id, $mse_name[$i]);
    
    $mainsections = self::$base->portal->mainsection_list($por_id);
    $this->assertEquals(4, count($mainsections));

    self::$base->portal->mainsection_move_before_position($id[3], 1);
    $mainsections = self::$base->portal->mainsection_list($por_id);
    $this->assertEquals(array('4', '1', '2', '3'), $this->getMseNames($mainsections));
  }

  public function testMainsectionAddAndMoveToEnd() {
    $por_name = 'a portal';
    $por_id = self::$base->portal->portal_add($por_name);
    
    $mse_name[0] = '1';
    $mse_name[1] = '2';
    $mse_name[2] = '3';
    $mse_name[3] = '4';
    for ($i=0; $i<4; $i++)
      $id[$i] = self::$base->portal->mainsection_add($por_id, $mse_name[$i]);
    
    $mainsections = self::$base->portal->mainsection_list($por_id);
    $this->assertEquals(4, count($mainsections));

    self::$base->portal->mainsection_move_before_position($id[0], 5);
    $mainsections = self::$base->portal->mainsection_list($por_id);
    $this->assertEquals(array('2', '3', '4', '1'), $this->getMseNames($mainsections));
  }
  
  private function getMseNames($a) {
    $ret = array();
    foreach($a as $v) {
      $ret[] = $v['mse_name'];
    }
    return $ret;
  }

  /* personsection */
  public function testPersonsectionAdd() {
    $por_name = 'a portal';
    $por_id = self::$base->portal->portal_add($por_name);

    $pse_name = 'a main section';
    $id = self::$base->portal->personsection_add($por_id, 'patient', $pse_name);
    $this->assertGreaterThan(0, $id);
  }

  public function testPersonsectionAddTwice() {
    $por_name = 'a portal';
    $por_id = self::$base->portal->portal_add($por_name);
    
    $pse_name1 = 'a first section';
    $pse_name2 = 'a second section';
    $id1 = self::$base->portal->personsection_add($por_id, 'patient', $pse_name1);
    $id2 = self::$base->portal->personsection_add($por_id, 'patient', $pse_name2);
    $this->assertGreaterThan($id1, $id2);
  }

  /**
   * Add two personsections with same name in same portal
   * @expectedException PgProcException
   */
  public function testPersonsectionAddSameName() {
    $por_name = 'a portal';
    $por_id = self::$base->portal->portal_add($por_name);
    
    $pse_name = 'a first section';
    $id1 = self::$base->portal->personsection_add($por_id, 'patient', $pse_name);
    $id2 = self::$base->portal->personsection_add($por_id, 'patient', $pse_name);
  }  

  /**
   * Add two personsections with same name in different portals
   */
  public function testPersonsectionAddSameNameOtherPortal() {
    $por_name1 = 'a first portal';
    $por_id1 = self::$base->portal->portal_add($por_name1);
    $por_name2 = 'a second portal';
    $por_id2 = self::$base->portal->portal_add($por_name2);
    
    $pse_name = 'a section';
    $id1 = self::$base->portal->personsection_add($por_id1, 'patient', $pse_name);
    $id2 = self::$base->portal->personsection_add($por_id2, 'patient', $pse_name);
    $this->assertGreaterThan($id1, $id2);
  }  

  public function testPersonsectionAddAndList() {
    $por_name = 'a portal';
    $por_id = self::$base->portal->portal_add($por_name);

    $pse_name = 'a main section';
    $id = self::$base->portal->personsection_add($por_id, 'patient', $pse_name);
    $personsections = self::$base->portal->personsection_list($por_id, 'patient');
    $this->assertEquals(1, count($personsections));
  }

  public function testPersonsectionAddTwiceAndList() {
    $por_name = 'a portal';
    $por_id = self::$base->portal->portal_add($por_name);
    
    $pse_name1 = 'a first section';
    $pse_name2 = 'a second section';
    $id1 = self::$base->portal->personsection_add($por_id, 'patient', $pse_name1);
    $id2 = self::$base->portal->personsection_add($por_id, 'patient', $pse_name2);
    
    $personsections = self::$base->portal->personsection_list($por_id, 'patient');
    $this->assertEquals(2, count($personsections));    
  }

  public function testPersonsectionAddDifferentPortalsAndList() {
    $por_name1 = 'a first portal';
    $por_id1 = self::$base->portal->portal_add($por_name1);
    $por_name2 = 'a second portal';
    $por_id2 = self::$base->portal->portal_add($por_name2);
    
    $pse_name = 'a section';
    $id1 = self::$base->portal->personsection_add($por_id1, 'patient', $pse_name);
    $id2 = self::$base->portal->personsection_add($por_id2, 'patient', $pse_name);

    $personsections = self::$base->portal->personsection_list($por_id1, 'patient');
    $this->assertEquals(1, count($personsections));

    $personsections = self::$base->portal->personsection_list($por_id2, 'patient');
    $this->assertEquals(1, count($personsections));
  }

  public function testPersonsectionAddAndCheckOrder() {
    $por_name = 'a portal';
    $por_id = self::$base->portal->portal_add($por_name);
    
    $pse_name[0] = 'a first section';
    $pse_name[1] = 'a second section';
    $pse_name[2] = 'a third section';
    $pse_name[3] = 'a fourth section';
    for ($i=0; $i<4; $i++)
      $id[$i] = self::$base->portal->personsection_add($por_id, 'patient', $pse_name[$i]);
    
    $personsections = self::$base->portal->personsection_list($por_id, 'patient');
    $this->assertEquals(4, count($personsections));
    for ($i=0; $i<4; $i++) {
      $this->assertEquals($i+1, $personsections[$i]['pse_order']);
      $this->assertEquals($pse_name[$i], $personsections[$i]['pse_name']);
    }
  }

  public function testPersonsectionRename() {
    $name1 = 'a section';
    $name2 = 'another section';
    $por = self::$base->portal->portal_add('a portal');
    
    $id = self::$base->portal->personsection_add($por, 'patient', $name1);
    self::$base->portal->personsection_rename($id, $name2);
    $personsections = self::$base->portal->personsection_list($por, 'patient');
    $this->assertEquals(1, count($personsections));
    $personsection = $personsections[0];
    $this->assertEquals($name2, $personsection['pse_name']);
    
  }

 /**
   * Trying to rename an inexistant personsection raises an exception
   * @expectedException PgProcException
   */
   public function testPersonsectionRenameUnknown() {
    $name1 = 'a section';
    $name2 = 'another section';
    $por = self::$base->portal->portal_add('a portal');
    
    $id = self::$base->portal->personsection_add($por, 'patient', $name1);
    self::$base->portal->personsection_rename($id+1, $name2);
  }

  public function testPersonsectionDelete() {
    $por = self::$base->portal->portal_add('a portal');
    $id = self::$base->portal->personsection_add($por, 'patient', 'a section');
    $personsections = self::$base->portal->personsection_list($por, 'patient');
    $this->assertEquals(1, count($personsections));
    self::$base->portal->personsection_delete($id);
    $personsections = self::$base->portal->personsection_list($por, 'patient');
    $this->assertEquals(0, count($personsections));
  }

  /**
   * Trying to delete an inexistant portal raises an exception
   * @expectedException PgProcException
   */
  public function testPersonsectionDeleteUnknown() {
    $name = 'a portal';
    $por = self::$base->portal->portal_add($name);
    $id = self::$base->portal->personsection_add($por, 'patient', 'a section');
    self::$base->portal->portal_delete($id+1);
  }

  public function testPersonsectionAddAndMoveToMiddle() {
    $por_name = 'a portal';
    $por_id = self::$base->portal->portal_add($por_name);
    
    $pse_name[0] = '1';
    $pse_name[1] = '2';
    $pse_name[2] = '3';
    $pse_name[3] = '4';
    for ($i=0; $i<4; $i++)
      $id[$i] = self::$base->portal->personsection_add($por_id, 'patient', $pse_name[$i]);
    
    $personsections = self::$base->portal->personsection_list($por_id, 'patient');
    $this->assertEquals(4, count($personsections));

    self::$base->portal->personsection_move_before_position($id[2], 1);
    $personsections = self::$base->portal->personsection_list($por_id, 'patient');
    $this->assertEquals(array('3', '1', '2', '4'), $this->getPseNames($personsections));
  }

  public function testPersonsectionAddAndMoveToStart() {
    $por_name = 'a portal';
    $por_id = self::$base->portal->portal_add($por_name);
    
    $pse_name[0] = '1';
    $pse_name[1] = '2';
    $pse_name[2] = '3';
    $pse_name[3] = '4';
    for ($i=0; $i<4; $i++)
      $id[$i] = self::$base->portal->personsection_add($por_id, 'patient', $pse_name[$i]);
    
    $personsections = self::$base->portal->personsection_list($por_id, 'patient');
    $this->assertEquals(4, count($personsections));

    self::$base->portal->personsection_move_before_position($id[3], 1);
    $personsections = self::$base->portal->personsection_list($por_id, 'patient');
    $this->assertEquals(array('4', '1', '2', '3'), $this->getPseNames($personsections));
  }

  public function testPersonsectionAddAndMoveToEnd() {
    $por_name = 'a portal';
    $por_id = self::$base->portal->portal_add($por_name);
    
    $pse_name[0] = '1';
    $pse_name[1] = '2';
    $pse_name[2] = '3';
    $pse_name[3] = '4';
    for ($i=0; $i<4; $i++)
      $id[$i] = self::$base->portal->personsection_add($por_id, 'patient', $pse_name[$i]);
    
    $personsections = self::$base->portal->personsection_list($por_id, 'patient');
    $this->assertEquals(4, count($personsections));

    self::$base->portal->personsection_move_before_position($id[0], 5);
    $personsections = self::$base->portal->personsection_list($por_id, 'patient');
    $this->assertEquals(array('2', '3', '4', '1'), $this->getPseNames($personsections));
  }
  
  private function getPseNames($a) {
    $ret = array();
    foreach($a as $v) {
      $ret[] = $v['pse_name'];
    }
    return $ret;
  }

}
