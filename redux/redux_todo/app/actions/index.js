//此文件是定义action行为描述的

let nextTodoId = 0
//给添加按钮准备的action
export const addTodo = (text) => {
    type: 'addAll',
    id: nextTodoId++,
    text
}

//
export const toggleTodo = (id) => {
    type: "toggleTodo"
    id
}
//过滤
export const setVisibilityFilter = (filter) => {
    type: "setVisibilityFilter"
    filter
}
