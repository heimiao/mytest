var phone = (function() {
	function Phone() {
		this._default = {
			serverUrl: "192.168.171.12:5060",
			uri: "sip:1019@192.168.171.12:5060",
			pwd: "1234",
			wssUrl: new JsSIP.WebSocketInterface('wss://192.168.171.12:7443'),
			remoteNum: "sip:1001@192.168.171.12:5060",
		}
		this.ua = null;
	}

	Phone.prototype.register = function(args) {
		//注册
		var configuration = {
			sockets: [this._default.wssUrl],
			uri: args ? "sip:" + args + "@" + this._default.serverUrl : this._default.uri,
			password: this._default.pwd,
			register: true,
			session_timers: false
		};
		this.ua = new JsSIP.UA(configuration);
		this.ua.start();
		this.ua.on('connecting', function(data) {
			console.info("每个传输尝试连接触发。");
		});
		this.ua.on('connected', function(data) {
			console.info("传输连接建立时触发。");
		});
		this.ua.on('disconnected', function(data) {
			console.info("传输连接尝试（或自动重新尝试）失败时触发。");
		});
		this.ua.on('registered', function(data) {
			console.info("注册成功");
		});
		this.ua.on('unregistered', function(data) {
			console.info("未有注册");
		});
		this.ua.on('registrationFailed', function(data) {
			console.log("因注册失败而触发, ", data);
		});
		this.ua.on('registrationExpiring', function() {
			ua.register();
			console.log("注册过期");
		});
		this.ua.on('newRTCSession', function(data) {
			console.log("传入或传出的会话/呼叫触发");
			if(data.originator == "remote") {
				var msg = data.request.body
				console.log(data);
				data.session.on('peerconnection', function(datas) {
					datas.peerconnection.onaddstream = function(ev) {
						//this.remoteVideo.srcObject = ev.stream;
						console.log(ev.stream);
						doucment.getElementById("remoteVideo").srcObject=ev.stream;
						
					};
				});
			}
			
			if(data.originator == "local") {
				var msg = data.request.body
				console.log(data);
			}
		});
		this.ua.on('newMessage', function(data) {
			console.log("针对传入或传出的MESSAGE请求触发。");
			if(data.originator == "remote") {
				var msg = data.request.body
				console.log(msg);
				$("#showMessage").append("<div style='text-align:left'>" + msg + "</div>")
			}
			if(data.originator == "local") {
				var msg = data.request.body
				$("#showMessage").append("<div style='text-align:right'>" + msg + "</div>")
			}
		});
	}

	Phone.prototype.answerPhone = function() {
		//接通
	}
	Phone.prototype.refusalPhone = function() {
		//拒绝
	}
	Phone.prototype.callUpPhone = function(args) {
		//拨打电话
		if(!args) {
			alert("请输入有效被叫电话")
			return false;
		}
		if(!this.ua) {
			alert("请先注册你的电话")
			return false;
		}
		var eventHandlers = {
			'progress': function(e) {
				console.log('通话过程');
			},
			'failed': function(e) {
				console.log('呼叫失败');
			},
			'ended': function(e) {
				console.log('结束呼叫');
			},
			'confirmed': function(e) {
				console.log('呼叫确认');
			}
		};
		var options = {
			'eventHandlers': eventHandlers, //Object事件处理程序的可选项将被注册到每个呼叫事件。为每个要通知的事件定义事件处理
			'mediaConstraints': {
				'audio': true,
				'video': true
			},
			'mediaStream': null, //MediaStream 传送到另一端。
			/*'pcConfig':{
				//穿透nat所需的服务器
				'iceServers': [
			      { 'urls': ['stun:a.example.com', 'stun:b.example.com'] },
			      { 'urls': 'turn:example.com', 'username': 'foo', 'credential': ' 1234' }
			    ]
			},  */ //Object代表RTCPeerConnection RTCConfiguration
			//'rtcConstraints':null,   //Object 表示RTCPeerconnection约束
			//'rtcOfferConstraints':null,   //Object代表RTCPeerconnection的限制createOffer()。
			//'rtcAnswerConstraints':null,   //Object表示用于RTCPeerconnection约束createAnswer()
			//'extraHeaders':null,   //Array的Strings额外SIP头的INVITE请求。
			//'Anonymous':null,   // Boolean指示是否应该匿名完成呼叫。默认值是false
			//'sessionTimersExpires':null,   // Number （以秒为单位）默认的会话定时器间隔（默认值是90，不要设置一个较低的值）。
		};
		var session = this.ua.call('sip:' + args + '@' + this._default.serverUrl, options);
	}
	Phone.prototype.transferPhone = function() {
		//电话转接
	}
	Phone.prototype.terminate = function() {
		//电话挂断

	}
	Phone.prototype.sendMessage = function(args, msg) {
		if(!args) {
			alert("请输入有效电话")
			return false;
		}
		if(!this.ua) {
			alert("请先注册你的电话")
			return false;
		}
		//发送及时消息
		var options = {
			"contentType": "text/plain", //可选String代表正文的内容类型。默认text/plain。
			'eventHandlers': {
				'succeeded': function(data) {
					console.log("发送成功")
				},
				'failed': function(data) {
					console.log("发送失败")
				}
			},
			//'extraHeaders':null,//可选Array的每个MESSAGE请求都Strings带有额外的SIP头。
		};
		var session = this.ua.sendMessage('sip:' + args + '@' + this._default.serverUrl, msg, options);
	}

	Phone.prototype.openVide = function(my, your) {
		if(typeof my == "string") my = document.getElementById(my);
		if(typeof your == "string") this.remoteVideo = document.getElementById(your);
		var constraints = {
			audio: true,
			video: {
				faceMode: 'user'
			}
		};
		navigator.mediaDevices.getUserMedia(constraints).then(function success(stream) {
			my.srcObject = stream;
			document.body.addEventListener('click', function() {
				my.play();
			});
		}).catch(function(error) {
			onError({
				name: error.name,
				message: error.message
			});
		});
	}
	return new Phone();
})();