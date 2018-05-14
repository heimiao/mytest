import { connect } from 'react-redux'
import { toggleTodo } from '../actions'
import TodoList from '../components/TodoList'

const getVisibleTodos = (todos, filter) => {
    switch (filter) {
        case "addAll":
            return todos
        case "showActive":
            return todos.filter(t => t.completed)
        case "showDel":
            return todos.filter(t => !t.completed)
        default:
            throw new Error('unknown filter:' + filter)
    }
}

const mapSateToProps=(state)=>({
	 todos: getVisibleTodos(state.todos, state.visibilityFilter)
})