let nextTodoId = 0

//定义所有Action
class Action {
	constructor(){}
	addTodo(){
		return {
			type:"ADD_TODO",
			index:nextTodoId++,
			text
		}
	}
	setVisibilityFilter(filter){
		return {
			type:"SET_VISIBILITY_FILTER",
			filter
		}
	}
	toggleTodo(id){
		return {
			type:"TOGGLE_TODO",
			id
		}
	}
}

export default Action;