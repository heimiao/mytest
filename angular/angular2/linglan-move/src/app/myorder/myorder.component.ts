import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SystemService } from '../server/systemService.service';
import { Pagination, Doctor, Order } from '../entity/entity'
import { imgUrl } from '../config'
import { Cookie } from 'ng2-cookies';
@Component({
  selector: 'app-myorder',
  templateUrl: './myorder.component.html',
  styleUrls: ['./myorder.component.scss'],
  providers: [SystemService]
})
export class MyorderComponent implements OnInit {
  constructor(private sysService: SystemService,
    private router: Router,
    private route: ActivatedRoute) { }
  baseUrl = imgUrl;
  pagination = new Pagination();
  orderList = new Array<any>();

  ngOnInit() {
    //读取表单列表
    //判断本地是否有token如果有不执行
    try {
      let token = JSON.parse(sessionStorage.getItem("session"));
      if (token.token) {
        this.readOrderList();
      } else {
        this.getTokenByOpenId();
      }
    } catch (error) {
      this.getTokenByOpenId();
    }
  }


  getTokenByOpenId() {
    let openId = this.route.snapshot.queryParams["openId"]
    // location.href = "/login?openId=" + openId + "&redireactUrl=mydoctor";
    this.sysService.loginByOpenId(openId).then(args => {
      if (args.data) {
        sessionStorage.setItem("session", JSON.stringify({
          token: args.data.userAuthorization.value,
          openId: openId,
          userId: args.data.userId,
          userName: args.data.userName,
        }))
        this.readOrderList();
      } else {
        location.href = "/login?openId=" + openId;
      }
    })
  }

  readOrderList(): void {
    this.pagination.size = 1000;
    let id = this.route.snapshot.params['id']
    let name = this.route.snapshot.params['name']
    this.sysService.getOrderList(Object.assign({}, this.pagination)).then(args => {
      if (args.status) {
        this.orderList = args.data.data;
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
