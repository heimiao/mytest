import { Pipe, PipeTransform } from '@angular/core';
import { stateMap } from '../config'

@Pipe({
  name: 'stateFilter'
})
export class FilterPipe implements PipeTransform {
  transform(value: any, args?: any, ar?: any): any {
    let returnStr;
    let data = value[args];
    let sourceMap = stateMap[ar || args];
    if (sourceMap) {
      for (let item in sourceMap) {
        if (data == sourceMap[item].state) {
          returnStr = sourceMap[item].name
        }
      }
    } else {
      returnStr = args;
    }
    return returnStr;
  }
}


@Pipe({
  name: 'parseIntFilter'
})
export class parseIntPipe implements PipeTransform {
  transform(value: any, args?: any, ar?: any): any {
    let returnStr: string;
    returnStr = Math.ceil(value / 3600) + "";
    return returnStr;
  }
}

@Pipe({
  name: 'myDate'
})
export class myDatePipe implements PipeTransform {
  transform(value: any, args: any = "yyyy-MM-dd", ar?: any): any {
    let returnStr: string;
    if (value) {
      let myDate = new Date(value);
      var o = {
        "M+": myDate.getMonth() + 1, // month
        "d+": myDate.getDate(), // day
        "h+": myDate.getHours(), // hour
        "m+": myDate.getMinutes(), // minute
        "s+": myDate.getSeconds(), // second
        "q+": Math.floor((myDate.getMonth() + 3) / 3), // quarter
        "S": myDate.getMilliseconds() // millisecond
      }
      if (/(y+)/.test(args)) {
        args = args.replace(RegExp.$1, (myDate.getFullYear() + "").substr(4 - RegExp.$1.length));
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(args)) {
          args = args.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
      }
    }
    console.log(value);
    returnStr = args
    return returnStr;
  }
}

