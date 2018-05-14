var React = require('react');
 module.exports = React.createClass({   
  render: function () { 
	  console.log(this.props.location.query.data);
	  
	  var commentNodes=this.props.location.query.data.split(",").map(function(comment){
		
		return (
			<div key={comment} className="btn_warning">{comment}</div>
		);
	}); 
    return ( 
    	<div>
			<a className="btn_default">默认按钮</a>
		    <input type="button" className="btn_error" value="错误按钮"/>
		    <span className="btn_success">成功按钮</span> 
		    {commentNodes} 
		    <button className="btn_info">普通按钮</button> 
    		<h1>
		       	我是第二个组建页面噢噢在这里所要做的业务都加载到这里
				通过路由传递过来的参数：{this.props.location.query.data}
		     </h1> 
    	</div> 
    ); 
  }
});
