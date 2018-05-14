## 案例使用手册
	
	//下载项目包
	git clone git@github.com:heimiao/react-webpack.git
	//跳转到react-webpack目录下
	cd react-webpack
	//安装依赖包
	npm install 
	//启动项目
	npm run dev
	
	访问http:localhost:6868

---

layout: index

title: "使用wepack搭建自己的react小程序"

---

 本博客暂不支持评论模块，后期会努力加上，
有问题讨论群如下
QQ群：536286957
## 使用wepack搭建自己的react小程序（一）
**前言：**前几天刚把jekyll这块看了下同时也把教程写下来放到了git上，预防自己忘记也给小白更多的机会练练手。今天就把我用webpack搭建项目的顺序一步一步道来。我相信走过这么一遭就对react了解的差不多了。

**系统配置：**window7 64位系统，

**必备条件**gitbash命令窗口 node环境

至于其他系统我没有也请见谅，呵呵，好了废话不多说进入主题

## 1.webpack安装

#### 1.1.项目新建
在电脑任何一个地方新建一个文件夹，比如叫react-webpack文件夹，打开命令窗口进入该目录，
输入命令：

	npm init
在我们的react-webpack文件下会自动生成一个package.js文件，我们暂时不管这个文件，
接下来我们再次输入安装webpack的命令，命令如下：
	
	//
	npm install webpack -g	

	npm install webpack --save-dev

（PS:安装有可能报错，是由于国家的防火墙，没办法，自己翻墙或者通过国内景象安装。）
我们需要在react-webpack新建如下图的目录，全部手动创建。

![目录]({{site.url}}/image/wepack_img/tree.png)

+ app/ 目录使我们放源代码的地方
+ build/  是webpack生成工程的地方
+ node_moudules则是我们安装webpack安装的模块包，以后陆续会安装其他的本地包都在此

#### 1.2.webpack简单配置

打开我们react-webpack项目录下的webpack.config.js进行简单的配置，如下：
	
	//webpack.config.js

	var path=require("path");
		module.exports={

		entry:path.resolve(__dirname, 'app/main.js'),
		output: {
			path: path.resolve(__dirname, 'build'),
			filename: 'bundle.js',
		}
	};

针对webpack.config.js配置项有必要讲解下，以后陆续会有其他的配置项加进来。
(PS:**\_\_dirname**是**node**的一个变量，是获取本模块相对项目的绝对位置)

+ entry:是页面入口文件配置
+ output：是对应输出项配置

到这里我们就可以编写属于自己的js了，打开app/component.js编码如下：
	
	//component.js

	module.exports = function () {
		var element = document.createElement('h1');
		element.innerHTML = '你好，黑猫';
		return element;
	};
然后打开我们的app/main.js文件，编码如下：

	//main.js

	var component = require('./component.js');
	document.body.appendChild(component());


这两个文件就是把`我是黑猫`字段输出到页面上。

在这里我们先手动在build文件里边新建一个index.html并引入bundle.js,刚才我说了bundle.js是有webpack生成的所以我们只关心配置项就可以了。
现在我们所有的事情都做好之后就只欠webpack编译成bundle.js这步了，在命令窗口你可以执行命令：
`webpack`

当然如果你不想这么运行，也可以在package.json的script标签里边配置自己喜欢的别名，作为启动项命令，配置如下：
	
	//package.json
	
	
	"scripts": {
		"build": "webpack"
		}


配置好后我们执行 `npm run build` 

再打开我们的build目录下会生成一个叫bundle.js了，同时用浏览器打开我们的index.html会显示
“我是黑猫”字段，当然我们需要修改我们的main.js或者其他的js都要执行 **npm run build** 感觉很繁琐。所以我们要添加一个服务**webpack-dev-server**让他安静的运行，不至于我们一直手动运行编译

#### 1.3.热部署项目，实现实时预览
安装命令`npm install webpack-dev-server --save-dev`并且修改package.json。代码如下：
	
	//package.json
	{
		"scripts": {
		"build": "webpack",
		"dev": "webpack-dev-server --devtool eval --progress --colors --hot --content-base build"
		}
	}

