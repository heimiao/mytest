var phone = (function(w, $) {
	Phone = function() {
		this.wsUrl = "wss://192.168.29.58:8443/websocket/audio";
		this.ws = null;
		this.mediaStreamTrack = null;
		this.mediaRecorder = null;
		this.chunks = null;
		this.constraints = {
			audio: true,
			video: false,
		};
		this.init();
	}
	Phone.prototype.answer = function(args) {
		//接听
		this.lg(args || "接听");
	}
	Phone.prototype.hangUp = function(args) {
		//挂断
		this.lg(args || "挂断");
	}
	Phone.prototype.init = function() {
		//获取流
		this.getStream();

		//创建websockt连接对象
		//this.initWs();
	}

	Phone.prototype.createWs = function(url_args) {
		//创建websocket
		if('WebSocket' in window) {
			this.ws = new WebSocket(url_args);
		} else if('MozWebSocket' in window) {
			this.ws = new MozWebSocket(url_args);
		} else {
			this.lg("您的浏览器不支持WebSocket。");
			return;
		}
	}
	Phone.prototype.initWs = function() {
		if(this.ws != null) {
			this.lg("现已连接");
			return;
		}
		this.createWs(this.wsUrl);
		var me = this;
		this.ws.onopen = function() {
			//设置发信息送类型为：ArrayBuffer  
			me.ws.binaryType = "arraybuffer";
		}
		this.ws.onmessage = function(e) {
			me.lg(e.data.toString());
		}
		this.ws.onclose = function(e) {
			me.lg("onclose: closed");
			me.ws = null;
			me.createWs(); //防止断开。
		}
		this.ws.onerror = function(e) {
			me.lg("onerror: error");
			me.ws = null;
			me.createWs(); //同上面的解释
		}
	}
	Phone.prototype.getStream = function() {
		navigator.mediaDevices.getUserMedia(this.constraints).then(this.recording).catch(function(err) {
			this.lg("获取本地媒体流错误" + err);
		});
	}
	Phone.prototype.recording = function(stream) {
		mediaStreamTrack = typeof stream.stop === 'function' ? stream : stream.getTracks()[0];
		document.getElementById("remoteAudio").srcObject = stream;
		
		
	}
	
	
	Phone.prototype.mediaHandle = function() {
		if(typeof MediaRecorder.isTypeSupported == 'function') {
			//这里涉及到视频的容器以及编解码参数，这个与浏览器有密切的关系
			if(MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
				var options = {
					mimeType: 'video/webm;codecs=h264'
				};
			} else if(MediaRecorder.isTypeSupported('video/webm;codecs=h264')) {
				var options = {
					mimeType: 'video/webm;codecs=h264'
				};
			} else if(MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
				var options = {
					mimeType: 'video/webm;codecs=vp8'
				};
			}
			this.mediaRecorder = new MediaRecorder(stream, options);
		} else {
			this.lg('不支持IStypeSupported，使用浏览器的默认编解码器');
			this.mediaRecorder = new MediaRecorder(stream);
		}
		//设置媒体帧率
		//mediaRecorder.setVideoFrameRate(24);
		this.mediaRecorder.onerror = function(e) {
			this.lg('Error:' + e);
		};
		this.mediaRecorder.onstart = function() {
			this.lg('Error:' + this.mediaRecorder.state);
		};
		this.mediaRecorder.onpause = function() {
			this.lg('暂停 :' + mediaRecorder.state);
		}
		this.mediaRecorder.onresume = function() {
			this.lg('继续 :  ' + mediaRecorder.state);
		}
		this.mediaRecorder.onwarning = function(e) {
			this.lg('警告: ' + e);
		};
	}

	Phone.prototype.lg = function(args) {
		console.log(args);
	}
	return new Phone();
})(window, jQuery)