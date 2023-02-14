// App.js
import React, { Component } from 'react';
import './App.css';
import ChartContainer from './ui/ChartContainer';

import { fetchData } from './utils/file';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {data: []};
    }

    async componentDidMount() {
        let data = await fetchData();
        this.setState({ data : data });
    }

    render() {
        return (
            <ChartContainer dimension="energy" data={this.state.data} />
        )
    }
}

export default App;
