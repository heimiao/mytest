var phone = (function() {
	function Phone() {
		this._default = {
			serverUrl: "192.168.171.12:5060",
			uri: "sip:1019@192.168.171.12:5060",
			pwd: "1234",
			wssUrl: new JsSIP.WebSocketInterface('wss://192.168.171.12:7443'),
			remoteNum: "sip:1001@192.168.171.12:5060",
		}
		this.constraints = {
			audio: true,
			video: false,
		}
		this.localStream = null;
		this.ua = null;
		this.incomingSession = null;
		this.currentSession = null;
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
			//this.ua.register();
			console.log("注册过期");
		});
		this.ua.on('newRTCSession', function(data) {
			console.log("传入或传出的会话/呼叫触发");
			if(data.originator == "remote") {
				//远程呼入
				this.incomingSession = data.session;
				data.session.answer({
					'mediaConstraints': this.constraints,
					'mediaStream': this.localStream
				});
				var remoteCall = data.request.headers.From['0'].raw;
				var remotePhone = this.incomingSession.direction
				console.log("呼叫描述");
				console.log(this.incomingSession);
			}
			if(data.originator == "local") {
				var msg = data.request.body
				this.outgoingSession = data.session;
				this.outgoingSession.on('connecting', function(data) {
					this.currentSession = this.outgoingSession;
					outgoingSession = null;
				});

				console.log(data);
			}
			data.session.on('accepted', function(data) {
				console.info('通话被接受时  2XX收/发 - accepted', data);
				if(data.originator == 'remote' && this.currentSession == null) {
					this.currentSession = this.incomingSession;
					this.incomingSession = null;
					console.info("setCurrentSession - ", currentSession);
				}
			});

			data.session.on('confirmed', function(data) {
				console.info('通话确认--onConfirmed - ', data);
				if(data.originator == 'remote' && this.currentSession == null) {
					this.currentSession = this.incomingSession;
					this.incomingSession = null;
					console.info("setCurrentSession - ", this.currentSession);
				}
			});
			//
			data.session.on('peerconnection', function(args) {
				console.log("看是否能拿到数据" + data);
				args.peerconnection.onaddstream = function(ev) {
					this.remoteAudio.srcObject = ev.stream;
					// wait until the video stream is ready
					/*var interval = setInterval(function() {
						if(!meVideo.videoWidth) {
							return;
						}
						//stage.appendChild(videoView);
						clearInterval(interval);
					}, 1000 / 50);
*/
				};
			});

			data.session.on('connecting', function(data) {
				console.log("在本地媒体流加入RTCSession之后，在ICE采集开始之前触发初始INVITE请求或“200 OK”响应传输--Connection");
			});
			data.session.on('sending', function(data) {
				console.log("在发送初始INVITE之前触发（仅用于拨出电话）--sending");
			});
			data.session.on('ended', function(data) {
				console.info('已建立的通话结束时触发--ended - ', data);
			});
			//在将远程SDP传递给RTC引擎之前以及在发送本地SDP之前触发。
			data.session.on('sdp', function(data) {
				console.info('onSDP, type - ', data.type, ' sdp - ', data.sdp);
				//data.sdp = data.sdp.replace('UDP/TLS/RTP/SAVPF', 'RTP/SAVPF');
				//console.info('onSDP, changed sdp - ', data.sdp);
			});
			data.session.on('progress', function(data) {
				if(data.originator == 'remote') {
					console.log(".在接收或生成对INVITE请求的1XX SIP类别响应（> 100）时触发--progress");
				}
			});
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
		//打开本地视频流
		this.openVide();
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
		//this.localAudio.onloadstart = () => {//}
		
		console.log(this.localStream);
		var options = {
			'eventHandlers': eventHandlers, //Object事件处理程序的可选项将被注册到每个呼叫事件。为每个要通知的事件定义事件处理
			'mediaConstraints': this.constraints,
			'mediaStream': this.localStream, //MediaStream 传送到另一端。
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
	Phone.prototype.terminate = function() {
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

	Phone.prototype.openVide = function() {
		navigator.mediaDevices.getUserMedia(this.constraints).then(function success(stream) {
			//this.localAudio.srcObject = stream;
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