import Action from './actions';
import { combineReducers } from 'redux'

const initialState = {
	visibilityFilter: "SHOW_ALL",
	todos: []
};

//根据行为描述 计算state及覆盖state
class Reducer { 
	//Reducer现在只需要谨记 reducer 一定要保持纯净。只要传入参数相同，返回计算得到的下一个 state 就一定相同。没有特殊情况、没有副作用，没有 API 请求、没有变量修改，单纯执行计算。
	//手写方法合并redues
	todoApp(state = initialState,action){ 
		 //合并下边todos和visibilityFilter两个方法
		}

	//redux自带方法合并redues
	combineRds(){ 
		let visibilityFilter=this.visibilityFilter;
		let todos=this.todos;
		return combineReducers ({
			visibilityFilter,
			todos
		});
	}
 
	//reducers
	todos(state = [], action){
		switch (action.type) {
			case "ADD_TODO":
			return [
			...state,
			{
				text: action.text,
				completed: false
			}
			]
			case "TOGGLE_TODO":
			return state.map((todo, index) => {
				if (index === action.index) {
					return Object.assign({}, todo, {
						completed: !todo.completed
					})
				}
				return todo
			})
			default:
			return state
		}
	}

	visibilityFilter(state = "SHOW_ALL", action){
		switch (action.type) {
			case "SET_VISIBILITY_FILTER":
			return action.filter
			default:
			return state
		}
	} 
}

	// //redux自带方法合并redues
	// export const todoApp = combineReducers({ 
	// 		new Reducer().visibilityFilter,
	// 		new Reducer().todos
	// })

	export default Reducer;
