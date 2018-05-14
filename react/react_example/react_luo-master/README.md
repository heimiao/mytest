需要的包：

react // react核心，基本功能，构建组件时要用里面的方法
react-dom // react操作dom,渲染组件时药用里面的render等方法
react-redux // react封装的与redux结合的包 所有顶层组件都要用
react-router // 做路由器时要用里面的方法
react-router-redux // 管理历史状态，记录用户操作记录的，是redux连接到react的路由组件的桥梁
redux // redux核心，构建store时要用一下
redux-thunk // 在一些异步dispatch中，可能存在一些隐患，redux-thunk可以管理所有的dispatch，把异步的请求封装起来，我们写代码时就不用去考虑是异步调用dispath还是同步，因为处理方式都一样了

lodash // 深拷贝，一个工具插件，开发中可能会用
reqwest // 异步请求插件，封装了fetch,使参数跟ajax一样
history // 一个location管理库，不用原生的react-router提供的history,用这个，封装了一些方法，可以跳转URL，中途改变URL等

开发模式依赖的包：

webpack // 打包时要用，把所有代码资源整理合并压缩加密等
webpack-dev-server // 一个临时服务器，开发模式下打包完成的文件都存在内存中，并没有真的生成文件。这个包可以启动一个服务，运行打包好的文件。

然后需要对webpack进行配置，详见webpack.dev.config.js

配置中需要用到一些语言解析器的包：

babel-core	// babel核心，必须有它，单独只引入babel-loader是不行的 (还要配置.babelrc,如果不配置这个的话，在webpack中就要显示声明babel-loader所用的语言解析器
,我们还是直接配置一个.babelrc条理比较清晰)
babel-loader // 在webpack中使用babel需要

而babel本身又需要3个语言包：

npm install --save-dev babel-preset-es2015	//翻译ES6
npm install --save-dev babel-preset-react	//翻译React语法
npm install --save-dev babel-preset-stage-3	//翻译ES7第3阶段

react-hot-loader // 配置到webpack中，如果webpack也配置了热更新，那么这个插件可以对修改的部分局部热更新，而不是刷新整个页面
(暂时没用)

style-loader // 将生成的css文件自动插入到html中的<style>标签
css-loader // 处理css文件中url路径问题
url-loader // 处理图片或其他文件，会把小图片编译为base64编码
file-loader // 处理字体文件和gif格式的文件

===========

eslint配置

{
    "env": {    // 环境设置，预定义全局变量，即默认存在以下环境中的全局变量，你在全局范围使用以下环境中自带的那些全局变量时，eslint不会发出警告
        "browser": true, // 浏览器环境，有window对象等
        "commonjs": true, // commonjs,有require方法等
        "es6": true,    // 所有es6的新功能
        "jquery": true, // $符号

    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 8,   // 启用目前最新版（2017）JS语法规则
        "ecmaFeatures": {   // 这里配置额外的语法解析规则
            "impliedStrict": true, // js严格模式
            "experimentalObjectRestSpread": true,   // 启用实验性的object rest/spread properties 
            "jsx": true // 对JSX支持
        },
        "sourceType": "module" // 如果代码中用的是模块化开发，就配置为module
    },
    "plugins": [ // 额外的第3方插件
        "react" // 让eslint支持react的语法，react和jsx并不能等同，所以要配一个这个
    ],
    "rules": { // 具体的各种规则
        "indent": [ // 缩进风格，只能用tab来缩进对齐
            "error",
            "tab"
        ],
        "linebreak-style": [ // 换行符风格，windows风格（CRLF），即后续开发都应该在windows上做开发
            "warn",
            "windows"
        ],
        "quotes": [ // 强制使用单引号包裹字符串对象
            "error",
            "single"
        ],
        "semi": [ // 强制使用分号，这个需要，因为压缩后估计会出错
            "error",
            "always"
        ],
        "no-cond-assign": "error", // 禁止条件表达式中出现赋值操作符
        "no-debugger": "error", // 禁止debugger
        "no-dupe-args": "error", // 禁止function中出现重名参数
        "no-caller": "error", // 禁用 arguments.caller 或 arguments.callee
        "no-invalid-this": "error", // 禁止this关键字出现在类和对象之外
        "no-unmodified-loop-condition": "error", // 禁止一成不变的循环条件
        "no-with": "error", // 禁止使用with语句
        "no-catch-shadow": "error", // 禁止catch子句的参数和外层作用域中有重名变量
    }
