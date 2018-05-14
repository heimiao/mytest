var React = require('react')
var ReactRouter = require('react-router')
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var hashHistory = ReactRouter.hashHistory; 
var IndexRoute= ReactRouter.IndexRoute; 
var Redirect= ReactRouter.Redirect; 

var Home=require("../components/home");
var App = require('../components/component');  
var App2=require("../components/component2");
var App3=require("../components/component3");

//子路有页面
var child1 = require('../components/componentChild/child_first'); 
var child2=require("../components/componentChild/child_scd");	



 
var  App4 = React.createClass({ 
	render:function(){
    return (
    	<div>
			我是子路的第一个页面我是子路的第一个页面我是子路的第一个页面我是子路的第一个页面我是子路的第一个页面我是子路的第一个页面我是子路的第一个页面我是子路的第一个页面我是子路的第一个页面我是子路的第一个页面我是子路的第一个页面我是子路的第一个页面我是子路的第一个页面我是子路的第一个页面我是子路的第一个页面我是子路的第一个页面我是子路的第一个页面我是子路的第一个页面
     	</div>
    ); 
  }
});



//<App data={["map","set","test"]}/>

module.exports=React.createClass({
	render:function(){ 
		return(
			<Router history={hashHistory}>
				
					{/*路由嵌套*/}
				<Route path="/"  component={App}> 
					{/*indexRout是设置首页面的*/}
					<IndexRoute component={Home}/>
					<Route path="/(child1)" component={child1}/> 
					<Route path="/child2/**" component={child2}> 
						 
					</Route>
				</Route>
				{/*路由通过？传递参数*/}
				<Route path="/app2" component={App2}/>
				{/*路由通过/:id传递参数*/}

				<Route path="/app3" component={App3}>
					 {/*Redirect是做路由转发*/}
					＜Redirect from="msg/:id" to="/msg/:id" />
				</Route>
				
		    </Router>	
		);
	}
})

