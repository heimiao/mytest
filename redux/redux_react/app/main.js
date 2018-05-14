require("./sass/index.scss")

import React from 'react'
import ReactDom from 'react-dom'
import { createStore } from 'redux'

import Counter from './components/component'

import reducer_self from './reducer'
//存放执行action行为的方法
const store = createStore(reducer_self);

const render =
    () => ReactDom.render(<Counter value ={store.getState()}
        onIncrement = {
            () => store.dispatch({type: "add" })
        }
        onDecrement = {
            () => store.dispatch({ type: "del" })
        }/>, 
        document.getElementById('app'));
    
render()
store.subscribe(render)