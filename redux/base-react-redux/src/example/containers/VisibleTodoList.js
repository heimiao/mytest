import { connect } from 'react-redux'
import { Action } from '../actions'
import TodoList from '../components/TodoList'

const getVisibleTodos=(todos,filter)=>{
	switch (filter) {
		case "SHOW_COMPLETED":
		return todos.filter(t => t.completed)
		break;
		case "SHOW_ACTIVE":
		return todos.filter(t => !t.completed)
		break;
		case 'SHOW_ALL':
		default:
		return todos;
		break;
	}
}
//从Store传递数据到组件
const mapStateToProps=state=>{
	return {
		todos: getVisibleTodos(state.todos, state.visibilityFilter)
	}
} 

//从组件传递数据到Store
const mapDispatchToProps=dispatch=>{
	return {
		onTodoClick:id=>{
			dispatch(new Action().toggleTodo(id))
		}
	}
}

const VisibleTodoList=connect(
	mapStateToProps,
	mapDispatchToProps
	)(TodoList)

export default VisibleTodoList