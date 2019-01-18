var audio_context = new AudioContext;

function startUserMedia(stream) {
	var input = audio_context.createMediaStreamSource(stream);
	input.context.sampleRate = 16000;
	recorder = new Recorder(input);

}

function startRecording() {
	recorder && recorder.record(); 
}

function stopRecording(aaa) {
	recorder && recorder.stop(); 
	createDownloadLink(aaa);
	recorder.clear();
}

function createDownloadLink(tr) {
	recorder && recorder.exportWAV(function(blob) {

		var formData = new FormData();
		var id = parseInt(tr.children().eq(0).html());
		// var companyName=tr.children().eq(2).html();
		//                var question=tr.children().eq(3).html();
		//                var reply=tr.children().eq(4).html();
		//                var parentId=tr.children().eq(5).html();
		//                var companyname=$("#txt_companyname").val();
		//                var id=$("#txt_id").val();
		formData.append("sentence", blob);
		// formData.append("companyname", companyName);
		formData.append("id", id);
		var request = new XMLHttpRequest();

		request.open("POST", "/HelloController/testpost");

		request.onreadystatechange = function() {
			if(request.status == 200) {
				//后台数据输出什么，我们的responseText就得到什么
				var src = request.responseText;
				// console.log(src);
				if(src.length != 0) {
					src = JSON.parse(src).src;
				} else {
					src = "";
				}
				// src=eval(src).src;
				// console.log("src:"+src);
				var audio = tr.find("audio");
				// console.log(audio)
				if(audio.length) {
					audio.attr("src", src);
				} else {
					//tr.find(".aaa").html(`<audio src="${src}" preload="none" controls=""></audio><button class="btn btn-warning btn-xs myluyin">重录</button>`);
					tr.find(".aaa").html(`<div style="text-align: center;"><audio style="float: none;" src="${src}" preload="none" controls=""></audio></div><div style="text-align: center;margin-top: 10px;"><button class="btn btn-warning btn-xs myluyin">重录</button><button style="margin-left: 10px;position: relative;cursor: pointer;" class="btn btn-info btn-xs">上传录音<input class="upLuYin" dataId="${id}" style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;opacity: 0;cursor: pointer;" type="file"></button></div>`);
				}
			}
		};
		request.send(formData);
	});
}