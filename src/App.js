// App.js
import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import React, { Component } from 'react';
import './App.css';
import ChartContainer from './ui/ChartContainer';
import { dimensionsConfig } from './utils/dimensions';

import { fetchData } from './utils/file';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {data: [], dimension: 'acousticness'};
    }

    async componentDidMount() {
        let data = await fetchData();
        this.setState({ data : data });
    }

    render() {
        return (
            <Grid container spacing={1}>
                <Grid xs={3}>
                    <FormControl fullWidth>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={this.state.dimension}
                            label="Dimension"
                            onChange={(e) => {this.setState({ dimension: e.target.value });}}
                        >
                            {
                                Array.from(dimensionsConfig.values()).map((value) => {
                                    return <MenuItem value={value.get('name')}>{value.get('title')}</MenuItem>
                                })
                            }
                        </Select>
                    </FormControl>
                </Grid>
                <Grid xs={9}>
                    <ChartContainer dimension={this.state.dimension} data={this.state.data} />
                </Grid>
            </Grid>
        )
    }
}

export default App;
