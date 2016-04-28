import {Component, OnInit, Output, EventEmitter} from 'angular2/core';
import {DROPDOWN_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

import {I18nDirective, I18nService} from 'ng2-i18next/ng2-i18next';
import {UserService, PgService} from 'ng2-postgresql-procedures/ng2-postgresql-procedures';

@Component({
  selector: 'user-group-select',
  templateUrl: 'app///user-group-select/user-group-select.component.html',
  styleUrls: ['app///user-group-select/user-group-select.component.css'],
  directives: [I18nDirective, DROPDOWN_DIRECTIVES]
})
export class UserGroupSelectComponent implements OnInit {

  @Output() onselected: EventEmitter<any> = new EventEmitter();

  private userGroups: any;
  private selectedGroup;

  constructor(public pgService: PgService, public userService: UserService,
  private i18n: I18nService) { }

  ngOnInit() {
    this.pgService.pgcall('organ', 'staff_group_assignment_list_groups', {
      'prm_stf_id': this.userService.getStaffId()
    }).then(data => {
      this.userGroups = data;
      this.selectGroup(null);
    });
  }

  onUserGroupSelected(selGroup) {
    this.selectGroup(selGroup);
  }

  onAllUserGroupSelected() {
    this.selectGroup(null);
  }

  selectGroup(group) {
    this.selectedGroup = group;
    this.onselected.emit(group);
  }
}
