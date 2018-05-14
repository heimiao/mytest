var React = require('react'); 

 module.exports = React.createClass({
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
				<div>加载孩子路由如下内容</div>  
		     </h1>  
			 {this.props.children} 
    	</div> 
    ); 
  }
});
