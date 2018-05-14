import React from 'react'
import FilterLink from '../containers/FilterLink'

const  Footer=()=>(
	<p>
		show:
		{""}
		<FilterLink filter="showAll">
			显示所有
		</FilterLink>
		<FilterLink filter="showActive">
			只显示未删除项
		</FilterLink>
		<FilterLink filter="showDel">
			只显示删除项
		</FilterLink>
	</p>
	) 
export default Footer;