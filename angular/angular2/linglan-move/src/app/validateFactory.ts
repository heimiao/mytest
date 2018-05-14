import { Validators, ValidatorFn, AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { SystemService } from './server/systemService.service'

export function ValidatorsContro(str: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        // 获取控件的值 
        const forbidden = str.test(control.value);
        // 返回对象类型
        return forbidden ? null : { 'forbiddenName': { value: control.value } };
    };
}

export function AsyncValidatorsContro(str: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        // 获取控件的值
        const forbidden = str.test(control.value);
        // 返回对象类型
        return forbidden ? null : { 'forbiddenName': { value: control.value } };
    };
}

/* 
export function validCode(args: SystemService): AsyncValidatorFn {
  return (cotr: AbstractControl): Promise<ValidationErrors> => {
        const icode = cotr.value;
        return args.verifyCode(icode).then((datas) => {
            return (!datas.status) ? { "code": datas.err } : (datas.data) ? null : { "code": "验证码不正确" };
        })
    } 
   
}*/