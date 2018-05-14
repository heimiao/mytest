import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
//单独测试redux
import Store from './action/store';

//redux的一个小案例
// import Store from './example/index';

class App extends Component {
  render() {

    //作为学习redux之用
    new Store();
    return (
      <div className="App">
        <header className="App-header">
          {/*<img src={logo} className="App-logo" alt="logo" />*/}
          <h1 className="App-title">作为学习redux之用</h1>
        </header> 
        <div className="container">
          <section>
            <h3>Action使用(打开控制台查看)</h3> 
          </section>
        </div>
      </div>
    );
  }
}

export default App;
