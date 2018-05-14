/* 这是用于开发环境的webpack配置文件 */
var path = require('path');
var webpack = require('webpack');

//定义地址
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'src'); //__dirname 中的src目录，以此类推
var APP_FILE = path.resolve(APP_PATH, 'app'); //根目录文件app.js地址
var BUILD_PATH = path.resolve(ROOT_PATH, '/test123'); //发布文件所存放的目录

module.exports = {
    entry: {
        app: [
            'webpack-dev-server/client?http://localhost:8888', // 热更新监听此地址
            'webpack/hot/only-dev-server', // 启用热更新
            APP_FILE    // 入口文件
        ]
    },
    output: {
        publicPath: '/test/', // 这是在启动webpack-dev-server时，index.html中引用的路径应该相对于此路径
        path: BUILD_PATH, // 将打包好的文件放在此路径下，dev模式中，只会在内存中存在，不会真正的打包到此路径，只有在真正执行打包命令时，才会生成到此路径中
        filename: 'bundle.js', //编译后的文件名字
    },
    devtool: 'source-map',
    module: {
        preLoaders: [
          {
            test: /\.js?$/,
            loader: 'eslint',
            exclude: /node_modules/,
          },
        ],
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
            },
            {
                test: /\.css$/,
                loaders: ['style', 'css'],
            },
            {
                test: /\.less$/,
                loaders: ['style', 'css', 'less'],
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
        new webpack.HotModuleReplacementPlugin(),   // 热更新插件
        new webpack.NoErrorsPlugin()    // 即使有错误也不中断运行
    ],
    resolve: {
        extensions: ['', '.js', '.jsx', '.less', '.css'], //后缀名自动补全
    }
};