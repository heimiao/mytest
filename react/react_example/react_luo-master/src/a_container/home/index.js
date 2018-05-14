/* 主页 */

// ==================
// 所需的各种插件
// ==================

import React, { PropTypes as P } from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';

// ==================
// 所需的所有组件
// ==================


// ==================
// 本页面所需action
// ==================

import appAction from '../../a_action/app-action';

// ==================
// 最终要交给redux管理的所有变量
// ==================

const mapStoreStateToProps = (state) => ({
  dispatch: state.dispatch,
  testvalue: state.app.inputvalue,
  fetchValue: state.app.fetchvalue,
});

// ==================
// 最终要交给redux管理的所有action
// 既定义哪些方法将成为action
// ==================

const mapDispatches = (dispatch) => ({
  fn: {
    onTestAdd: (v) => {
      dispatch(appAction.onTestAdd(v));
    },
    onFetch: () => {
      dispatch(appAction.leftboxInit());
    }
  },
});

// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  goBack() {
    browserHistory.goBack();
  }
  render() {
    console.log('location:', this.props.location);
    console.log('browserHistory:', browserHistory);
    return (
      <div>
        <Link to="/home2">home2</Link>
        <button onClick={this.goBack}>back</button>
      </div>
    );
  }
}

// ==================
// PropTypes
// ==================

HomePageContainer.propTypes = {
  dispatch: P.func,
  fn: P.object,
  testvalue: P.number,
  location: P.any,
  history: P.any,
  fetchValue: P.array,
};

// ==================
// Export
// ==================

export default connect(mapStoreStateToProps, mapDispatches)(HomePageContainer);
