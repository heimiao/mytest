import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SystemService } from '../server/systemService.service';

import { ServiceType } from '../entity/entity'
@Component({
  selector: 'app-servicetype',
  templateUrl: './servicetype.component.html',
  styleUrls: ['./servicetype.component.scss'],
  providers: [SystemService]
})
export class ServicetypeComponent implements OnInit {

  constructor(
    private sysService: SystemService,
    private router: Router,
    private route: ActivatedRoute) { }
  ServiceTypeAry = new Array<ServiceType>();

  sendParam = new SendParam();

  ngOnInit() {
    //调用服务列表
    this.getServiceById();
  }

  getServiceById(): void {
    let id = this.route.snapshot.params['id']
    let name = this.route.snapshot.queryParams["name"]
    let patientName = JSON.parse(sessionStorage.getItem("session")).userName || "";
    this.sendParam.applyRemark = name + '您好，我是' + patientName + '，希望您能作为我的随诊医生';
    // 通过医生id获取服务
    this.sysService.getServiceById(id || "").then(args => {
      if (args.status) {
        this.ServiceTypeAry = args.data;
      } else {
        this.alertError(args.err);
      }
    })
  }

  //  患者申请服务
  applyService(): void {
    let id = this.route.snapshot.params['id']
    this.sendParam.doctorId = id || "";
    this.sysService.applyService(this.sendParam).then(args => {
      if (args.status) {
        if (args.data.payResult) {
          //微信支付
          this.weixinPay(args.data.payResult);
        } else {
          //0元支付args.payResult.doctorId 
          location.href = "/doctorinfo?id=" + args.data.applyResult.doctorId;
        }
      } else {
        this.alertError(args.err);
      }
    })
  }

  weixinPay(args): void {
    // 微信支付
    if (typeof WeixinJSBridge == "undefined") {
      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', this.responetWeixin, false);
        document.addEventListener('onWeixinJSBridgeReady', this.responetWeixin);
      } /* else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', this.responetWeixin);
        document.attachEvent('onWeixinJSBridgeReady', this.responetWeixin);
      } */
    } else {
      this.responetWeixin(args);
    }
  }

  responetWeixin(args): void {
    const me = this;
    if (WeixinJSBridge) {
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
          "appId": args.appId, //公众号名称，由商户传入     
          "timeStamp": args.timeStamp, //时间戳，自1970年以来的秒数     
          "nonceStr": args.nonceStr, //随机串     
          "package": args.package,
          "signType": "MD5", //微信签名方式：     
          "paySign": args.sign, //微信签名 
        },
        function (res) {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            me.sysService.paySuccess(args.package.split("=")[1]).then(
              args => {
                if (args.data) {
                  alert("支付成功");
                  location.href = "/doctorinfo?id=" + me.route.snapshot.params['id'];
                } else {
                  alert(JSON.stringify(args));
                }
              });
          } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
            alert("支付取消");
            location.href = "/doctorinfo?id=" + me.route.snapshot.params['id'];
          } else {
            alert("支付失败");
            location.href = "/doctorinfo?id=" + me.route.snapshot.params['id'];
          } // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。 
        }

      );
    } else {
      alert("必须在微信中打开，进行支付");
    }
  }


  public alerts: any = [];
  public alertError(args = '未知错误'): void {
    this.alerts.push({
      type: 'info',
      msg: `${args}`,
      timeout: 3000
    });
  }
}

class SendParam {
  public applyRemark: string;
  public serviceCode: string;
  public doctorId: string;
}

declare var WeixinJSBridge: any;