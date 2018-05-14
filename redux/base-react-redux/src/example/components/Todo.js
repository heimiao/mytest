import React,{ Component } from 'react'
import PropTypes from 'prop-types'


/*Todo.propTypes = {
  onClick: PropTypes.func.isRequired,
  completed: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired
}
const Todo = ({ onClick, completed, text }) => (
  <li
    onClick={onClick}
    style={ {
      textDecoration: completed ? 'line-through' : 'none'
    }}
  >
    {text}
  </li>
)
*/

class Todo extend Component{ 
	constructor(){ } 
	render(){
		const onClick=this.props.onClick;
		const completed=this.props.completed;
		const text=this.props.text;
		return(<li
			onClick={onClick}
			style={{
					textDecoration: completed ? 'line-through' : 'none'
				}}
				>
			{text}
			</li>)
	}
}

export default Todo