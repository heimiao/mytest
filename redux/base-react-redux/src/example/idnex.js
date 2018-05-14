import React from 'react'

import { render } from 'react-dom'
import { Provider } from 'react-redux'

import { createStore } from 'redux'

import todoApp from './reducers'
import App from './components/App'
//redux主要由三部分组成：store，reducer，action。四个方法dispatch subscribe getState replaceReducer

//connect，Provider，mapStateToProps,mapDispatchToProps是react-redux提供的
//创建全局Store对象
let store = createStore(todoApp);

class Main{
	constructor(){}
	
	render(){
		return (<Provider>
			<App />
		</Provider>)
	}
}
export default Main
