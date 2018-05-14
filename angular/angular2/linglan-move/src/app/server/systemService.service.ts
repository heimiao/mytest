import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Login } from '../entity/entity';

import { Config } from '../config';
import { Util } from '../util';
import { stringify } from "query-string"
// 定义返回类型

interface Restult {
  results: {};
}

interface RestultList {
  data: {}
  err: ""
  errcode: ""
  status: 0
  t: 19
}
@Injectable()
export class SystemService {
  constructor(private http: HttpClient, private util: Util, ) { }
  // 登录
  /*login(login: any): Promise<any> {
    return this.http.post(Config.login, login)
      .toPromise();
    .then(this.extractData)
    .catch(this.handleError_prms);
  } */
  // 获取token
  getToken(system: any): Promise<any> {
    // 获取随机字符串
    return this.http.get<Restult>(Config.getToken + '?uc=' + system.uc + '&fr=' + system.fr + '&ty=' + system.ty)
      .toPromise();
  }
  // 校验验证码
  verifyCode(args: any): Promise<any> {
    let boole = false;
    return this.http.post(Config.verifyCode, args)
      .toPromise().then((args: Response | any) => {
        if (args.status) {
          boole = true
        } else {
          boole = false
        }
        return boole;
      });
  }
  // 发送手机验证码
  sendPhoneCode(system: any): Promise<any> {
    return this.http.get(Config.sendMsg + "?uc=" + system.uc + "&mb=" + system.mb + "&ty=" + system.ty + "&ic=" + system.ic).toPromise()
      .then(args => {
        return args || {};
      })
  }
  // 登录及注册
  submitLogin(login: any): Promise<any> {
    return this.http.post(Config.reglogin, login).toPromise()
      .then(args => {
        return args || {};
      })
  }

  // 遍历医生库
  getDoctorList(param: any): Promise<any> {
    return this.http.get<RestultList>(Config.getDoctorList, {
      params: new HttpParams({ fromString: stringify(param) }),
    }).toPromise();
  }

  myDoctorList(): Promise<any> {
    return this.http.get<RestultList>(Config.myDoctorList).toPromise();
  }

  // 通过id获取医生详细
  getDoctorById(param: string): Promise<any> {
    return this.http.get<RestultList>(Config.getDoctorById + "/" + param).toPromise();
  }
  // 通过医生id获取医生的服务列表
  getServiceById(param: string): Promise<any> {
    return this.http.get<RestultList>(Config.getServiceById + "/" + param).toPromise();
  }

  // 患者申请服务
  applyService(sendParam: any): Promise<any> {
    return this.http.post<RestultList>(Config.applyService, sendParam).toPromise();
  }

  // 我的订单列表
  getOrderList(param: any): Promise<any> {
    return this.http.get<RestultList>(Config.getMyOrderList, {
      params: new HttpParams({ fromString: stringify(param) }),
    }).toPromise();
  }

  // 订单详细
  getOrderById(param: string): Promise<any> {
    return this.http.get<RestultList>(Config.getOrderById + "/" + param).toPromise();
  }
  // 取消订单
  cancelOrder(param: string): Promise<any> {
    return this.http.get<RestultList>(Config.cancelOrder + "/" + param).toPromise();
  }
  //关注
  follow(param: any): Promise<any> {
    return this.http.post(param.isFollow ? Config.unfollow : Config.follow, param).toPromise();
  }

  // 登录及注册
  loginByOpenId(openId: any): Promise<any> {
    return this.http.get<RestultList>(Config.loginByOpenId + "/" + openId).toPromise();
  }

  // 支付
  pay(sendParam: any): Promise<any> {
    return this.http.post<RestultList>(Config.pay, sendParam).toPromise();
  }

  paySuccess(prepayid: string): Promise<any> {
    return this.http.post(Config.paySuccess, { prepayid: prepayid }).toPromise();
  }

  //订单支付
  orderPay(sendParam: any): Promise<any> {
    return this.http.post(Config.orderPay, sendParam).toPromise();
  }


}
