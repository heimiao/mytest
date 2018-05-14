var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlwebpackPlugin = require('html-webpack-plugin'); //该插件是编译html用的
module.exports = {
	entry: ['webpack/hot/dev-server', path.resolve(__dirname, 'app/main.js')],
	output: {
		path: path.resolve(__dirname, 'build'),
		// publicPath: '/assets/',
		filename: 'index.js',
	},
	devServer: {
		inline: true,
		port: 6868
	},
	module: {
		loaders: [{
			test: /\.js?$/,
			exclude: /node_modules/,
			loader: 'babel',
			query: {
				presets: ['es2015', 'react','stage-0']
			}
		}, {
			test: /\.css$/,
			loader: 'style!css'
		}, {
			test: /\.less$/,
			loader: 'style!css!less'
		}, {
			test: /\.scss$/,
			//loader: 'style!css!sass?sourceMap'
			loader: ExtractTextPlugin.extract(
				'css?sourceMap!' +
				'sass?sourceMap'
			)
		},{
			test: /\.(png|jpg)$/,
			loader: 'url?limit=8192&name=images/[hash:8].[name].[ext]'
		}]
	},
	plugins: [
		new ExtractTextPlugin('styles.css'),
		new HtmlwebpackPlugin({
			title: 'Hello World app',
			template: "./app/html/index.html",
			/*minify:{ //压缩HTML文件
			removeComments:true, //移除HTML中的注释
			collapseWhitespace:true //删除空白符与换行符
			}*/
		})
	]
}