你也许对dev的配置项很模糊吧，解释如下：

1. webpack-dev-server - 在 localhost:8080 建立一个 Web 服务器
2. --devtool eval - 为你的代码创建源地址。 当有任何报错的时候可以让你更加精确地定位到文件和行号
3. --progress - 显示合并代码进度
4. --colors - Yay， 命令行中显示颜色！
5. --content-base build - 指向设置的输出目录

这个模块的功能就是一个服务，让我们启动下我们的服务，输入命令：`npm run dev`剩下来的就是让我们访问http://localhost:8080。当然浏览器这时并不会自动的刷新，而且还需要们手动F5，为了不再做F5的动作。这时我们还需要做两件事，第一件修 index.html页面，代码如下：
	
	//index.html

	<!DOCTYPE html>
	<html>
	<head>
	<meta charset="UTF-8"/>
	</head>
	<body>

	<script src="http://localhost:8080/webpack-dev-server.js"></script>

	<script src="bundle.js"></script>
	</body>
	</html>

第二修改webpack.config.js的配置文件，代码如下：
	
	//webpack.config.js

	var webpack = require('webpack');
	var path = require('path');
 
	module.exports ={
		entry:  ['webpack/hot/dev-server', path.resolve(__dirname, 'app/main.js')],
		output:{
			path:path.resolve(__dirname,'build'),
			filename: 'bundle.js',
		}
	}

到这里我们想要的结果可就达到了，我们随时修改代码，浏览器会自动刷新我们所做的修改。然后运行我们的启动命令`npm run dev`访问http://localhost:8080，同样也可以 http://localhost:8080/webpack-devserver/bundle 。 这个会触发一个默认的你不能控制的 index.html

接下来的教程我将以提问为导向，一步一往下走了。别分神，小心跑偏了。
目前我们的webpack的基本功能跑起来了，不过有一个问题，那就是webpack不仅仅打包我们的js模块，那我们的less，sass，html，css,静态资源要怎么打包呢？需要怎么在我们的项目中应用呢？

**警告**以下我会把output配置项的filename:bundle.js修改成了自己喜欢的filename:index.js了，所以index.html引入的bundle.js也的改成index.js


#### 1.4.webpack针对静态资源的配置和使用

加载我们的静态资源就需要我们在webpack.config.js中添加loader了，而这个loader就是负责把静态资源转化成webpack能打包的js.这下明白了么呵呵。而webpack这个loader是个遵循管道方式的链式调用，但是每个返回都是javascript噢噢。以下都是loader的特性。

+ Loader 可以通过管道方式链式调用，每个 loader 可以把资源转换成任意格式并传递给下
一个 loader ，但是最后一个 loader 必须返回 JavaScript。
+ Loader 可以同步或异步执行。
+ Loader 运行在 node.js 环境中，所以可以做任何可能的事情。
+ Loader 可以接受参数，以此来传递配置项给 loader。
+ Loader 可以通过文件扩展名（ 或正则表达式） 绑定给不同类型的文件。
+ Loader 可以通过 npm 发布和安装。
除了通过 package.json 的 main 指定，通常的模块也可以导出一个 loader 来使用。
+ Loader 可以访问配置。插件可以让 loader 拥有更多特性。
+ Loader 可以分发出附加的任意文件

当然loader不单单可以在我们的配置文件里边配置也可以同webpack 在命令行里边运行
好了介绍了下loader。我们继续我们的react项目搭建。

打开我们的webpack.config.js配置如下：
		
		//webpack.config.js
	
		var webpack = require('webpack');
		var path = require('path'); 

		module.exports ={
			entry:  ['webpack/hot/dev-server', path.resolve(__dirname, 'app/main.js')], 
			output:{
				path:path.resolve(__dirname,'build'),
				filename: 'index.js',
			},  
			//加载我们的静态资源loader
			module:{ 
					loaders:[
					 {
							test: /\.css$/,
			      			loader: 'style!css'
						},{
							test: /\.less$/,
			      			loader: 'style!css!less'
						},{
							test: /\.scss$/,
			      			loader: 'style!css!sass?sourceMap'
						},{
							test: /\.(png|jpg)$/, 
			     			loader: 'url?limit=8192' 
						}
					]
				} 


		}

