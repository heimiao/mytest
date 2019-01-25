var websw = require('ws');
var fs = require('fs');
var ws = null,
	webskt = null;
var createWs = function(server) {
	ws = new websw.Server({
		server: server,
		//		verifyClient: false,
	});
	var sktList = null;
	ws.on('connection', function(webskt,req) {
		console.log("====客户端===");
		console.log(webskt.clients);
		console.log("====请求对象===");
		console.log(req);
		//sktList[webskt.protocol] = webskt;
		
		webskt.on('message', message);
		webskt.on('error', error)
		webskt.on('close', close)
		webskt.on('open', open)

	})

	function message(msg) {
		console.log("收到消息就给前端");
		console.log(msg);
		this.send(msg)
	}

	function error(msg) {
		console.log("错误消息");
	}

	function close(msg) {
		console.log("关闭");
	}

	function open(msg) {
		console.log("打开");
	}
}
module.exports = createWs;