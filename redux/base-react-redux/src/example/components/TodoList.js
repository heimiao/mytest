 import  React,{ Component }from 'react'
 import Todo from './Todo'

class TodoList extend Component{
	render(){
		return(
			<div>
				<h3>我是列表<h3>
				<ul>
				{todos.map(todo=>(
						<Todo key={todo.id} {...todo} onClick={() => onTodoClick(todo.id)} ></Todo>
					))}
				</ul> 
			</div>)
	}
}

export default TodoList