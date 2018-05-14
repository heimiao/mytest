import { createStore } from 'redux'
import Reducer from './reducers'
import Action from './actions'

//创建store状态树
let store = createStore(new Reducer().combineRds())
class Store{
	constructor(){
		console.log(store.getState());
		//监听状态树的情况
		this.unsubscribe = store.subscribe(() =>{
			// console.log(store.getState())
			}
		)

		//发起一系列 action
		store.dispatch(new Action().addToDo('Learn about actions'))
		store.dispatch(new Action().toggleTodo('1'))
		
		// 停止监听 state 更新
		this.unsubscribe();
	}
	render() {
		return ""
	}
}

export default Store;

