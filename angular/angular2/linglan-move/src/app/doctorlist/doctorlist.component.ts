import { Component, OnInit } from '@angular/core';

import { SystemService } from '../server/systemService.service';
import { Pagination, Doctor, SortListObj } from '../entity/entity';
import { Util } from "../util";
import { imgUrl } from '../config';
import { Router, ActivatedRoute } from '@angular/router';
import { Cookie } from 'ng2-cookies';
@Component({
  selector: 'app-doctorlist',
  templateUrl: './doctorlist.component.html',
  styleUrls: ['./doctorlist.component.scss'],
  providers: [SystemService],
})
export class DoctorlistComponent implements OnInit {

  constructor(
    private sysService: SystemService,
    private util: Util,
    private router: Router,
    private route: ActivatedRoute) { }
  //new 分页对象
  pagination = new Pagination();
  doctorListObj = new SortListObj();
  doctorList = new Array<any>();
  searhParm = new Param();
  baseUrl = imgUrl;
  get paramName() { return this.searhParm }
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
          userName:args.data.userName,
        }))
        this.readList();
      } else {
        location.href="/login?openId="+openId;
      }
    })
  }
  // 查询列表项目
  readList(): void {
    this.pagination.size = 1000;
    this.doctorList = [];
    this.sysService.getDoctorList(Object.assign({}, this.searhParm, this.pagination)).then(args => {
      if (args.status) {
        let ary: Array<any> = args.data.data;
        if (ary.length > 0) {
          this.doctorListObj = this.util.conversion(ary);
          for (let item in this.doctorListObj) {
            this.doctorList.push({ name: item, value: this.doctorListObj[item] });
          }
          this.doctorList.sort((a, b) => {
            if (a.name > b.name) {
              return 1
            } else if (a.name < b.name) {
              return -1
            } else {
              return 0;
            }
          })
        }
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

  scollDiv($event): void {
    let clientH = event.srcElement.clientHeight;
    let scrollH = event.srcElement.scrollHeight;
    let scrollTop = event.srcElement.scrollTop;
    // console.log(clientH, scrollH, scrollTop, (scrollH - clientH));
    //当滚动到底部的时候加载下一页数据
    if (scrollTop >= (scrollH - clientH)) {
      //当滚动高度大于可滚动值的时候加载数据

    }
  }
}

class Param {
  userName: String;
}