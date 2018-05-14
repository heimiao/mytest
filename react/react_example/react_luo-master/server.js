var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.dev.config.js');

var server = new WebpackDevServer(webpack(config), {
	publicPath: config.output.publicPath,
	hot: true,
	inline: true,
	historyApiFallback: true,
	progress: true,
	stats: { colors: true },
});

//将其他路由，全部返回index.html
server.app.get('*', function(req, res) {
	res.sendFile(__dirname + '/src/index.html')
});
server.listen(8888, function() {
	console.log('正常打开8888端口')
});
