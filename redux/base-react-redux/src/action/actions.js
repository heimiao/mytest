export const ADD_TODO = 'ADD_TODO';
export const TOGGLE_TODO = 'TOGGLE_TODO'
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER'

export const VisibilityFilters = {
	SHOW_ALL: 'SHOW_ALL',
	SHOW_COMPLETED: 'SHOW_COMPLETED',
	SHOW_ACTIVE: 'SHOW_ACTIVE'
}


//定义行为描述 
class Action { 
	//Action 创建方法
	addToDo(text){
  		//添加todo方法
  		return {type:ADD_TODO,text}
  	} 

  	toggleTodo(index) {
  		return { type: TOGGLE_TODO, index }
  	}

  	setVisibilityFilter(filter) {
  		return { type: SET_VISIBILITY_FILTER, filter }
  	}
  }

export default Action;
