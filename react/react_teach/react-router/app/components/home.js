var React = require('react');
var Link = require('react-router').Link;
var IndexLink=require('react-router').IndexLink;
 module.exports = React.createClass({   
  render: function () {  
    return ( 
    	<div> 
    		<h1>
				我是默认首页面，访问根目录就是我这个页面咯 
		    </h1> 
			<ul>
				<li>不带连接的列表项</li>
				<li><a href="/">带有a标签的列表项</a></li>
				 {/*指定跟目录下用indexLInk而不是Link标签，因为如果用link会影响activestyle*/}
				<li><IndexLink to="/" activeClassName="active">带有IndexLink唯一可以指向更目录的标签</IndexLink></li>
				<li><Link to="/app2?data=默认,测试" style={{color: 'red'}}>带有Link标签的列表项</Link></li>
				<li><Link to="/app2?data=默认,测试" className="active">改变link的样式属性</Link></li>
			</ul>
    	</div> 
    ); 
  }
});
