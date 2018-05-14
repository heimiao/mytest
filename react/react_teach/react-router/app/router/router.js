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

//��·��ҳ��
var child1 = require('../components/componentChild/child_first'); 
var child2=require("../components/componentChild/child_scd");	



//<App data={["map","set","test"]}/>

module.exports=React.createClass({
	render:function(){ 
		return(
			<Router history={hashHistory}>
					{/*·��Ƕ��*/}
				<Route path="/"  component={App}> 
					{/*indexRout��������ҳ���*/}
					<IndexRoute component={Home}/>
					<Route path="/(child1)" component={child1}/>
					<Route path="/child2/**" component={child2}/>
				</Route>
				{/*·��ͨ�������ݲ���*/}
				<Route path="/app2" component={App2}/>
				{/*·��ͨ��/:id���ݲ���*/}

				<Route path="/app3" component={App3}>
					 {/*Redirect����·��ת��*/}
					��Redirect from="msg/:id" to="/msg/:id" />
				</Route>
				
		    </Router>	
		);
	}
})

