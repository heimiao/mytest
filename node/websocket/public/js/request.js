/**
 * Created by e2670 on 2017/10/21.
 * Http请求工具类
 */

var FwHttp= {
	/**
     * 基于XMLHttpRequest封装
     */
	/**
     * get请求异步获取
     * @param url
     * @param callSuc
     * @param callErr
     * exam: FwHttp.getAsync(url,callbackSuccess,callbackError);
     */
	getAsync:function (url, callSuc, callErr) {
		var xmlhttp=new XMLHttpRequest();
		xmlhttp.open("GET", url, true);
		xmlhttp.send();
		// 异步方法回调
		xmlhttp.onreadystatechange=function () {
			if (xmlhttp.readyState==4 && xmlhttp.status==200) {
				callSuc(xmlhttp.responseText);
			}
			else {
				callErr(xmlhttp.responseText);
			}
		}
	}
	,
	/**
     * get请求同步获取
     * @param url
     * exam:var res = FwHttp.getSync(url);
     */
	getSync:function (url) {
		var xmlhttp=new XMLHttpRequest();
		xmlhttp.open("GET", url, false);
		xmlhttp.send();
		return xmlhttp.responseText;
	}
	,
	/**
     * post请求异步提交
     * @param url
     * @param dataStr
     * @param contentType
     * @param callSuc
     * @param callErr
     */
	postAsync:function (url, dataStr, contentType, callSuc, callErr) {
		var xmlhttp=new XMLHttpRequest();
		xmlhttp.open("POST", commitUrl, true);
		xmlhttp.setRequestHeader("Content-type", contentType);
		xmlhttp.send(dataStr);
		xmlhttp.onreadystatechange=function () {
			if (xmlhttp.readyState==4 && xmlhttp.status==200) {
				callSuc(xmlhttp.responseText);
			}
			else {
				callErr(xmlhttp.responseText);
			}
		}
	}
	,
	/**
     * post请求同步提交
     * @param url
     * @param dataStr
     * @param contentType
     * @returns {string}
     */
	postSync:function (url, dataStr, contentType) {
		var xmlhttp=new XMLHttpRequest();
		xmlhttp.open("POST", commitUrl, false);
		xmlhttp.setRequestHeader("Content-type", contentType);
		xmlhttp.send(dataStr);
		return xmlhttp.responseText;
	}
	,
	/**
     * post请求异步提交
     * @param url
     * @param dataStr
     * @param callSuc
     * @param callErr
     * FwHttp.postJsonAsync(url,jsonStr,callbackSuccess,callbackError);
     */
	postJsonAsync:function (url, dataStr, callSuc, callErr) {
		FwHttp.postAsync(url, dataStr, "application/json", callSuc, callErr);
	}
	,
	/**
     * post请求同步提交
     * @param url
     * @param dataStr
     * @returns {string}
     * exam: var res = FwHttp.postJsonSync(url,jsonStr);
     */
	postJsonSync:function (url, dataStr) {
		return FwHttp.postSync(url, dataStr, "application/json");
	}
}

;