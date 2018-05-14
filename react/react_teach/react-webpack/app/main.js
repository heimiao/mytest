require("./sass/index.scss")
var React = require('react');
var ReactDom = require('react-dom');
var App = require('./components/component');

ReactDom.render(<App data={["map","set","test"]}/>, document.getElementById('app'))