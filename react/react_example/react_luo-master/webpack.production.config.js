var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin'); // 为了单独打包css
var HtmlWebpackPlugin = require('html-webpack-plugin'); //生成html
//定义地址
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'src'); //__dirname 中的src目录，以此类推
var APP_FILE = path.resolve(APP_PATH, 'app'); //根目录文件app.js地址
var BUILD_PATH = path.resolve(ROOT_PATH, 'build/dist'); //发布文件所存放的目录


module.exports = {
    entry: {
        app: APP_FILE,
    },
    output: {
        path: BUILD_PATH, // 将文件打包到此目录下
        publicPath: '/', // 在生成的html中，文件的引入路径会相对于此地址，生成的css中，以及各类图片的URL都会相对于此地址
        filename: '[name].js',
        chunkFilename: '[name].chunk.js',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style', ['css']), // 用这种方式写的，表示此类文件单独打包成一个css文件
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('style', ['css','less']),
            },
            {
                test: /\.(eot|woff|svg|ttf|woff2|gif|appcache|mp3)(\?|$)/,
                exclude: /node_modules/,
                loader: 'file-loader?name=[name].[ext]',
            },
            {
                test: /\.(png|jpg|gif)$/,
                exclude: /node_modules/,
                loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]',
                //注意后面那个limit的参数，当你图片大小小于这个限制的时候，会自动启用base64编码图片
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({ // 一定要配置这个，这个是为了告诉webpack，当前用什么模式打包代码，production生产模式，dev开发模式
            'process.env': {
                NODE_ENV: JSON.stringify('production') //定义生产环境
            }
        }),
        // 此插件详细教程 http://www.cnblogs.com/haogj/p/5160821.html
        new HtmlWebpackPlugin({  //根据模板插入css/js等生成最终HTML
            filename: '../index.html', //生成的html存放路径，相对于 output.path
            template: './src/index_template.html', //html模板路径
            inject: true, // 是否将js放在body的末尾
            hash: false, // 是否为本页面所有资源文件添加一个独特的hash值
        }),
        
        // 配置了这个插件，再配合上面loader中的配置，将所有样式文件打包为一个单独的css文件
        new ExtractTextPlugin('[name].css'),

        // 根据上面entry中的配置，将那些公共的模块、代码打包为一个单独的js文件
        // 下面这句话是自动去匹配，webpack遍历所有资源，发现是模块的，而且这个模块不是在src中的，就提取到公共js中
        new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js', (module, count) =>
      module.resource && module.resource.indexOf(APP_PATH) === -1),

        // Uglify 加密压缩源代码
        new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false, // 删除代码中所有注释
            },
            compress: {
                warnings: false, // 估计是不输出警告信息之类的
            },
        }),
    ],
    // 这个里面有很多配置，可以理解为配置各种解决方案
    resolve: {
        extensions: ['', '.js', '.jsx', '.less', '.css'], //后缀名自动补全
    }
};