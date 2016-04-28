import {Component, OnInit, Output, EventEmitter} from 'angular2/core';
import {DROPDOWN_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

import {UserService, PgService} from 'ng2-postgresql-procedures/ng2-postgresql-procedures';

@Component({
  selector: 'user-portal-select',
  templateUrl: 'app///user-portal-select/user-portal-select.component.html',
  styleUrls: ['app///user-portal-select/user-portal-select.component.css'],
  directives: [DROPDOWN_DIRECTIVES]
})
export class UserPortalSelectComponent implements OnInit {

  @Output() onselected: EventEmitter<any> = new EventEmitter();

  private userPortals: any;
  private selectedPortal;

  constructor(public pgService: PgService, public userService: UserService) { }

  ngOnInit() {
    this.pgService.pgcall('login', 'user_portal_list', {
      'prm_login': this.userService.getLogin()
    }).then(data => {
      this.userPortals = data;
      this.selectPortal(this.userPortals[0]);
    });
  }

  onUserPortalSelected(selPortal) {
    this.selectPortal(selPortal);
  }

  selectPortal(portal) {
    this.selectedPortal = portal;
    this.onselected.emit(portal);
  }
}
