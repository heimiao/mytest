import { Component, OnInit } from '@angular/core';

import { SystemService } from '../server/systemService.service';
import { Pagination, Doctor, SortListObj } from '../entity/entity'
import { Util } from "../util"
import { imgUrl } from '../config'
import { Router, ActivatedRoute } from '@angular/router';
import { Cookie } from 'ng2-cookies';

@Component({
  selector: 'app-mydoctor',
  templateUrl: './mydoctor.component.html',
  styleUrls: ['./mydoctor.component.scss'],
  providers: [SystemService],
})
export class MydoctorComponent implements OnInit {

  constructor(
    private sysService: SystemService,
    private util: Util,
    private router: Router,
    private route: ActivatedRoute) { }
  //new 分页对象
  pagination = new Pagination();
  doctorListObj = new SortListObj();
  doctorObjList = new DoctorObjList();
  baseUrl = imgUrl;
  zixun: boolean = true;
  guanzhu: boolean = true;

  ngOnInit() {
    // 初始化方法 
    try {
      let token = JSON.parse(sessionStorage.getItem("session"));
      if (token.token) {
        this.readList();
      } else {
        this.getTokenByOpenId();
      }
    } catch (error) {
      this.getTokenByOpenId();
    }


  }

  getTokenByOpenId() {
    let openId = this.route.snapshot.queryParams["openId"]
    this.sysService.loginByOpenId(openId).then(args => {
      if (args.data) {
        sessionStorage.setItem("session", JSON.stringify({
          token: args.data.userAuthorization.value,
          openId: openId,
          userId: args.data.userId,
          userName: args.data.userName,
        }))
        this.readList();
      } else {
        location.href = "/login?openId=" + openId;
      }
    })
  }


  // 查询列表项目
  readList(): void {
    this.pagination.size = 1000;
    this.doctorObjList = new DoctorObjList();
    this.sysService.myDoctorList().then(args => {
      if (args.status) {
        this.doctorObjList = args.data;
        if (this.doctorObjList.doctors.length == 0)
          this.zixun = false;
        if (this.doctorObjList.followers.length == 0)
          this.guanzhu = false;
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

class DoctorObjList {
  public doctors: Array<Doctor>;
  public followers: Array<Doctor>;
}