var baseUrl="192.168.0.102"
//var baseUrl="172.20.10.5"
var phone = (function() {
	function Phone() {
		this._default = {
			serverUrl: baseUrl+":5060",
			//serverUrl: "123.58.240.201:5060",8817879518517
			uri: "sip:1000@"+baseUrl+":5060",
			pwd: "1234",
			wssUrl: new JsSIP.WebSocketInterface('wss://'+baseUrl+':7443'),//7443
			remoteNum: "sip:1001@"+baseUrl+":5060",
			trace:true,
		}
		this.constraints = {
			audio: true,
			video: false,
		}
		this.localStream = null;
		this.ua = null;
		this.incomingSession = null;
		this.rtcSession = null;
		this.outgoingSession = null;
		//初始化电话页面
		this.init();
	}
	Phone.prototype.init = function() {
		//获取本地视频
		this.localAudio = document.getElementById("localAudio");
		this.remoteAudio = document.getElementById("remoteAudio");
		this.localVideo = document.getElementById("localVideo");
		this.remoteVideo = document.getElementById("remoteVideo");

	}
	Phone.prototype.register = function(args) {
		//注册
		var configuration = {
				sockets: [this._default.wssUrl],
				uri: args ? "sip:" + args + "@" + this._default.serverUrl : this._default.uri,
				password: this._default.pwd,
				register: true,
				session_timers: false
			},
			me = this;
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
			//this.ua.register();
			console.log("注册过期");
		});

		this.ua.on('newRTCSession', function(data) {
			console.log("传入或传出的会话/呼叫触发");
			/*this.originator = data.originator;
			this.request = data.request;
			this.rtcSession = data.session;*/
			console.log(data);
			if(data.originator == "remote") {
				me.incomingSession = data.session;
				var bool = confirm("来电了。。。确定接听吗？")
				if(bool) {
					me.incomingSession.answer({
						'mediaConstraints': me.constraints,
						'mediaStream': null, //me.localStream
					});
				} else {
					me.incomingSession.terminate();
				}
			} else {
				me.outgoingSession = data.session;
			}

			data.session.on('connecting', function(data) {
				me.rtcSession = me.outgoingSession;
				outgoingSession = null;
				console.log("在本地媒体流加入RTCSession之后，在ICE采集开始之前触发初始INVITE请求或“200 OK”响应传输--Connection", data);
			});

			data.session.on('sdp', function(data) {
				console.info('在将远程SDP传递给RTC引擎之前以及在发送本地SDP之前触发--sdp', data);
				//data.sdp = data.sdp.replace('UDP/TLS/RTP/SAVPF', 'RTP/SAVPF');
				//console.info('onSDP, changed sdp - ', data.sdp);
			});
			data.session.on('sending', function(data) {
				console.log("在发送初始INVITE之前触发（仅用于拨出电话）--sending" + data);
			});

			data.session.on('progress', function(data) {
				if(data.originator == 'remote') {
					console.log(".在接收或生成对INVITE请求的100 SIP类别响应（> 100）时触发--progress", data);
				}
			});

			data.session.on('accepted', function(data) {
				console.info('通话被接受时  200收/发 - accepted', data);
				if(data.originator == 'remote' && me.rtcSession == null) {
					me.rtcSession = me.incomingSession;
					me.incomingSession = null;
				}
				console.log(me.rtcSession);
			});

			data.session.on('confirmed', function(data) {
				console.info('通话确认--onConfirmed - ', data);
				if(data.originator == 'remote' && me.rtcSession == null) {
					me.rtcSession = me.incomingSession;
					me.incomingSession = null;
				}
				peerconnection = me.rtcSession.connection;
				localStream = peerconnection.getLocalStreams()[0];
				stream = peerconnection.getRemoteStreams()[0];
				if(stream) {
					me.remoteAudio.srcObject = stream;
				}
			});

			data.session.on('peerconnection', function(data) {
				console.log("一旦底层RTCPeerConnection被创建，就会被触发。", data);
				data.peerconnection.onaddstream = function(ev) {
					console.info('onaddstream from remote - ', ev);
					console.log(me.remoteAudio);
					//me.remoteAudio.src = ev.stream;
					document.getElementById("remoteAudio").srcObject = ev.stream;

				};
			});

			data.session.on('ended', function(data) {
				console.info('已建立的通话结束时触发--ended - ', data);
			});

		});

		this.ua.on('newMessage', function(data) {
			console.log("针对传入或传出的MESSAGE请求触发。", data);
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
		//打开本地视频流
		//		this.openVide();
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
			'mediaConstraints': this.constraints,
			'mediaStream': null, //this.localStream, //MediaStream 传送到另一端。
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
		this.outgoingSession = this.ua.call('sip:' + args + '@' + this._default.serverUrl, options);
	}

	Phone.prototype.transferPhone = function() {
		//电话转接
	}
	Phone.prototype.hangup = function() {
		//电话挂断
		this.ua.terminateSessions();
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

	Phone.prototype.getStream = function() {
		return navigator.mediaDevices.getUserMedia(this.constraints).then(function success(stream) {
			this.localAudio.srcObject = stream;
			//this.localVideo.srcObject = stream;
			this.localStream = stream;
		}).catch(function(error) {
			console.error({
				name: error.name,
				message: error.message
			});
		});
	}
	return new Phone();
})();