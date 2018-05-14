//var component = require('./app.jsx'); 
//import React from 'react';
//import component from "./components/component.js"
//import ReactDom from 'react-dom';
//import App from './app.jsx';

var React=require("react");
 var ReactDom = require('react-dom');  
 
 
var Other=React.createClass({
	render:function(){
		console.log(111111111);
		return (
			<div style="{border:1px solid red;width:200px;height:200px;}">路由之外的页面部分</div>	
		);
	}
})

 
 //ReactDom.render(<Other />, document.getElementById('app2'))