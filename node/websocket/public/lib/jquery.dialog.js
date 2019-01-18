(function(_w, _$) {
	_$.extend({
		_default: {
			title: "操作提示",
			icon: "",
			type: 'success',
			content: "确定要删除吗？",
			$el: "",
		},
		dialog: function(opt, sure, cancel) {
			this._init(opt);
			this._openConfirm();
			this._default.$el.find(".close,.cancel").click(e => {
				this._closeConfirm();
				cancel();
			})
			this._default.$el.find(".sure").click(e => {
				this._closeConfirm();
				sure();
			})
		},
		notice: function(opt, callback) {
			new this._Notice(this, opt, callback).init();
		},
		success: function(opt, time) {
			var opt = this._init(opt)
			opt.type = "success";
			opt.interval = time;
			this.notice(opt)
		},
		danger: function(opt, time) {
			var opt = this._init(opt)
			opt.type = "danger";
			opt.interval = time;
			this.notice(opt)
		},
		warning: function(opt, time) {
			var opt = this._init(opt)
			opt.type = "warning";
			opt.interval = time;
			this.notice(opt)
		},
		info: function(opt, time) {
			var opt = this._init(opt)
			opt.type = "info";
			opt.interval = time;
			this.notice(opt)
		},
		_init: function(opt) {
			var reutrnOpt = {};
			if(typeof opt == "string") {
				this._default.content = opt;
				reutrnOpt = this._default;
			} else {
				reutrnOpt = $.extend({}, this._default, opt);
			}
			this._default = reutrnOpt;
			return reutrnOpt;
		},
		_openConfirm: function() {
			this._default.$el = $(this._templete())
			//$("body").addClass('modal-open').append('<div class="modal-backdrop fade in"></div>').append(this._default.$el)
			$("body").append('<div class="modal-backdrop fade in" id="myshade"></div>').append(this._default.$el)
			this._default.$el.slideDown(1000)
		},
		_closeConfirm: function() {
			//$('body').removeClass("modal-open").find(".modal-backdrop").remove();
			$('body').find("#myshade").remove();
			this._default.$el.slideUp(500, function() {
				$(this).remove();
			})
		},
		_Notice: function(me, opt, callback) {
			this._default = {
				title: "操作提示",
				icon: "",
				type: 'success',
				content: "通知",
				$el: "",
			}
			this.init = function() {
				this._default = Object.assign({}, this._default, opt);
				this._default.$el = $(me._noticeTpl(this._default));
				this._default.$el.find(".closeNotice").click(e => {
					this._closeNotice();
				})
				this._openNotice();
			}
			this._openNotice = function() {
				$('body').append(this._default.$el.hide());
				this._default.$el.slideDown(500)
				if(this._default.interval)
					this._interval(this._default.interval);
			};
			this._interval = function(args) {
				this.stopInterval = setInterval(() => this._closeNotice(), args * 1000);
			}
			this._closeNotice = function() {
				this._default.$el.slideUp(500, () => {
					callback && callback();
					this._default.$el.remove();
					this.stopInterval && clearInterval(this.stopInterval)
				})
			}
		},
		_templete: function() {
			return ` <div class="modal fade in bs-example-modal-sm">
							<div class="modal-dialog modal-sm" role="document">
								<div class="modal-content">
									<div class="modal-header">
										<button type="button" class="close"><span aria-hidden="true">&times;</span></button>
										<h4 class="modal-title" id="exampleModalLabel">${this._default.title}</h4>
									</div>
									<div class="modal-body">
										<dl style="text-align: center;margin:5% auto;">
											<dt>${this._default.icon?'<img src="'+this._default.icon+'">':""}</dt>
											<dd style="margin:15px auto;">${this._default.content}</dd>
										</dl>
									</div>
									<div class="modal-footer">
										<button type="button" class="btn btn-default sure">确认</button>
										<button type="button" class="btn btn-primary cancel">取消</button>
									</div>
								</div>
							</div>
						</div>`
		},
		_noticeTpl: function(data) {
			return `<div class="alert alert-${data.type?data.type:'success'}" style="text-align:center;z-index:9999;position: fixed;width:100%;top:0px;left:0px">
									<button type="button" class="close closeNotice"><span>&times;</span></button> 
									${data.content}
								</div>`;
		}
	})
})(window, jQuery)