import _ from 'lodash';
import Fetchapi from '../util/fetch-api';

export default class AdviserActions {
  static onTestAdd(num) {
    return {
      type: 'TEST::add',
      payload: num + 1,
    };
  }

  static onTestAdd2(num) {
    return {
      type: 'TEST::add2',
      payload: num + 1,
    };
  }

  // 进入投顾主页时，初始化左边box数据
  static leftboxInit(obj) {
    var j = { org_id: 'P1000314', sort: '1'};
    return (dispatch) => {
      Fetchapi.newPost(
        'http://139.196.141.171:8080/api/org/manage_ability/table', j
      ).then(
          msg => {
            console.log('返回数据', msg);
            let backmsg = [];
            backmsg = msg.feedback;

            dispatch({
              type: 'TEST::testFetch',
              payload: backmsg,
            });
          }
        ).catch(() => {
          message.info('网络错误，请重试');
        });
    };
  }
}
