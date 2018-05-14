export class Login {
    public id: number;
    public userName: string;
    public userMobile: string;
    public vCode: string;
    public openId: string;
    public agreement: boolean = true;
}
// 系统变量
export class System {
    public token: string;
    public ic?: string;
    public uc?: string;
    public imgUrl: string;
    public fr?: number = 0;
    public ty?: number = 2;
    public icode?: String;
    public sendPicCode?: SendPicCode = new SendPicCode();
    public mb?: string;
    public code: Array<number>;
    public other?: string;
}
class SendPicCode {
    isSend: boolean = true;
    sendStr: string = '发送验证码';
    countDown: number = 60;
}

export class Pagination {
    page: Number = 1;
    size: Number = 15;
}

export class SortListObj {
    public A: Array<Doctor>;
    public B: Array<Doctor>;
    public C: Array<Doctor>;
    public D: Array<Doctor>;
    public E: Array<Doctor>;
    public F: Array<Doctor>;
    public G: Array<Doctor>;
    public H: Array<Doctor>;
    public I: Array<Doctor>;
    public J: Array<Doctor>;
    public K: Array<Doctor>;
    public L: Array<Doctor>;
    public M: Array<Doctor>;
    public N: Array<Doctor>;
    public O: Array<Doctor>;
    public P: Array<Doctor>;
    public Q: Array<Doctor>;
    public R: Array<Doctor>;
    public S: Array<Doctor>;
    public T: Array<Doctor>;
    public U: Array<Doctor>;
    public V: Array<Doctor>;
    public W: Array<Doctor>;
    public X: Array<Doctor>;
    public Y: Array<Doctor>;
    public Z: Array<Doctor>;
}

export class Doctor {
    public userName: String;
    public userId: String;
    public niceName: String;
    public headUrl: String;
    public status: String;
    public about: Number;
    public userSex: Number;
    public follower: Number;
    public orderId: String;
    public userHospital: Hospital;
    public userInfo: User;



}
export class Hospital {
    public userHospitalId: String;
    public userHospitalName: String;
    public userDepartmentId: String;
    public userDepartmentName: String;
}
export class User {
    public userSex: String;
    public userAge: String;
    public userRemark: String;
    public userTitleId: String;
    public userTitleName: String;
    public userCertificateNum: String;
    public userBadgesUrl: String;
    public userHonour: String;
}

export class ServiceType {
    public code: String;
    public value: String;
    public status: String;
    public name: String;
}

export class Order {
    public orderId: String;
    public orderSum: Number;
    public orderPaidSum: Number;
    public orderPaySum: Number;
    public orderSubsidy: Number;
    public orderStatus: Number;
    public expdtm: Number;
    public creatDtm: number;
    public apply: Apply;
    public doctor: Doctor;

}

export class Apply {
    public orderId: String;
    public applyId: String;
    public orderSum: Number;
    public orderStatus: Number;
    public applyMoney: number;
    public applyStatus: Number;
    public applyType: Number;
    public applyrSubsidy: Number;
    public assistantId: Number;
    public creatDtm: number;
    public applyRemark: String;
    public serviceCode: String;
    public serviceName: String;
    public upDateDtm: String;
}