通过webpack的配置文件可以看到我配置了css，sass，less，和图片，这些配置项解释如下：

+  loaders：可以是数组可以是对象。我这里是数组形式的
+  test ：  当loader读取这些文件的时候所要遵循的正则表达式
+  loader：加载我们需要的转化器，多个转化器用“！”分割

现在我单独拿我喜欢的sass来开刀，其他配置接下来我会挨个介绍。（PS:sass需要安装node-sass编译器的`npm install node-sass --save-dev`）

单看我的sass用到了style css 和sass这三个loader,可能你有疑问了，为什么需要这三个呢？

答：sass-loader负责读取我们的sass文件并且编译成css，编译好后交给css-loader读取转化再交给style-loader写入到我们的页面上。我在上边说了loader遵循管道链式调用的，每个返回都是一个javascript所以一直传递到style-loader上并且写到页面上。当然你也可以这样配置：`loader:style-loader!css-loader!sass-loader`把loader加上。后边的sourceMap是为了方便我们调试用的

配置就算是完事了，安装我们的sass-loader ,`npm install node-sass css-loader style-loader sass-loader --save-dev`。等我们安装完成之后我们就可以写sass了，在app目录下创建sass/index.scss编写我们的index.scss样式代码如下
	
	html,body{
		background:skyblue;
		h1{
			font-size:16px;
		}
	}


最后我们就差一步了，要把我们写的index.scss导入到 **app/main.js**文件内 代码如下：
	
	//main.js 
	
	var component = require('./component.js');  
	document.body.appendChild(component());
	require("./sass/index.scss") 

接下来运行`npm run dev`访问http://localhost:8080,看到天蓝色的背景说明你成功了。
说到这里你会发现我们的css自动发布到html页面上了，感觉又回到了八十年代的编码方式了， 但是我想要单独编译成独立css文件要怎么办呢？

#### 1.5.webpack打包成独立的css文件

想要打包成我们的独立文件，我们需要extract-text-webpack-plugin这个插件，废话少说，安装这个插件`npm install extract-text-webpack-plugin --save-dev`

修改webpack.config.js配置如下：

		//webpack.config.js
		
	var webpack = require('webpack');
	var path = require('path');
	var ExtractTextPlugin = require("extract-text-webpack-plugin");
	
	module.exports = {
		entry: ['webpack/hot/dev-server', path.resolve(__dirname, 'app/main.js')],
		output: {
			path: path.resolve(__dirname, 'build'),
			filename: 'index.js',
		},
		module: {
			loaders: [{
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
			}, {
				test: /\.(png|jpg)$/,
				loader: 'url?limit=8192'
			}]
		}, 
		plugins: [
			new ExtractTextPlugin('styles.css')
		] 
	}

通过配置文件我们可以看到，修改了样式loader的加载方式，而且还新增了plugins插件配置项，这个配置项就是告诉webpack要把css输出到哪个文件下，当然我这里输出到根目录下style.css文件下你也可以添加自己的路径（PS:style/style.css）
当我们配置好之后可以执行命令：`webpack`
你会在你的build目录下会发现新增了一个style.css是不是很神奇，把你的style.css引入到你的index.html吧！然后启动我们的项目`npm run dev`这样做是不是感觉很爽呀
(PS:直接执行npm run dev也能看到，执行webpack是把css编译到本地)！！可是问题又来了，那我们的图片需要怎么打包进去呢？？

#### 1.6.webpack打包图片

在app目录下新建images目录 app/images/，你随便找个图片放到app/images下，接下来我们要对这个目录下的图片进行打包。

