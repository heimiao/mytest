import React, { PropTypes as P } from 'react';
import { Router, Route, Link, hashHistory } from 'react-router';
import { Breadcrumb, Alert } from 'antd';

class Nav extends React.Component {

	render() {
    
    return (
      	<div>
        	<Link to='/calendar'>calendar</Link>
        	<Link to='/grades'>grades</Link>
        	<Link to='/messages'>messages</Link>
     	</div>
    );
  }
}
export default Nav;
