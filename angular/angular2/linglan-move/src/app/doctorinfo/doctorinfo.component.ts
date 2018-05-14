import { Component, OnInit, TemplateRef } from '@angular/core';
import { Doctor, Hospital, User } from '../entity/entity'
import { Router, ActivatedRoute } from '@angular/router';
import { SystemService } from '../server/systemService.service';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { Cookie } from 'ng2-cookies';

import { imgUrl } from '../config'
@Component({
  selector: 'app-doctorinfo',
  templateUrl: './doctorinfo.component.html',
  styleUrls: ['./doctorinfo.component.scss'],
  providers: [SystemService],
})
export class DoctorinfoComponent implements OnInit {

  constructor(private sysService: SystemService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService) { }
  //创建一个空的医生对象
  doctorInfo = new Doctor();
  baseUrl = imgUrl;
  public modalRef: BsModalRef;

  about = new About();

  isShowCallBack: Boolean = true;

  sendParam = new sendParam_follow();
  userInfo = new User();
  userHospital = new Hospital();

  dingshi: any;

  ngOnInit() {
    //通过id获取医生
    //判断本地是否有token如果有不执行
    try {
      let token = JSON.parse(sessionStorage.getItem("session"));
      if (token.token) {
        this.bindDoctor();
      } else {
        this.getTokenByOpenId();
      }
    } catch (error) {
      this.getTokenByOpenId();
    }

    this.doctorInfo.userInfo = this.userInfo;
    this.doctorInfo.userHospital = this.userHospital;
  }


  getTokenByOpenId() {
    let openId = this.route.snapshot.queryParams["openId"]
    let id = this.route.snapshot.queryParams["id"];
    if (openId) {
      this.isShowCallBack = false;
      this.sysService.loginByOpenId(openId).then(args => {
        if (args.data) {
          sessionStorage.setItem("session", JSON.stringify({
            token: args.data.userAuthorization.value,
            openId: openId,
            userId: args.data.userId,
            userName: args.data.userName,
          }))
          this.bindDoctor();
        } else {
          location.href = "/login?openId=" + openId + "&redireactUrl=doctorinfo&doctorId=" + id;
        }
      })
    }
  }



  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  public closeFirstModal() {
    this.modalRef.hide();
    this.modalRef = null;
  }

  bindDoctor() {
    let me = this;
    this.sendParam.touserid = this.route.snapshot.queryParams["id"];
    this.sysService.getDoctorById(this.sendParam.touserid || "").then(args => {
      //读取列表
      if (args.status) {
        this.doctorInfo = args.data;
        this.sendParam.isFollow = Boolean(this.doctorInfo.follower);
        //判断按钮
        this.verdict();
        if (this.doctorInfo.about == 2) {
          this.dingshi = setTimeout(function () { me.bindDoctor() }, 60000);
        } else {
          clearTimeout(this.dingshi);
        }
      } else {
        this.alertError(args.err);
      }
    })
  }

  verdict(): void {
    if (this.doctorInfo) {
      switch (this.doctorInfo.about) {
        case 0:
          this.about.isDisable = false;
          this.about.name = "开通服务";
          this.about.url = "/servicetype/" + this.doctorInfo.userId + "?name=" + this.doctorInfo.userName;
          break;
        case 1:
          this.about.isDisable = false;
          this.about.name = "待付款";
          //跳代付款订单
          this.about.url = "/orderinfo/" + this.doctorInfo.orderId
          break;
        case 2:
          this.about.isDisable = true;
          this.about.name = "待审核";
          //需要处理路径
          this.about.url = "#";
          break;
        case 3:
          this.about.isDisable = false;
          this.about.name = "发起咨询(下载APP)";
          this.about.url = "http://res.rtf365.com/linglan/phoneDown.html?role=0&id=" + this.sendParam.touserid;

          break;
        case 4:
          this.about.isDisable = true;
          this.about.name = "用户已禁用";
          this.about.url = "#";
          break;
        default:

          break;
      }
    }

  }

  cancelFollow(): void {
    // 取消关注
    this.sysService.follow(this.sendParam).then(args => {
      //读取列表
      if (args.status) {
        // this.doctorInfo = args.data;
        this.closeFirstModal();
        this.sendParam.isFollow = false;
      } else {
        this.alertError(args.err);
      }
    })
  }
  followDoctor(): void {
    this.sysService.follow(this.sendParam).then(args => {
      //读取列表
      if (args.status) {
        // this.doctorInfo = args.data;
        this.sendParam.isFollow = true;
        this.alertError("关注成功");
      } else {
        this.alertError(args.err);
      }
    })
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

class sendParam_follow {
  touserid: string;
  isFollow: boolean = false;
}

class About {
  public url: string;
  public name: string;
  public isDisable: boolean;
}