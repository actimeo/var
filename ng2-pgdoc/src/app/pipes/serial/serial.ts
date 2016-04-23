import {Pipe, PipeTransform} from 'angular2/core';


@Pipe({
  name: 'serial'
})
export class Serial implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value && value.substr(0, 7) === 'nextval') {
      return 'serial';
    } else {
      return value;
    }
  }
}
