//该文件是组件合并文件
import React from 'react' 

import Footer from './Footer' 
import AddTodo from '../containers/AddTodo' 
import VisibleTodoList from '../containers/VisibleTodoList'

const App=()=>(
	<div> 
		 <AddTodo />
		 <VisibleTodoList /> 
		 <Footer />
	</div>)

export default App;