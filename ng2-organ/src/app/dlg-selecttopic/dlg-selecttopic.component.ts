import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { I18nService } from 'ng2-i18next/ng2-i18next';

@Component({
  moduleId: module.id,
  selector: 'app-dlg-selecttopic',
  templateUrl: 'dlg-selecttopic.component.html',
  styleUrls: ['dlg-selecttopic.component.css']
})
export class DlgSelecttopicComponent implements OnInit {

  @Output() cancel: EventEmitter<boolean> = new EventEmitter<boolean>();

  private visible: boolean = false;

  constructor(private i18n: I18nService) {}

  ngOnInit() {
  }


  onVisibleChange(e) {
    this.visible = e;
    if (e === false) {
      this.onCancel();
    }
  }

  onCancel() {
    this.visible = false;
    this.cancel.emit(true);
  }
}
