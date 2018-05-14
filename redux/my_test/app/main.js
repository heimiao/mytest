require("./sass/index.scss")

import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'

import { createStore } from 'redux'
import { Provider } from 'react-redux' 



//定义子组件
class App extends Component{
	
static propTypes = {
    value: PropTypes.number.isRequired,
    onIncrement: PropTypes.func.isRequired,
    onDecrement: PropTypes.func.isRequired
  }

 render(){
 	 const { value, onIncrement, onDecrement } = this.props
 	return(
		<div>
		 <h1>{value}</h1>	
			 <button className="btn_success" onClick={onIncrement}>加一</button> 
			 <button className="btn_success" onClick={onDecrement}>减一</button> 
		</div>
	)
 }
}
	 
	 
//定义reducer函数
const reducer = (state=0,action)=>{
	switch(action.type){
		case"add":return state+1
		case"del":return state-1
		default:return state
	}
} 

//存放执行action行为的方法
const store = createStore(reducer);


const render=()=> ReactDOM.render(<App  
	 	value={store.getState()}
	 	onIncrement={()=>store.dispatch({type:'add'})}
	 	onDecrement={()=>store.dispatch({type:'del'})}
	 	
	 	/>
     , document.getElementById('app')
	)


store.subscribe(render)
render();
