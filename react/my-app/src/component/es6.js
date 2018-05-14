import React, {
	Component
} from 'react';

class Es6 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			date: new Date()
		};

	}
	tick() {
		console.log(11);
		this.setState({
			date: new Date()
		})
	}
	timerID() {
		clearInterval()
	}
	componentDidMount() {
		this.timerID = setInterval(() => this.tick(), 1000)
	}

	componentWillUnmount() {
		clearInterval(this.timerID);
	}
	render() {
		return(<h1>{this.state.date.toLocaleTimeString()}</h1>);
	}
}
export default Es6;

//事件监听
class Toggle extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isToggleOn: true
		};
		//		this.handleClick = this.handleClick.bind(this);
	}
	handleClick = () => {
		this.setState(prevState => ({
			isToggleOn: !prevState.isToggleOn
		}));
	}

	render() {
		return <button onClick={this.handleClick}>{this.state.isToggleOn ? 'ON' : 'OFF'}</button>
	}
}

//列表和键
class List extends Component {
	constructor(props) {
		super(props);
		this.createListItems();
	}
	createListItems(args) {
		const numb = args || [1, 2, 3, 4, 5]
		this.listItems = numb.map((numbers) => <li key={numbers}>第{numbers}列</li>)
	}
	render() {
		return <ul>{this.listItems}</ul>
	}
}

//表单基本使用
class Form extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isGoing: true,
			numberOfGuests: 2
		};

		this.handleInputChange = this.handleInputChange.bind(this);
	}
	handleInputChange(event) {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;
		this.setState({
			[name]: value
		});
	}
	render() {
		return(
			<form>
        <label>
          Is going:
          <input
            name="isGoing"
            type="checkbox"
            checked={this.state.isGoing}
            onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Number of guests:
          <input
            name="numberOfGuests"
            type="number"
            value={this.state.numberOfGuests}
            onChange={this.handleInputChange} />
        </label>
        <label>
          受控输入空值:
          <input
            name="name"
            value='2'
            onChange={this.handleInputChange} />
        </label>
      </form>
		);
	}
}

//提升状态
const scaleNames = {
	c: '摄氏度',
	f: '华氏度'
};
class TemperatureInput extends React.Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.state = {
			temperature: ''
		};
	}

	handleChange(e) {
		this.props.onTemperatureChange(e.target.value);
		//		this.setState({
		//			temperature: e.target.value
		//		});
	}

	render() {
		const temperature = this.props.temperature // this.state.temperature;
		const scale = this.props.scale;
		return(
			<fieldset>
        <legend>输入温度 (单位:{scaleNames[scale]}):</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
		);
	}
}
class Calculator extends React.Component {
	constructor(props) {
		super(props);
		this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
		this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
		this.state = {
			temperature: '',
			scale: 'c'
		};
	}
	handleCelsiusChange(temperature) {
		this.setState({
			scale: 'c',
			temperature
		});
	}
	handleFahrenheitChange(temperature) {
		this.setState({
			scale: 'f',
			temperature
		});
	}
	render() {
		const scale = this.state.scale;
		const temperature = this.state.temperature;
		const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
		const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;
		return(
			<div>
        <TemperatureInput scale="c" temperature={celsius} onTemperatureChange={this.handleCelsiusChange}/>
        <TemperatureInput scale="f" temperature={fahrenheit} onTemperatureChange={this.handleFahrenheitChange}/>
      </div>
		);
	}
}

function tryConvert(temperature, convert) {
	const input = parseFloat(temperature);
	if(Number.isNaN(input)) {
		return '';
	}
	const output = convert(input);
	const rounded = Math.round(output * 1000) / 1000;
	return rounded.toString();
}

function toCelsius(fahrenheit) {
	return(fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius) {
	return(celsius * 9 / 5) + 32;
}

//组件嵌套组成
function FancyBorder(props) {
	return(
		<div className={'FancyBorder FancyBorder-' + props.color}>
      {props.children}
    </div>
	);
}

function Dialog(props) {
	return(
		<FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
      {props.children}
    </FancyBorder>
	);
}

class SignUpDialog extends React.Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.handleSignUp = this.handleSignUp.bind(this);
		this.state = {
			login: ''
		};
	}

	render() {
		return(
			<Dialog title="Mars Exploration Program"
		              message="How should we refer to you?">
		        <input value={this.state.login}
		               onChange={this.handleChange} />
		
		        <button onClick={this.handleSignUp}>
		          Sign Me Up!
		        </button>
		      </Dialog>
		);
	}

	handleChange(e) {
		this.setState({
			login: e.target.value
		});
	}

	handleSignUp() {
		alert(`Welcome aboard, ${this.state.login}!`);
	}
}

export {
	Toggle,
	List,
	Form,
	Calculator,
	SignUpDialog
};