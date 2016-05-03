import {Component, OnInit} from 'angular2/core';
import {TAB_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

import {I18nService} from 'ng2-i18next/ng2-i18next';

import {ServicesListComponent} from '../services-list/index';

@Component({
  selector: 'institution-main',
  templateUrl: 'app///institution-main/institution-main.component.html',
  styleUrls: ['app///institution-main/institution-main.component.css'],
  directives: [TAB_DIRECTIVES, ServicesListComponent]
})
export class InstitutionMainComponent implements OnInit {
  private insId: number;

  constructor(private i18next: I18nService) { }

  ngOnInit() {
  }

  setInstitutionId(insId) { this.insId = insId; }

}
