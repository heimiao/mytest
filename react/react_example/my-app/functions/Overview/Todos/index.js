import React, { Component } from 'react'
import update from 'react-update'
import Input from 'bfd/Input'
import Button from 'bfd/Button'
import List from './List'
import './index.less'
import DataTable from 'bfd/DataTable'

class Todos extends Component {

  constructor() {
    super()
    this.update = update.bind(this)
    this.state = {
      list: [],
      column: [{
        title: '序号',
        key: 'sequence'
      },{
        primary: true,
        title: 'ID',
        key: 'id',
        hide: true
      }, {
        title: '姓名',
        order: true,
        width: '100px',
        render: (text, item, index) => {
          return <a href="javascript:void(0);" >{text}</a>
        },
        key: 'name'
      }, {
        title: '年龄',
        key: 'age',
        order: 'desc'
      }, {
        title: '国家/地区',
        key: 'country',
        width: '20%',
        render: (text, item, index) => {
          return item.country + "/" + item.area
        }
      }, {
        title: '注册日期',
        key: 'regdate',
        order: 'asc'
      }, {
        title: '操作', 
        render: (item, component) => {
          return <a href = "javascript:void(0);">编辑</a>
        },
        key: 'operation'  
      }]}

  }

  handleListChange(type, value) {
	  console.log(type);
    this.update(type, 'list', value)
  }

  test(){ 
	 return {
	"code": 200,
	"totalList": [{
		"id": 1,
		"name": "张三",
		"age": 28,
		"gender": "male",
		"country": "中国",
		"area": "北京",
		"regdate": "2016-03-01"
	}, {
		"id": 2,
		"name": "李四",
		"age": 25,
		"gender": "female",
		"country": "中国",
		"area": "杭州",
		"regdate": "2016-04-11"
	}, {
		"id": 3,
		"name": "王五",
		"age": 43,
		"gender": "male",
		"country": "中国",
		"area": "沈阳",
		"regdate": "2016-05-06"
	}, {
		"id": 4,
		"name": "赵某某",
		"age": 30,
		"gender": "female",
		"country": "中国",
		"area": "上海",
		"regdate": "2016-03-09"
	}, {
		"id": 5,
		"name": "钱某某",
		"age": 39,
		"gender": "male",
		"country": "中国",
		"area": "深圳",
		"regdate": "2015-11-11"
	}, {
		"id": 6,
		"name": "孙某某",
		"age": 50,
		"gender": "male",
		"country": "中国",
		"area": "石家庄",
		"regdate": "2016-06-01"
	}, {
		"id": 7,
		"name": "周某某",
		"age": 21,
		"gender": "female",
		"country": "中国",
		"area": "西安",
		"regdate": "2016-08-13"
	}, {
		"id": 8,
		"name": "吴某某",
		"age": 19,
		"gender": "female",
		"country": "中国",
		"area": "天津",
		"regdate": "2016-02-22"
	}, {
		"id": 9,
		"name": "郑某某",
		"age": 51,
		"gender": "male",
		"country": "中国",
		"area": "武汉",
		"regdate": "2016-01-18"
	}, {
		"id": 10,
		"name": "冯某某",
		"age": 24,
		"gender": "male",
		"country": "中国",
		"area": "广州",
		"regdate": "2016-09-20"
	}],
	"currentPage": 4,
	"totalPageNum": 300
}
  }

 
onPageChange(page) {
    console.log(page);
  }
  
  render() {
	var _this=this;
	function  handleCheckboxSelect(selectedRows, allSelectedRows) {
	  
      _this.update('set', { selectedRows, allSelectedRows })    
	 console.log(_this.state);
  }
    const { update, state } = this
    const { text, list } = state
    return (
      <div className="todos">
        <Input onChange={e => update('set', 'text', e.target.value)} />
        <Button onClick={() => update('push', 'list', text)}>添加</Button>

        <List data={list} onChange={::this.handleListChange} />

		<DataTable  
			onPageChange={::this.onPageChange}
			data={this.test()}
			column={this.state.column}
			showPage="true"
			howRow={10} 
			onCheckboxSelect={handleCheckboxSelect}
		  />
      </div>
    )
  }
}

export default Todos