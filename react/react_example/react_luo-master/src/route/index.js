// =========================
// Base router
// =========================

// ===================
// Libs
// ===================

import React from 'react';
import { Route, Redirect, IndexRedirect } from 'react-router';

// ===================
// Containers
// ===================

import APP from '../a_container/root';
import TestContainer from '../a_container/home/index';
import TestContainer2 from '../a_container/home2/index';
import Calendar from '../a_component/main/Calendar/index';
import Grades from '../a_component/main/Grades/index';
import Messages from '../a_component/main/Messages/index';
// ===================
// Async get routes
// ===================

// TODO
var firstRouter = React.createClass({
  render: function () {
  	var styles={
  		border:"1px solid red",
  		width:"287px",
  		height:"287px",
		float:"left"
  	};  
    return (
    	<div>
    		<h1>  
				<div>一级路由控制</div>  
		     </h1>  
			 {this.props.children} 
    	</div> 
    ); 
  }
});
var child1 = React.createClass({
  render: function () {
  	var styles={
  		border:"1px solid red",
  		width:"287px",
  		height:"287px",
		float:"left"
  	};  
    return (
    	<div>
    		<h1>  
				<div>二级路由控制</div>  
		     </h1>   
    	</div> 
    ); 
  }
});
// ===================
// Exports
// ===================

// 可以在这里写一些在路由即将被改变时触发的函数
// 可以用参数replace改变接下来的路由地址
const requireAuth = (nextState, replace) => {
    // replace({ pathname: '/login' });
};

export default (
  <Route path="/" component={APP}>
    <IndexRedirect to="/home" />
    <Route onEnter={requireAuth} path="/home" component={TestContainer} />
    <Route onEnter={requireAuth} path="/home2" component={TestContainer2}/>  
	<Route path="/home3" component={firstRouter}>
		  <Route path="/home3/child" component={child1}/> 
	</Route>
    <Route path="/calendar" component={Calendar} />
    <Route path="/grades" component={Grades} />
    <Route path="/messages" component={Messages} />
    <Redirect from='*' to='/'  />
  </Route>
);
