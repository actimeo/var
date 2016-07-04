import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Dialog, InputText, Button } from 'primeng/primeng';
import { I18nService, I18nDirective } from 'ng2-i18next/ng2-i18next';

@Component({
  moduleId: module.id,
  selector: 'app-dlg-inputtext',
  templateUrl: 'dlg-inputtext.component.html',
  styleUrls: ['dlg-inputtext.component.css'],
  directives: [I18nDirective, Dialog, InputText, Button]
})
export class DlgInputtextComponent implements OnInit {

  @Output() ok: EventEmitter<string> = new EventEmitter<string>();
  @Output() cancel: EventEmitter<boolean> = new EventEmitter<boolean>();

  private title: string;
  private label: string;
  private visible: boolean = false;
  private text: string = '';

  constructor(private i18n: I18nService) { }

  ngOnInit() {
  }

  show(title: string, label: string) {
    this.visible = true;
    this.title = title;
    this.label = label;
  }

  onVisibleChange(e) {
    this.visible = e;
    if (e === false) {
      this.onCancel();
    }
  }

  onOk() {
    this.visible = false;
    this.ok.emit(this.text);
  }

  onCancel() {
    this.visible = false;
    this.cancel.emit(true);
  }
}