当然我们需要打包图片的话，要url-loader和file-loader这两个加载器，同样的办法，安装这两个loader到我们的本地项目作为依赖项执行命令：`npm install url-loader file-loader --save-dev`当我们把这两个loader安装完之后，打开我们的webpack.config.js配置项如下

		//webpack.config.js
		
		var webpack = require('webpack');
		var path = require('path');
		var ExtractTextPlugin = require("extract-text-webpack-plugin");
		
		module.exports = {
			entry: ['webpack/hot/dev-server', path.resolve(__dirname, 'app/main.js')],
			output: {
				path: path.resolve(__dirname, 'build'),
				filename: 'index.js',
			},
			module: {
				loaders: [{
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
				}, {
					test: /\.(png|jpg)$/,
					loader: 'url?limit=8192'
				},{
						test: /\.(png|jpg|gif)$/, 
		     			loader: 'url?limit=8192&name=[hash:8].[name].[ext]' 
				 }]
			}, 
			plugins: [
				new ExtractTextPlugin('styles.css')
			] 
		}

再此我们的配置项新增了图片的loader，这个loader只是加载了rul-loader，后边的limit的意思是超过8192字节了会以64bate编码方式输入并不是超过这么大就不打包了。之后跟的参数name则是我们的输出路径，需要把图片放到build目录下的哪个地方。后边的则是以hash: 编码方式生成图片文件名称，

接下我们要使用我们的图片了。我先说在css中引用图片？如果需要在css那你就得需要把我们的index.scss文件引入到我们的main.js内部,代码如下

	//app/main.js

	var component = require('./component.js'); 
	require("./sass/index.scss") 
	document.body.appendChild(component());

修改我们的index.scss文件，为html添加一个背景，代码如下：
	
	 html{
    	background:url("../images/test.jpg");   	
	    h1{
	        font-size:18px;
	    }
	｝

当我们这一切做好之后，启动webpack编译，执行命令`webpack`你会发现你的build目录下新增一个image的文件包含了你的图片。这个时候启动我们的项目`npm run dev`你会发现我们的网页已经不再是天蓝色背景了，而是你引入的图片了。在此我们只是做了一css引用图片那我们的react应该怎么引用呢？

#### 1.7.react中使用webpack打包的图片
千呼万唤始出来，我们的react还半遮面。我们要使用react的话需要安装babel组件，所需babel命令如下
`npm install react babel-core babel-loader babel-preset-es2015 babel-preset-react --save-dev`然后修改main.js和component.js以及webpack.config.js 

修改webpack.config.js,代码如下 

	//webpack.config.js	

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
				test: /\.(png|jpg|gif)$/,
				loader: 'url?limit=8192&name=images/[hash:8].[name].[ext]'
			}]
		},
		plugins: [
			new ExtractTextPlugin('styles.css')
		]
	}

修改main.js为，代码如下：
	
	//main.js

	require("./sass/index.scss")
	var React = require('react');
	var ReactDom = require('react-dom');
	var App = require('./components/component');
	
	ReactDom.render(<App data={["map","set","test"]}/>, document.getElementById('app'))

通过代码我们可以看到这里改的和以前的main.js一点也不一样了，不再是appenChild原生方法了，而是引入了react的reacDom组件。当然还有我们前边引入的sass/index.scss以及react，和我们的commpoent组件。为了分辨js的入口清晰点我把compoent。js放到app/component目录下了。以及在index.html页面上添加一个`<div id='app'></div>`标签，接下来我们要在这个标签内部追加内容了。
当然我们这里用到了一个新的组件库react-dom我们需要对他做安装,安装命令`npm install react-dom --save-dev`

然后修改我们的components/component.js组件
		
	//component.js	

	var React = require('react'); 
	 	module.exports = React.createClass({

	   render: function () {
	  	var styles={
	  		border:"1px solid red",
	  		width:"500px",
	  		height:"600px"
	  	};  
	  	 var commentNodes=this.props.data.map(function(comment){
				return (
					<input type="button" key={comment} className="btn_warning" value="遍历"/> 
				);
		 }); 
		
	    return (
	    	<div>
	    		<h1>
			       	欢迎进入黑猫编程React世界！！！
			    </h1> 
			    <input type="button" className="btn_error" value="错误按钮"/> 
			    {commentNodes}
			    <button className="btn_info">普通按钮</button>
			    
			    <img src={require('../images/test.jpg')}/>
			    <div style={styles} className="test_img"></div>
	    	</div> 
	    ); 
		  }
	});

