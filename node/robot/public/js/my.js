jQuery.validator.addMethod("isPhone", function(value, element) {
	var length = value.length;
	var mobile = /^(((13[0-9]{1})|(15[0-9]{1}))+\d{8})$/
	return this.optional(element) || (length == 11 && mobile.test(value));
}, "手机号码格式错误");

$('#exampleModalCenter').on('hidden.bs.modal', function(e) {
	$("#frmEmail").validate().resetForm();
})

$(function() {
	$("#frmEmail").validate({
		rules: {
			name: {
				required: true,
			},
			phone: {
				required: true,
				isPhone: true,
			},
			company: {
				required: true,
			},
			industry: {
				required: true,
			},
		},
		messages: {
			name: {
				required: "请输入用户名",
			},
			phone: {
				required: "请输入密码",
				isPhone: "请输入正确手机号"
			},
			company: {
				required: "企业不能为空",
			},
			industry: "行业不能为空",
		},
		invalidHandler: function() {
			console.log(2);
			return false;
		},
		submitHandler: function() {
			$.ajax({
				type: 'POST',
				url: "http://localhost:3000/sendEmail",
				data: $("#frmEmail").serializeArray(),
				success: function(data) {
					if(data.status) {
						$('#exampleModalCenter').modal('hide')
						alert("提交成功")
						mySetTimeout(60);
					} else {
						alert("提交失败")
					}
				}
			});
		}
	});
})

function mySetTimeout(index) {
	index--
	if(index >= 1) {
		$("#applyBtn").attr('disabled', 'disabled')
		$("#applyBtn").text("剩余" + index + "秒");
		stopTimeOut = setTimeout(mySetTimeout, 1000, index);
	} else {
		$("#applyBtn").removeAttr("disabled")
		$("#applyBtn").text("申请试用");
		clearTimeout(stopTimeOut);
	}
}