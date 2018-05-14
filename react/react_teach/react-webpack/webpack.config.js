var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	entry: ['webpack/hot/dev-server', path.resolve(__dirname, 'app/main.js')],
	output: {
		path: path.resolve(__dirname, 'build'),
		// publicPath: '/assets/',
		filename: 'index.js',
	},
	module: {
		loaders: [{
			test: /\.jsx?$/,
			exclude: /node_modules/,
			loader: 'babel',
			query: {
				presets: ['es2015', 'react']
			}
		},  {
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
		new ExtractTextPlugin('styles.css')
	]
}