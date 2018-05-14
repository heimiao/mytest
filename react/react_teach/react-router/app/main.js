//var component = require('./app.jsx'); 
//import React from 'react';
//import component from "./components/component.js"
//import ReactDom from 'react-dom';
//import App from './app.jsx';

//导入css
require("./sass/index") 
var React = require('react');
var ReactDom = require('react-dom'); 
//var App = require('./components/component'); 
var Router = require('./router/router');   


ReactDom.render(<Router />, document.getElementById('app'))

  