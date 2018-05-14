/* 主页 */

// ==================
// 所需的各种插件
// ==================

import React, { PropTypes as P } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Layout, Menu, Breadcrumb } from 'antd';

const { Header, Content, Footer } = Layout;
// ==================
// 所需的所有组件
// ==================

import Test from '../../a_component/test';
import Main from '../../a_component/main/index';
// ==================
// 本页面所需action
// ==================

import appAction from '../../a_action/app-action';

// ==================
// 最终要交给redux管理的所有变量
// ==================

const mapStoreStateToProps = (state) => ({
  dispatch: state.dispatch,
  testvalue: state.app.inputvalue2,
});

// ==================
// 最终要交给redux管理的所有action
// 既定义哪些方法将成为action
// ==================

const mapDispatches = (dispatch) => ({
  fn: {
    onTestAdd: (v) => {
      dispatch(appAction.onTestAdd2(v));
    },
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

  render() {
    return (
      <div>
         <div className="layout-top">
      <div className="layout-header">
        <div className="layout-wrapper">
          <div className="layout-logo"></div>
          <Menu theme="dark" mode="horizontal"
            defaultSelectedKeys={['1']} style={{lineHeight: '64px'}}>
            <Menu.Item key="1">Navigation 1</Menu.Item>
            <Menu.Item key="2">Navigation 2</Menu.Item>
            <Menu.Item key="3">Navigation 3</Menu.Item>
          </Menu>
        </div>
      </div>
    
      <div className="layout-wrapper">
        <div className="layout-container">
          <div id="main"><Main /></div>
        </div>
      </div>
      <div className="layout-footer">
        Ant Design all rights reserved © 2015 Created by Ant UED
      </div>
    </div>
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
};

// ==================
// Export
// ==================

export default connect(mapStoreStateToProps, mapDispatches)(HomePageContainer);
