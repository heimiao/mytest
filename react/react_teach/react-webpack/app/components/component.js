var React = require('react'); 
	 	module.exports = React.createClass({

	   render: function () {
	  	var styles={ 
	  		width:"500px",
	  		height:"600px"
	  	};  
	  	 var commentNodes=this.props.data.map(function(comment){
				return (
					<input type="button" key={comment} className="btn_warning" value="遍历"/> 
				);
		 }); 
		
	    return (
	    	<div>
	    		<h1>
			       	欢迎进入黑猫编程React世界！！！
			    </h1> 
			    <input type="button" className="btn_error" value="错误按钮"/> 
			    {commentNodes}
			    <button className="btn_info">普通按钮</button>
			    
			    <img src={require('../images/test.jpg')}/>
			    <div style={styles} className="test_img"></div>
	    	</div> 
	    ); 
		  }
	});