import { combineReducers } from "redux"
import todos from './todos'
import visibilityFilter from './visibilityFilter'

//用redux的combineReducers方法合并reducer处理
const todoApp = combineReducers({
    todos,
    visibilityFilter
})

export default todoApp
