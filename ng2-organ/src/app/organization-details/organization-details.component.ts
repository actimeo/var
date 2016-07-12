import { Component, OnInit, Input } from '@angular/core';
import { Button, InputText, ToggleButton } from 'primeng/primeng';
import { PgService } from 'ng2-postgresql-procedures/ng2-postgresql-procedures';
import { I18nService, I18nDirective } from 'ng2-i18next/ng2-i18next';
import { DbOrganization } from '../db.models/organ';

@Component({
  moduleId: module.id,
  selector: 'app-organization-details',
  templateUrl: 'organization-details.component.html',
  styleUrls: ['organization-details.component.css'],
  directives: [I18nDirective, Button, InputText, ToggleButton]
})
export class OrganizationDetailsComponent implements OnInit {

  @Input() set orgId(val: number) {
    this.intOrgId = val;
    this.reloadData();
  }

  private intOrgId: number;
  private organization: DbOrganization;
  isInternal: boolean = false;
  name: string = '';
  description: string = '';

  private cancelVisible: boolean = false;
  private saveVisible: boolean = false;

  constructor(private pgService: PgService, private i18next: I18nService) { }

  ngOnInit() {
  }

  private reloadData() {
    this.pgService.pgcall('organ', 'organization_get', {
      prm_id: this.intOrgId
    })
      .then((data: DbOrganization) => {
        this.organization = data;
        this.populateForm();
      })
      .catch(err => {
        console.log(err);
      });
  }


  private populateForm() {
    this.isInternal = this.organization.org_internal;
    this.name = this.organization.org_name;
    this.description = this.organization.org_description;
  }

  protected internalChange(val: boolean) {
    this.isInternal = val;
    this.cancelVisible = true;
    this.saveVisible = true;
  }
  protected nameChange(val: string) {
    this.name = val;
    this.cancelVisible = true;
    this.saveVisible = true;
  }
  protected descriptionChange(val: string) {
    this.description = val;
    this.cancelVisible = true;
    this.saveVisible = true;
  }

  protected cancel() {
    this.populateForm();
    this.cancelVisible = false;
    this.saveVisible = false;
  }

  protected save() {
    this.cancelVisible = false;
    this.saveVisible = false;
  }
}
