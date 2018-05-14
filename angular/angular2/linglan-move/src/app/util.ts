import { Injectable } from '@angular/core';
import { pinyin } from './config';
@Injectable()
export class Util {
    constructor() { }
    formatDate(fmt: any, dates: any = new Date()): string {
        let date = new Date(dates * 1000);
        var o = {
            "M+": date.getMonth() + 1,                 //月份   
            "d+": date.getDate(),                    //日   
            "h+": date.getHours(),                   //小时   
            "m+": date.getMinutes(),                 //分   
            "s+": date.getSeconds(),                 //秒   
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
            "S": date.getMilliseconds()             //毫秒   
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    getRandomStr(args = 10): string {
        let baseStr: string = "abcdefghijklmnopqrstuvwxyz0123456789";
        let str: string = "";
        for (let i = 0; i < args; i++) {
            let Rand = Math.random();
            str += baseStr.charAt(Math.ceil(Rand * 35));
        }
        return str;
    }
    queryParam(args): String {
        let returnStr: String = "";
        if (typeof args == "string") return args;
        if (typeof args == "object") {
            for (let i in args) {
                returnStr += i + "=" + args[i] + "&"
            }
        }
        return returnStr.substr(0, returnStr.length - 2);
    }

    conversion(data: Array<any>, parentAry: any = {}, key: string = "userName"): any {
        for (var m in data) {
            if (/[A-Z]/.test(this.convertPinyin(data[m][key].toString()))) {
                parentAry[this.convertPinyin(data[m][key])] || (parentAry[this.convertPinyin(data[m][key])] = [])
                parentAry[this.convertPinyin(data[m][key])].push(data[m]);
            } else {
                parentAry["Z"] || (parentAry["Z"] = []);
                parentAry["Z"].push(data[m]);
            }
        }
        return parentAry
    }
    convertPinyin(code: string): string {
        if (/[\u4e00-\u9fa5]|[\u3000-\u301e\ufe10-\ufe19\ufe30-\ufe44\ufe50-\ufe6b\uff01-\uffee]/.test(code) && !/[~!！@#￥%……&*@#\$%\^&\=*]+/g.test(code)) {
            var value = code.substr(0, 1);
            var name = this.translateCode(value);
            return name.toUpperCase().substr(0, 1);
        } else {
            return code.toString().substr(0, 1);
        }
    }
    translateCode(font): string {
        var i = 0;
        for (var name in pinyin) {
            i++;
            var t = pinyin[name];
            if (t.indexOf(font) != -1) {
                return name;
            }
        }
    }






}