通过component.js中我们可以看到我们&lt;img&gt标签的src属性指向的是require("url")当然，学到这里我们没有用新的ES6语法，依然用的是ES5的语法写的。如果你会es6你可以改成E6的语法
看到component.js里的代码是不是懵圈了，我会挨个介绍给你，

+ React.createClass：这个不再是我们以前的function函数了，而他返回值是reactDom。render方法所要接收的jsx对象或者是dom对象，
+ this.props：这个则是获取该组件的参数的方法
+ data.map:这个map方法只是对数组的遍历（PS:不能对json对象进行map遍历--这点确实很坑的）
+ className:则是html中的class类样式（PS:js中class和for是保留字，所以在js中用className代替class类样式）

[了解更多的React语法]('http://www.react-cn.com/docs/forms.html')

做到这里我们写了一些react的语法和组件，如果你对react语法不是很了解，我还是推荐你先学习下[react语法]('http://www.react-cn.com/docs/forms.html')，再此我们不做react详细介绍了。,问题又来了呵呵，我还想把html也要通过这样的方式编译到我的build，这样我的build下的文件全部是生成的，我就不用维护build下的html了，这样岂不是更爽呢！！那要怎么打包html呢？

#### 1.8.react打包html

说到这里是我做的最后一个静态资源打包内容了噢噢，
在app目录下新建我们的html文件夹,并且在app/html新建我们的index.html把我们之前的build内的index.html放进来即可。我们需要把这个html编译到build下。
打包html需要安装html-webpack-plugin这个插件负责把我们的html编译到hbuild文件夹下的，首先我们老步骤安装下`npm insall html-webpack-plugin`当我们安装完成之后我们需要继续配置我们的webpack.config.js这个配置文件。
	
	var HtmlwebpackPlugin = require('html-webpack-plugin');//该插件是编译html用的
	/***
		todo
	**/
	//
	plugins:[ 
	 new ExtractTextPlugin('styles.css'),
	 new HtmlwebpackPlugin({
      	title: 'Hello World app',
      	template:"./app/html/index1.html",
      	/*minify:{ //压缩HTML文件
			removeComments:true, //移除HTML中的注释
			collapseWhitespace:true //删除空白符与换行符
			}*/
    	})
	]


+ title: 用于生成的HTML文件的标题。
+ filename: 用于生成的HTML文件的名称，默认是index.html。你可以在这里指定子目录。
+ template: 模板文件路径，支持加载器，比如 html!./index.html
+ inject: true | 'head' | 'body' | false ,注入所有的资源到特定的 template 或者 templateContent 中，如果设置为 true 或者 body，所有的 javascript 资源将被放置到 body 元素的底部，'head' 将放置到 head 元素中。
+ favicon: 添加特定的 favicon 路径到输出的 HTML 文件中。
+ minify:{ 
 //压缩HTML文件 
 removeComments:true, //移除HTML中的注释
 collapseWhitespace:true //删除空白符与换行符
	}
+ hash: true | false, 如果为 true, 将添加一个唯一的 webpack 编译 hash 到所有包含的脚本和 CSS 文件，对于解除 cache 很有用。
+ cache: true | false，如果为 true, 这是默认值，仅仅在文件修改之后才会发布文件。
+ showErrors: true | false, 如果为 true, 这是默认值，错误信息会写入到 HTML 页面中
+ chunks: 允许只添加某些块 (比如，仅仅 unit test 块)
+ chunksSortMode: 允许控制块在添加到页面之前的排序方式，支持的值：'none' | 'default' | {function}-default:'auto'
excludeChunks: 允许跳过某些块，(比如，跳过单元测试的块)

[了解更多html-webpack-plugin插件]("https://www.npmjs.com/package/html-webpack-plugin");

说到这里用webpack打包一些静态的资源以及服务热部署都完事了，当然一个项目不仅仅依赖这些还有别的react-router路由转发,react-tranform热替换，immutable按需加载，等等。。都是我们以后会用到的。今天先暂时到这里，剩下的我会放到[使用wepack搭建自己的react小程序（二）]()当中做详细讲解