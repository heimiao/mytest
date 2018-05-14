var webpack = require('webpack');
var path = require('path');
var node_modules = path.resolve(__dirname, 'node_modules');
var pathToReact = path.resolve(node_modules, 'react/dist/react.min');
var ExtractTextPlugin = require("extract-text-webpack-plugin"); //该插件是独立css文件用的
var HtmlwebpackPlugin = require('html-webpack-plugin'); //该插件是编译html用的

module.exports = {
	entry: ['webpack/hot/dev-server',path.resolve(__dirname, 'app/index'),path.resolve(__dirname, 'app/main')],
	resolve: {
		/* alias:{
					"react":pathToReact//试图去匹配压缩过的react.js
				},*/
		extensions: ['', '.js', '.jsx', '.scss']
	},
	output: {
		path: path.resolve(__dirname, 'build'),
		// publicPath: '/assets/',
		filename:'[name].js',
	},
	devServer: {
		inline: true,
		port: 6868
	},
	module: {
		noParse: [pathToReact], //禁止解析压缩的react.js
		loaders: [{
			test: /\.jsx?$/,
			exclude: /node_modules/,
			loader: 'babel',
			query: {
				presets: ['es2015', 'react']
			}
		}, {
			test: /\.css$/,
			loader: 'style!css'
		}, {
			test: /\.less$/,
			loader: 'style!css!less'
		}, {
			test: /\.scss$/,
			//				 loader:'style!css!sass?sourceMap'
			loader: ExtractTextPlugin.extract(
				'css?sourceMap!' +
				'sass?sourceMap'
			)
		}, {
			test: /\.(png|jpg|gif)$/,
			loader: 'url?limit=8192&name=images/[hash:8].[name].[ext]'
		}]
	},
	plugins: [
		new webpack.BannerPlugin("合并的模块都在此该文件下包括了js css 图片"), //添加注释，内置插件，第三方需要自己npm install
		new ExtractTextPlugin('styles.css'),
		new HtmlwebpackPlugin({
			title: 'Hello World app',
			template: "./app/html/index1.html",
			/*minify:{ //压缩HTML文件
			removeComments:true, //移除HTML中的注释
			collapseWhitespace:true //删除空白符与换行符
			}*/
		})
	]
}