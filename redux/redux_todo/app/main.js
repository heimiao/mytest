require("./sass/index.scss")

import React from 'react'
import ReactDom from 'react-dom'

import { createStore } from 'redux'
import { Provider } from 'react-redux'


import Counter from './components/App'
import reducer from './reducer'

//存放执行action行为的方法
const store = createStore(reducer);

ReactDom.render(<Provider store={store}>
    <App />
    </Provider>, document.getElementById('app')
)
