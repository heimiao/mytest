import React ,{ Component }from 'react'

import FilterLink from '../containers/FilterLink'

class Footer extend Component{
	render(){
		return(
			<div>
			Show:{''}
			<FilterLink filter="SHOW_ALL">ALL</FilterLink>
			{','}
			<FilterLink filter="SHOW_ACTIVE">Active</FilterLink>
			{','}
			<FilterLink filter="SHOW_COMPLETED">Completed</FilterLink>
			</div>
			 )
	}
}
export default Footer