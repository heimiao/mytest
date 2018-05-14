import reqwest from 'reqwest';

export default class ApiService {
  static newPost(url, bodyObj = {}) {

    // 这里是不需要登录，不需要权限都能访问的接口
    return reqwest({
      url,
      method: 'post',
      contentType: 'application/json',
      crossOrigin: true,
      data: JSON.stringify(bodyObj),
      dataType: 'json',
    });
  }
}
