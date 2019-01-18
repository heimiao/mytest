$(function() {
	var outgoingSession = null;
	var incomingSession = null;
	var currentSession = null;
	var baseUrl = 'https://192.168.171.12'
	//  右侧视频区start
	var meVideo = document.getElementById('meVideo');
	meVideo.setAttribute('autoplay', '');
	meVideo.setAttribute('playsinline', '');
	meVideo.style.width = '212px';

	var youVideo = document.getElementById('youVideo');
	youVideo.setAttribute('autoplay', '');
	youVideo.setAttribute('playsinline', '');
	youVideo.style.width = '531px';

	var constraints = {
		audio: true,
		video: {
			faceMode: 'user'
		}
	};

	var localStream = null;
	var userAgent = null;

	navigator.mediaDevices.getUserMedia(constraints).then(function success(stream) {
		meVideo.srcObject = stream;
		document.body.addEventListener('click', function() {
			meVideo.play();
		});
		// 等到视频流准备好了
		var interval = setInterval(function() {
			if(!meVideo.videoWidth) {
				return;
			}
			//stage.appendChild(videoView);
			clearInterval(interval);
		}, 1000 / 50);
	}).catch(function(error) {
		onError({
			name: error.name,
			message: error.message
		});
	});
	//右侧视频区end

	//短信息发送
	function addToChat(msg, data) {
		var messages = document.getElementById('messages');
		if(msg == '') {
			return;
		} else {
			msg = sanitize(msg);
			if(data == undefined) {
				msg = '<strong style="position: absolute;right: 15px;">' + msg + '<img  src="images/me.png" style="width:20px;">' + '</strong>';
			} else {
				msg = '<span style="position: absolute;left: 15px;">' + '<img src="images/you.png"style="width:20px;">' + msg + '</span>';
			}
			messages.innerHTML = messages.innerHTML + msg + '<br>';
			messages.scrollTop = 10000;
		}

	}
	//视频短信
	function addToChatVideo(msg, data) {
		var messages = document.getElementById('messages_video');
		if(msg == '') {
			return;
		} else {
			msg = sanitize(msg);
			if(data == undefined) {
				msg = '<strong style="position: absolute;right: 15px;">' + msg + '<img src="images/me.png"style="width:20px;">' + '</strong>';
			} else {
				msg = '<span style="position: absolute;left: 15px;">' + '<img src="images/you.png"style="width:20px;">' + msg + '</span>';
			}
			messages.innerHTML = messages.innerHTML + msg + '<br>';
			messages.scrollTop = 10000;
		}

	}

	function sanitize(msg) {
		return msg.replace(/</g, '&lt;');
	}

	//点击下一步
	$('#me_next_step').on('click', function() {
		// 进行验证
		var me_uri = $('#me_uri').val();
		if(me_uri == '') {
			toastr.warning('请输入您的电话号码!');
			return;
		} else if(specialVerificationName(me_uri)) {
			toastr.warning('输入号码不能有特殊字符，请输入正确的号码！');
			return;
		} else if(me_uri < 1000) {
			toastr.warning('号码不能小于1000，请重新输入！');
			$('#me_uri').val(null)
			return;
		} else {
			//   点击下一步验证自己的号码是否存在或者注册
			var me_uri = document.getElementById("me_uri").value.toString();
			$.ajax({
				url: baseUrl,
				type: "GET",
				dataType: "jsonp",
				data: {
					result: me_uri
				},
				success: function(data) {
					console.log(data)
					if(data.result == "userOnline") {
						toastr.warning('用户正在被使用,请使用其他号码！');
						return;
					} else {

						$('.me_uri').css('display', 'none')
						$('.you_uri').css('display', 'block')
						$('.device_M').css('display', 'block')
						$('.device_V').css('display', 'block')
						$('.device_C').css('display', 'block')
						$('.me_last_step').css('display', 'block')
						$('#me_next_step').css('display', 'none')
						// 进行号码登录注册
						var me_uri = document.getElementById("me_uri").value.toString();
						var me_uri_joint = 'sip:' + me_uri + '@172.16.250.131:5060'
						var ws_uri = 'ws://172.16.250.131:5066'
						//   创建websocket
						var socket = new JsSIP.WebSocketInterface(ws_uri);
						//  配置参数
						var configuration = {
							sockets: [socket],
							outbound_proxy_set: ws_uri,
							uri: me_uri_joint,
							password: '5678',
							register: true, //指示JsSIP用户代理是否应在启动时自动注册
							session_timers: false //启用会话定时器,默认值是true。
						};
						//  配置创建user agent
						userAgent = new JsSIP.UA(configuration);
						//成功注册成功
						userAgent.on('registered', function(data) {
							console.info("registered: ", data.response.status_code, ",", data.response.reason_phrase);
						});
						//由于注册失败而被解雇
						userAgent.on('registrationFailed', function(data) {
							console.log("registrationFailed, ", data);
						});
						// 在注册期间发射几秒钟，如果应用程序没有为这个事件设置任何监听器，JsSIP将像往常一样重新注册。
						userAgent.on('registrationExpiring', function() {
							console.warn("registrationExpiring");
						});

						//为传入或传出的会话/呼叫。
						userAgent.on('newRTCSession', function(data) {
							console.info('onNewRTCSession: ', data);
							if(data.originator == 'remote') {
								console.info("incomingSession, answer the call");
								incomingSession = data.session;
								data.session.answer({
									'mediaConstraints': constraints,
									'mediaStream': null
								});
								if(constraints.video == false) {
									//对方打入，显示接听电话按钮
									$('.device_module').css('display', 'none')
									$('.device_module_call').css('display', 'block')
									$('.callPhoneRedColor').css('display', 'block')
									$('.callPhoneRedGreen').css('display', 'block')
									$('.callPhoneRedGreen').css('opacity', 0.5)
									var youCallSlice = data.request.headers.From['0'].raw;
									youCallSlice = youCallSlice.substring(youCallSlice.indexOf('sip:'), youCallSlice.indexOf('@'));
									youCallSlice = youCallSlice.replace('sip:', '')
									$('#you_uri').val(youCallSlice)
									constraints = {
										audio: true,
										video: {
											faceMode: 'user'
										}
									};
								} else {

									var youCallSlice = data.request.headers.From['0'].raw;
									youCallSlice = youCallSlice.substring(youCallSlice.indexOf('sip:'), youCallSlice.indexOf('@'));
									youCallSlice = youCallSlice.replace('sip:', '')
									$('#youVideoIng').text(youCallSlice)
									$('#you_uri').val(youCallSlice)
									$('.demo_1').css('display', 'none')
									$('#chatbox_video').css('display', 'block')
								}
							} else {
								var youCallSlice = $('#you_uri').val();
								$('#youVideoIng').text(youCallSlice)
								console.info("outgoingSession");
								outgoingSession = data.session;
								outgoingSession.on('connecting', function(data) {
									console.info('onConnecting - ', data.request);
									currentSession = outgoingSession;
									outgoingSession = null;
								});
							}

							data.session.on('accepted', function(data) {
								console.info('onAccepted - ', data);
								if(data.originator == 'remote' && currentSession == null) {
									currentSession = incomingSession;
									incomingSession = null;
									console.info("setCurrentSession - ", currentSession);
								}
							});

							data.session.on('confirmed', function(data) {
								console.info('onConfirmed - ', data);
								if(data.originator == 'remote' && currentSession == null) {
									
									// alert(1)
									currentSession = incomingSession;
									incomingSession = null;
									console.info("setCurrentSession - ", currentSession);
								}
							});

							data.session.on('sdp', function(data) {
								console.info('onSDP, type - ', data.type, ' sdp - ', data.sdp);
								//data.sdp = data.sdp.replace('UDP/TLS/RTP/SAVPF', 'RTP/SAVPF');
								//console.info('onSDP, changed sdp - ', data.sdp);
							});

							data.session.on('progress', function(data) {
								console.info('onProgress - ', data.originator);
								if(data.originator == 'remote') {
									console.info('onProgress, response - ', data.response);
								}
							});

							data.session.on('peerconnection', function(data) {
								console.info('onPeerconnection - ', data.peerconnection);
								data.peerconnection.onaddstream = function(ev) {
									console.info('onaddstream from remote - ', ev);
									youVideo.srcObject = ev.stream;

									document.body.addEventListener('click', function() {
										meVideo.play();
									});
									// 等到视频流准备好了
									var interval = setInterval(function() {
										if(!meVideo.videoWidth) {
											return;
										}
										//stage.appendChild(videoView);
										clearInterval(interval);
									}, 1000 / 50);

								};
							});

						});
						//新消息
						//为传入或传出的MESSAGE请求而开火。
						userAgent.on('newMessage', function(data) {
							if(data.originator == 'local') {

								console.info('onNewMessage , OutgoingRequest - ', data.request);
							} else {
								console.info('onNewMessage , IncomingRequest - ', data.request);
								if(data.message.content != undefined) {
									//短信
									addToChat(data.message.content, data)
									//短信和视频
									addToChatVideo(data.message.content, data)

								} else {
									//短信
									addToChat(data.request.body, data)
									//短信和视频
									addToChatVideo(data.request.body, data)
								}

							}
						});

						console.info("call register");
						/** 
						 * 连接到信令服务器，如果是之前停止则恢复到停止之前的状态，如果是刷新操作‘’
						 * 而且configuration的register参数设置为true则直接注册到信令服务器
						 */
						userAgent.start();

					}
				},
				error: function(err) {
					toastr.error('连接失败!')
				}
			});
		}

		//点击视频左边短信进行一对一发送消息
		//发送即时消息
		var contentType = "text/plain";
		var text = document.getElementById("chatinput_video");
		// 消息发送sendMessage（）
		text.addEventListener('keydown', function(event) {
			var you_uri = document.getElementById("you_uri").value.toString();
			var you_uri_joint = 'sip:' + you_uri + '@172.16.250.131:5060';
			var key = event.which || event.keyCode;
			if(key === 13) {
				var options = {
					'eventHandlers': eventHandlers
				};
				userAgent.sendMessage(you_uri_joint, text.value, options);
				addToChatVideo(text.value);
				text.value = "";
			}
		}, false);
		//点击发送功能
		$('#chatbutton_video').on('click', function() {
			var you_uri = document.getElementById("you_uri").value.toString();
			var you_uri_joint = 'sip:' + you_uri + '@172.16.250.131:5060';
			var options = {
				'eventHandlers': eventHandlers
			};
			userAgent.sendMessage(you_uri_joint, text.value, options);
			addToChatVideo(text.value);
			text.value = "";
		})

		//左侧短信发送功能end

		//   点击静音按钮
		$('.glyphicon-volume-down').on('click', function() {
			var options = {
				audio: true
			}
			userAgent.mute(options)
		})

	})

	// 注册监听事件监听各个连接状态
	var eventHandlers = {
		'progress': function(e) {
			console.log('call is in progress');
		},
		'failed': function(e) {
			console.log('call failed: ', e);
			alert('呼叫失败');
		},
		'ended': function(e) {
			console.log('call ended : ', e);
			$('#chatbox_video').css('display', 'none');
			$('.demo_1').css('display', 'block');
			toastr.warning('已挂断！');
		},
		'confirmed': function(e) {
			console.log('call confirmed' + 'yunfei');
		},
		'succeeded': function(e) { // Your code here
			console.log('发送成功！')
		},
		'failed': function(e) { // Your code here 
			console.log('发送失败！')
		}
	};

	//点击M发短信
	$('.device_M').on('click', function() {
		//点击M进行验证查询
		var you_uri = $('#you_uri').val();
		var me_uri = $('#me_uri').val();
		if(you_uri == '') {
			toastr.warning('请输入对方电话号码!');
			return;
		} else if(you_uri < 1000) {
			toastr.warning('号码不能小于1000，请重新输入！');
			$('#you_uri').val(null)
			return;
		} else if(specialVerificationName(you_uri)) {
			toastr.warning('输入号码不能有特殊字符，请输入正确的号码！');
			return;
		} else if(you_uri == me_uri) {
			toastr.warning('不能输入自己的电话号码!');
			return;
		} else {
			var you_uri = document.getElementById("you_uri").value.toString();
			$.ajax({
				url: baseUrl + "/freeswitch/youPhoneNum",
				type: "GET",
				dataType: "jsonp",
				data: {
					result: you_uri
				},
				success: function(data) {
					console.log(data)
					if(data.result == "userNotOnline") {
						toastr.warning('用户不在线');
						return;
					} else if(data.result == "userNotExist") {
						toastr.warning('用户不存在');
						return;
					} else if(data.result == "busy") {
						toastr.warning('用户正在通话中...');

						return;
					} else {

						$('.demo_1').css('display', 'none');
						$('#chatbox_message').css('display', 'block');
						//发送即时消息
						var contentType = "text/plain";
						var text = document.getElementById("chatinput");
						// 消息发送sendMessage（）
						text.addEventListener('keydown', function(event) {
							var you_uri = document.getElementById("you_uri").value.toString();
							var you_uri_joint = 'sip:' + you_uri + '@172.16.250.131:5060';
							var key = event.which || event.keyCode;
							if(key === 13) {
								var options = {
									'eventHandlers': eventHandlers
								};
								userAgent.sendMessage(you_uri_joint, text.value, options);
								addToChat(text.value);
								text.value = "";
							}
						}, false);
						//点击发送功能
						$('#chatbutton').on('click', function() {
							var you_uri = document.getElementById("you_uri").value.toString();
							var you_uri_joint = 'sip:' + you_uri + '@172.16.250.131:5060';
							var options = {
								'eventHandlers': eventHandlers
							};
							userAgent.sendMessage(you_uri_joint, text.value, options);
							addToChat(text.value);
							text.value = "";
						})

					}
				},
				error: function() {
					toastr.error('连接失败!')
				}
			})
		}

	})
	//点击短信关闭按钮返回页面
	$('.deaderMessages_symbol').on('click', function() {
		$('.demo_1').css('display', 'block');
		$('#chatbox_message').css('display', 'none');
		var me_uri = document.getElementById("me_uri").value.toString();
		$.ajax({
			url: baseUrl + '/freeswitch/killCallByNum?command=' + me_uri,
			type: "post",
			dataType: 'jsonp'
		});
		$('#messages_video').text('');
		$('#messages').text('');
	})

	//点击V视频

	$('.device_V').on('click', function() {
		//点击V进行验证查询
		var you_uri = $('#you_uri').val();
		var me_uri = $('#me_uri').val();
		if(you_uri == '') {
			toastr.warning('请输入对方电话号码!');
			return;
		} else if(you_uri == me_uri) {
			toastr.warning('不能输入自己的电话号码!');
			return;
		} else if(you_uri < 1000) {
			toastr.warning('号码不能小于1000，请重新输入！');
			$('#you_uri').val(null)
			return;
		} else if(specialVerificationName(you_uri)) {
			toastr.warning('输入号码不能有特殊字符，请输入正确的号码！');
			return;
		} else {

			var you_uri = document.getElementById("you_uri").value.toString();
			$.ajax({
				url: baseUrl + "/freeswitch/youPhoneNum",
				type: "GET",
				dataType: "jsonp",
				data: {
					result: you_uri
				},
				success: function(data) {
					if(data.result == "userNotOnline") {
						toastr.warning('用户不在线');
						return;
					} else if(data.result == "userNotExist") {
						toastr.warning('用户不存在');
						return;
					} else if(data.result == "busy") {
						toastr.warning('用户正在通话中...');
						return;
					} else {

						$('.demo_1').css('display', 'none');
						$('#chatbox_video').css('display', 'block');
						//左侧短信发送功能start

						//右侧视频功能start

						//视频
						var you_uri = document.getElementById("you_uri").value.toString();
						var you_uri_joint = 'sip:' + you_uri + '@172.16.250.131:5060';
						/**
						 * 拨打参数配置，eventHandlers是注册事件监听的回调；mediaConstraints
						 * 是多媒体配置，详细配置可以参考：https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia；
						 * pcConfig可以配置ICE服务器地址，适用于需要穿透的网络环境
						 */
						var options = {
							'eventHandlers': eventHandlers,
							'mediaConstraints': constraints,
							'mediaStream': null,
						};
						// 拨打音视频电话给'sip:bob@example.com'
						outgoingSession = userAgent.call(you_uri_joint, options);
						//右侧视频功能end

					}
				},
				error: function() {
					toastr.error('连接失败!')
				}
			})
		}
	})

	//点击短信与视频通话关闭按钮返回页面
	$('.deaderMessages_symbol_video').on('click', function() {
		$('.demo_1').css('display', 'block');
		$('#chatbox_video').css('display', 'none');
		var me_uri = document.getElementById("me_uri").value.toString();
		$.ajax({
			url: baseUrl + '/freeswitch/killCallByNum?command=' + me_uri,
			type: "post",
			dataType: 'jsonp'
		});
		$('#messages_video').text('');
		$('#messages').text('');
	})
	//点击C通话
	$('.device_C').on('click', function() {
		var you_uri = $('#you_uri').val();
		var me_uri = $('#me_uri').val();
		if(you_uri == '') {
			toastr.warning('请输入对方电话号码!');
			return;
		} else if(you_uri == me_uri) {
			toastr.warning('不能输入自己的电话号码!');
			return;
		} else if(you_uri < 1000) {
			toastr.warning('号码不能小于1000，请重新输入！');
			$('#you_uri').val(null)
			return;
		} else if(specialVerificationName(you_uri)) {
			toastr.warning('输入号码不能有特殊字符，请输入正确的号码！');
			return;
		} else {
			//点击C进行验证查询
			var you_uri = document.getElementById("you_uri").value.toString();
			$.ajax({
				url: baseUrl + "/freeswitch/youPhoneNum",
				type: "GET",
				dataType: "jsonp",
				data: {
					result: you_uri
				},
				success: function(data) {
					if(data.result == "userNotOnline") {
						toastr.warning('用户不在线');
						return;
					} else if(data.result == "userNotExist") {
						toastr.warning('用户不存在');
						return;
					} else if(data.result == "busy") {
						toastr.warning('用户正在通话中...');
						return;
					} else {
						var me_uri = document.getElementById("me_uri").value.toString()
						$.ajax({
							url: baseUrl + "/freeswitch/showPhoneStatus",
							type: "GET",
							dataType: "jsonp",
							data: {
								result: me_uri
							},
							success: function(data) {
								if(data.result == "busy") {
									toastr.warning('对方正在通话...')
								} else {
									$('.you_uri_call').css('display', 'block')
									$('.device_module').css('display', 'none')
									$('.me_last_step').css('display', 'none')
									$('.device_module_call').css('display', 'block')
									$('.callPhoneRedColor').css('display', 'block')
									$('.callPhoneRedGreen').css('display', 'block')

									//拨打电话隐藏接听按钮
									$('.callPhoneRedGreen').css('opacity', 0.5)
									//点击C按钮，拨打语音电话
									var callYouUri = document.getElementById("you_uri").value.toString();
									var callYouUri_joint = 'sip:' + callYouUri + '@172.16.250.131:5060';

									var constraints = {
										audio: true,
										video: false
									};

									var options = {
										'eventHandlers': eventHandlers,
										'mediaConstraints': constraints,
										'mediaStream': null
									};
									outgoingSession = userAgent.call(callYouUri_joint, options);

								}
							},
							error: function(err) {
								toastr.error('连接失败!')
							}
						});

					}
				},
				error: function() {
					toastr.error('连接失败!')
				}
			})
		}
	})
	//点击电话通话挂断返回上一层
	$('.callPhoneRedColor').on('click', function() {
		$('.you_uri').css('display', 'block')
		$('.you_uri_call').css('display', 'none')
		$('.device_module').css('display', 'block')
		$('.me_last_step').css('display', 'block')
		$('.device_module_call').css('display', 'none')
		$('.callPhoneRedColor').css('display', 'none')
		$('.callPhoneRedGreen').css('display', 'none')
	})

	//点击视频挂断
	$('.glyphicon-off').on('click', function() {
		var me_uri = document.getElementById("me_uri").value.toString();
		$.ajax({
			url: baseUrl + '/freeswitch/killCallByNum?command=' + me_uri,
			type: "post",
			dataType: 'jsonp'
		});
		//点击挂断按钮清空左侧信息
		$('#messages_video').text('');
		$('#messages').text('');
		$('#chatbox_video').css('display', 'none');
		$('.demo_1').css('display', 'block');
	})

	//点击语音进行挂断，获取本地输入的uri
	$('.callPhoneRedColor').on('click', function() {
		var me_uri = document.getElementById("me_uri").value.toString();
		$.ajax({
			url: baseUrl + '/freeswitch/killCallByNum?command=' + me_uri,
			type: "post",
			dataType: 'jsonp'
		});
	})
	/**
	 * 过滤所有特殊字符串和空格
	 * @param s
	 * @returns {boolean}
	 */
	function specialVerificationName(s) {
		var pattern = new RegExp("[`~ !@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
		return pattern.test(s)
	}

})