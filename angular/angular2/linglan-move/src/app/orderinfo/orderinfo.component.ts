import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SystemService } from '../server/systemService.service';
import { Order, Apply, Doctor, Hospital, User } from '../entity/entity';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { imgUrl } from '../config'
@Component({
  selector: 'app-orderinfo',
  templateUrl: './orderinfo.component.html',
  styleUrls: ['./orderinfo.component.scss'],
  providers: [SystemService]
})
export class OrderinfoComponent implements OnInit {


  constructor(private sysService: SystemService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService) { }

  public modalRef: BsModalRef;

  orderInfo = new Order();
  doctorInfo = new Doctor();
  hospital = new Hospital();
  userInfo = new User();
  applyInfo = new Apply();

  sendParam = new SendParam();


  baseUrl = imgUrl;
  ngOnInit() {
    //查询订单详细
    this.getOrderById();

    this.orderInfo.apply = this.applyInfo;
    this.doctorInfo.userHospital = this.hospital;
    this.doctorInfo.userInfo = this.userInfo;
    this.orderInfo.doctor = this.doctorInfo;
  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  public closeFirstModal() {
    this.modalRef.hide();
    this.modalRef = null;
  }

  getOrderById(): void {
    //获取订单id
    let id = this.route.snapshot.params['id']
    this.sysService.getOrderById(id || "").then(args => {
      if (args) {
        this.orderInfo = args.data;
        this.sendParam.orderId = id;
        this.sendParam.payType = "5";
      } else {
        this.alertError(args.err);
      }
    })
  }

  cancelOrder(): void {
    let id = this.route.snapshot.params['id']
    this.sysService.cancelOrder(id || "").then(args => {
      if (args) {
        this.closeFirstModal();
        this.router.navigate(['/myorder']);
      } else {
        this.alertError(args.err);
      }
    })
  }


  goPay(): void {
    this.sysService.orderPay(this.sendParam).then(args => {
      if (args.status) {
        if (args.data) {
          //微信支付
          this.weixinPay(args.data);
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
      }
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
            me.sysService.paySuccess(args.package.split("=")[1]).then(args => {
              if (args.data) {
                alert("支付成功");
                location.href = "/doctorinfo?id=" + me.orderInfo.doctor.userId;
              }
            });
          } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
            alert("支付取消");
            location.href = "/doctorinfo?id=" + me.orderInfo.doctor.userId;
          } else {
            alert("支付失败");
            location.href = "/doctorinfo?id=" + me.orderInfo.doctor.userId;
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
  public orderId: string;
  public payType: string;
}

declare var WeixinJSBridge: any;