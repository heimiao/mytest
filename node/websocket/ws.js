var websw = require('ws');
var fs = require('fs');
var wss = null,
	webskt = null;
var createWs = function(server) {
	wss = new websw.Server({
		server: server,
		//		verifyClient: false,
	});
	var sktList = null;
	
	function sendImg(msg){
		console.log("====链接对象===");
		//console.log(wss.clients.set)
		console.log("====ws对象===");
		//console.log(webskt.WebSocket.protocol)
		var data=JSON.parse(msg);
		 wss.clients.forEach(function each(client) { 
		 	if (client.readyState === websw.OPEN&&client.protocol==data.target) {
		 		console.log(client)
		        client.send(JSON.stringify(data));
		     } 
		 });
	}
	
	
	wss.on('connection', function(webskt,req) {  
		webskt.on('message', message);
		webskt.on('error', error)
		webskt.on('close', close)
		webskt.on('open', open)  
	})

	function message(msg) {
		console.log("收到消息就给前端");
		console.log(msg);
		//this.send(msg)
		sendImg(msg)
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