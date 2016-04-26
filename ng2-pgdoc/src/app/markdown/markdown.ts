import {Component, Input, OnChanges} from 'angular2/core';

declare var marked;

@Component({
  selector: 'markdown',
  templateUrl: 'app///markdown/markdown.html',
  styleUrls: ['app///markdown/markdown.css'],
  providers: [],
  directives: [],
  pipes: []
})
export class Markdown implements OnChanges {
  private marked: any;
  private mdContent: string;

  @Input() content;

  constructor() {
    this.marked = marked;
  }

  ngOnChanges() {
    if (this.content) {
      this.mdContent = this.marked.parse(this.content);
    }
  }

}
