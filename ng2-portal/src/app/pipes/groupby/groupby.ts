import {Pipe, PipeTransform} from 'angular2/core';


@Pipe({
  name: 'groupby'
})
export class Groupby implements PipeTransform {
  // This pipe cannot be used in template because of minification
  transform(arr: any, key?: any): any {
    var newArr = [],
    types = {},
    i, j, cur;
    for (i = 0, j = arr.length; i < j; i++) {
        cur = arr[i];
        if (!(cur[key] in types)) {
            types[cur[key]] = { type: cur[key], data: [] };
            newArr.push(types[cur[key]]);
        }
        types[cur[key]].data.push(cur);
    }
    return newArr;
  }
}
