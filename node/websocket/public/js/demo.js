//var socket = io.connect("192.168.29.58:8080/websocket/chat"); 
var mediaStreamTrack = null;

function getStream() {
	var audio_context = null;
	try {
		// webkit shim
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
		window.URL = window.URL || window.webkitURL;
		audio_context = new AudioContext;
	} catch(e) {
		messages("您的浏览器不支持语音采集，请切换更高版本浏览器");
	}
	navigator.mediaDevices.getUserMedia({
		audio: true,
		video: false,
	}).then(function success(stream) {
		mediaStreamTrack = typeof stream.stop === 'function' ? stream : stream.getTracks()[0];
		//stream = stream;
		var source = audio_context.createMediaStreamSource(stream);
		//document.getElementById("remoteAudio").src = source;
		source.context.sampleRate = 16000;
		recorder = new Recorder(source);
		console.log("获取媒体流");
	}).catch(function(err) {
		console.error("获取本地媒体流错误" + err);
	});
}

function createSound(buffer) {
	if(audioCtx.state != 'running') {
		console.log('重启audioCtx');
		audioCtx.resume();
	}
	let analyser = audioCtx.createAnalyser();
	let gainNode = audioCtx.createGain();
	let source = audioCtx.createBufferSource();
	source.buffer = buffer;
	source.connect(analyser);
	analyser.connect(gainNode);
	gainNode.connect(audioCtx.destination);
	return source;
}

function startRecord() {

	$.dialog("来电话了是否要接通?", () => {
		console.log("接通电话");
		console.log("开始录音");
		recorder && recorder.record();
	}, () => {
		console.log("拒绝电话");
	})
}

function stopRecord() {
	console.log("停止录音");
	/*if(stream.stop) {
		stream.stop();
	} else {
		var tracks = stream.getTracks();
		for(var i = 0; i < tracks.length; i++) {
			tracks[i].stop();
		}
	}*/
	console.log(mediaStreamTrack);
	mediaStreamTrack && mediaStreamTrack.stop();
	recorder && recorder.stop();
}

function clearRecord() {
	console.log("清除录音");
	recorder && recorder.clear();
}

function playRecord() {
	console.log("播放录音");
	recorder && recorder.exportWAV(blob => {
		console.log(blob);
		var audioUrl = window.URL.createObjectURL(blob)
		document.getElementById("remoteAudio").src = blob;
		setTimeout(audioUrl => window.URL.revokeObjectURL(audioUrl), "2000");
	})
}

var getStreamBtn = $(".getStream");
var startRecordBtn = $(".startRecord");
var stopRecordBtn = $(".stopRecord");
var clearRecordBtn = $(".clearRecord");
var playRecordBtn = $(".playRecord");
getStreamBtn.click(e => {
	getStream()
})
startRecordBtn.click(e => {
	getStream()
	startRecord()
})
stopRecordBtn.click(e => {
	stopRecord()
})
clearRecordBtn.click(e => {
	clearRecord()
})
playRecordBtn.click(e => {
	playRecord();
})