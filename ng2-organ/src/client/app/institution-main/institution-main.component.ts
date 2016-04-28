import {Component, OnInit} from 'angular2/core';

@Component({
  selector: 'institution-main',
  templateUrl: 'app///institution-main/institution-main.component.html',
  styleUrls: ['app///institution-main/institution-main.component.css']
})
export class InstitutionMainComponent implements OnInit {
  private insId: number;

  constructor() { }

  ngOnInit() {
  }

  setInstitutionId(insId) { this.insId = insId; }

}
