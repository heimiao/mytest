import React, { PropTypes as P } from 'react';
import { Table } from 'antd';

class Com extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 5,
    };
  }

  // 组件初始化完毕时触发
  componentDidMount() {
  }

  onClick() {
    this.setState(
      Object.assign({}, this.state, {
        value: this.state.value + 1,
      })
    );
  }

  render() {
    const columns = [
      {
        title: '名字',
        dataIndex: 'fund_name',
        key: 'fund_name',
      },
      {
        title: '策略',
        dataIndex: 'stype_name',
        key: 'stype_name',
      }
    ];
    return (
      <div>
        <span>{this.props.value}</span>
        <button onClick={() => this.props.onClick(this.props.value)}>点1击</button>
        <br/>
        <Table
          dataSource={(() => {
            if (this.props.fetchValue) {
              return this.props.fetchValue.map((v, i) => ({
                key: i,
                fund_name: v.fund_name,
                stype_name: v.stype_name,
              }));
            }
          })()}
          columns={columns}
        />
      </div>
    );
  }
}

Com.propTypes = {
  value: P.number,
  onClick: P.func,
  fetchValue: P.array,
};

export default Com;
