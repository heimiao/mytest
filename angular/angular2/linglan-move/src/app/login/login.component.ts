import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { Login, System } from '../entity/entity';

import { SystemService } from '../server/systemService.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Util } from '../util';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { Subscription } from 'rxjs/Subscription';

import { Config } from '../config';
import { ValidatorsContro } from '../validateFactory';
import { Cookie } from 'ng2-cookies';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [SystemService],
})

export class LoginComponent implements OnInit {

  constructor(private fb: FormBuilder, private sysService: SystemService,
    private util: Util,
    private modalService: BsModalService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }
  //
  public modalRef: BsModalRef;
  public subscriptions: Subscription[] = [];
  public messages: string[] = [];

  system: System = new System();
  login = new Login();
  loginForm: FormGroup;

  ngOnInit() {
    //通过openid看是否需要自动登录
    this.openIdLogin();
    // 随机字符串 
    this.buildForm();
  }

  openIdLogin(): void {
    //通过openid登录
    let openId = this.route.snapshot.queryParams['openId'] || "";
    let redireactUrl = this.route.snapshot.queryParams['redireactUrl'] || ""
    let doctorId = this.route.snapshot.queryParams['doctorId'] || "";
    let url: string = "/doctorlist";
    if (openId) {
      this.sysService.loginByOpenId(openId).then(args => {
        if (args.data) {
          this.setLocalInfo(this.login.openId, args.data.userId, args.data.userAuthorization.value, args.data.userName);

          if (redireactUrl) {
            url = "/" + redireactUrl + "?id=" + doctorId;
          }

          location.href = url;
          // this.router.navigate([url]);
        }
      })
    }
  }

  submitLogin() {
    let redireactUrl = this.route.snapshot.queryParams['redireactUrl'] || ""
    let doctorId = this.route.snapshot.queryParams['doctorId'] || "";
    let url: string = "/doctorlist";
    if (this.validateForm()) {
      // 提交表单
      this.login.userName = this.loginForm.get("userName").value;
      this.login.userMobile = this.loginForm.get("userMobile").value;
      this.login.vCode = this.loginForm.get('vCode').value;
      this.login.openId = this.route.snapshot.queryParams['openId'];
      // this.route.paramMap.get("openId").toString();
      this.sysService.submitLogin(this.login).then(args => {
        if (args.status) {
          this.setLocalInfo(this.login.openId, args.data.userId, args.data.userAuthorization.value, args.data.userName);
          // this.router.navigate(['/doctorlist']);
          if (redireactUrl) {
            url = "/" + redireactUrl + "?id=" + doctorId;
          }
          location.href = url;
        } else {
          this.alertError(args.err);
        }
      })

      // 重置表单
      this.loginForm.reset();
    }
  }


  //设置本信息
  setLocalInfo(openId: string, userId: string, token: string, userName: string): void {
    sessionStorage.setItem("session", JSON.stringify({
      token: token,
      openId: openId,
      userName: userName,
      userId: userId
    }));

    /*  Cookie.set("cookie", JSON.stringify({
       token: token,
       openId: openId,
       userId: userId
     })); */
  }


  // 创建表单模型
  buildForm(): void {
    // 创建一个formgroup组
    this.loginForm = this.fb.group({
      userName: [
        '', [
          Validators.required,
        ]
      ],
      userMobile: [this.login.userMobile, [
        Validators.required,
        Validators.maxLength(15),
        ValidatorsContro(/^1[34578]\d{9}$/)
      ]],
      vCode: [this.login.vCode, [Validators.required]],
      picCode: "",
      agreement: [this.login.agreement]
    });
    // 表单监听
    this.loginForm.valueChanges.subscribe(args => {
      // console.log(args);
    })
    this.loginForm.get("userMobile").valueChanges.subscribe(args => {
      if (this.loginForm.get("userMobile").valid) {
        this.system.sendPicCode.isSend = false;
      } else {
        this.system.sendPicCode.isSend = true;
      }
    })
    this.loginForm.get("picCode").valueChanges.subscribe(args => {
      if ((args || "").toString().length == 4) {
        // this.closeFirstModal();
        this.modalRef.hide();
        this.validateCode();
        this.messages = [];
        this.unsubscribe();
      }
    })
  }

  getToken(): void {
    this.sysService.getToken(this.system)
      .then(
      args => {
        this.system.ic = args.data;
        this.system.imgUrl = Config.getCodePic + '?uc=' + this.system.uc + '&fr=0&ty=2&ic=' + args.data;
      },
      error => {
        console.log(error);
      }
      );
  }

  get name() { return this.loginForm.get('userName'); }

  // 刷新验证码
  refreshCode(): void {
    this.getRandomStr();
    this.getToken();
  }

  public alerts: any = [];
  public alertError(args = '未知错误'): void {
    this.alerts.push({
      type: 'info',
      msg: `${args}`,
      timeout: 3000
    });
  }

  // 
  public openModal(template: TemplateRef<any>) {
    this.messages = [];
    this.subscriptions.push(this.modalService.onShow.subscribe((reason: string) => {
      this.refreshCode();
      this.messages.push(`onShow event has been fired`);
    }));
    this.subscriptions.push(this.modalService.onHidden.subscribe((reason: string) => {
      this.messages.push(`onHidden event has been fired${reason ? ', dismissed by ' + reason : ''}`);
      this.unsubscribe();
      this.validateCode();
    }));
    this.modalRef = this.modalService.show(template);
  }


  // 验证验证码
  validateCode(): void {
    let obj = this.loginForm.get('picCode');
    this.system.icode = String(obj.value);
    if (this.system.icode) {
      if (this.loginForm.get("userMobile").valid && this.loginForm.get("userMobile").value != "" && this.loginForm.get("userMobile").value != null) {
        this.sysService.verifyCode(this.system).then(args => {
          // 响应
          if (args) {
            // 调用手机验证
            this.system.mb = this.loginForm.get("userMobile").value;
            this.sysService.sendPhoneCode(this.system).then(args => {
              this.alertError('发送成功！')
            })
            // 倒计时
            this.countDown();
            this.system.icode = "";
          } else {
            this.alertError(args.err || '无效验证码或已过期');
          }
        })
      } else {
        this.alertError('电话不能为空且必须为正确格式');
      }
    } else {
      this.alertError('请填写验证码');
    }
    this.loginForm.patchValue({
      picCode: ""
    });
  }

  // 校验表单
  validateForm(): Boolean {
    let returnBool = false;
    let userNameObj = this.loginForm.get("userName");
    let phoneObj = this.loginForm.get("userMobile");
    let vCode = this.loginForm.get("vCode");
    if (this.loginForm.get("agreement").value) {
      //遵守协议之后
      returnBool = true
    } else {
      returnBool = false
      this.alertError("请同意灵兰随诊用户协议");
    }
    return returnBool;
  }

  // 倒计时
  timeOut: any;
  countDown(): void {
    if (this.system.sendPicCode.countDown < 0) {
      this.system.sendPicCode.countDown = 60
      this.system.sendPicCode.sendStr = "发送验证码"
      this.system.sendPicCode.isSend = false;
      setTimeout(this.timeOut);
    } else {
      this.system.sendPicCode.isSend = true;
      this.system.sendPicCode.sendStr = "发送(" + this.system.sendPicCode.countDown + "s)";
      this.system.sendPicCode.countDown--;
      this.timeOut = setTimeout(() => {
        this.countDown()
      }, 1000);
    }
  }

  public unsubscribe() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }

  getRandomStr(): void {
    // 获取随机字符串
    this.system.uc = this.util.getRandomStr();
  }

}
