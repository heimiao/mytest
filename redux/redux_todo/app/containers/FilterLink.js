import { connect } from 'react-redux'

import { setVisibilityFilter } from '../actions' 
import Link from '../components/Link'
//处理state
const mapStateToProps = (state, ownProps) => ({
    active: ownProps.filter === state.visibilityFilter
})

//处理action
const mapDispatchToProps = (dispatch, ownProps) => ({
    onClick: () => {
        dispatch(setVisibilityFilter(ownProps.filter))
    }
})

//转化成容器组件所需方法connect
const Filterlink = connect(
    mapStateToProps,
    mapDispatchToProps
)(Link)

export default FilterLink;
