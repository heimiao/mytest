var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var ejs = require('ejs');

var fs = require('fs')

var app = express();

var http = require('http').Server(app);

//倒入socket.io
var io = require('socket.io')(http);

// view engine setup
app.set('views', path.join(__dirname, 'views'));

//app.set('view engine', 'ejs');

app.engine('.html', ejs.__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());

//设置中间件静态资源的路径
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', index);
//app.use('/users', users); 

app.get('/', function(req, res) {
	res.sendfile(__dirname + '/views/index.html');
});
io.on('connection', function(socket) {
	console.log('a user connected');
	/*socket.emit('news', {
		hello: 'world'
	});*/
	socket.on('chat message', function(data) {
		//监听终端
		console.log(data);
		//触发
		socket.emit('hello', 'can you hear me?');
	});
});

http.listen(3000, function() {
	console.log('listening on *:3000');
});

/*var server = app.listen('8808', function() {
	var host = server.address().address
	var port = server.address().port
	console.log("监听端口", host, port)

});*/

//  POST
app.post('/', function(req, res) {
	console.log("post请求方法");
	res.send('Hello POST');
})
app.get('/process', function(req, res) {
	// 输出 JSON 格式
	var response = {
		"first_name": req.query.name,
		"last_name": req.query.phone
	};
	res.send(JSON.stringify(response));
})

app.post('/process', function(req, res) {
	// 输出 JSON 格式
	var response = {
		"first_name": req.body.name,
		"last_name": req.body.phone
	};
	console.log(response);
	res.send(JSON.stringify(response));
})

// 模糊匹配路径
app.get('/ab*cd', function(req, res) {
	console.log("/ab*cd GET模糊匹配路径");
	res.send('模糊匹配路径');
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next("报错4404");
});
// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;