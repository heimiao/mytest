
//定义子组件reducer
const todo = (state, action) => {
    switch (action.type) {
        case "addAll":
            return {
                id: action.id,
                text: action.text,
                completed: false
            }
        case "toggleTodo":
            if (state.id != action.id) {
                return state
            }
            return {
                ...state,
                complted: !state.completed
            }
        default:
            return state
    }
}

//
const todos = (state = [], action) => {
    switch (action.type) {
        case "addAll":
            return {
                ...state,
                todo(undefined, action)
            }
        case "toggleTodo":
            return state.map(t => todo(t, action))
        default:
            return state
    }
} 

export default todos
