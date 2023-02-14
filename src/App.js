// App.js
import { Checkbox, FormControl, Grid, InputLabel, ListItemText, MenuItem, OutlinedInput, Select } from '@mui/material';
import React, { Component } from 'react';
import './App.css';
import ChartContainer from './ui/ChartContainer';
import { dimensionsConfig } from './utils/dimensions';

import { fetchData } from './utils/file';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {data: [], dimension: 'acousticness', dimensions: []};
    }

    async componentDidMount() {
        let data = await fetchData();
        this.setState({ data : data });
    }

    handleDimensionSelect = (e) => {
        this.setState({ dimension: e.target.value });
        this.setState({ dimensions: [] });
    }

    handleMultiDimensionSelect = (e) => {
        const dims = e.target.value;
        console.log(dims);

        this.setState({ dimensions: e.target.value });
    }

    render() {
        return (
            <Grid container spacing={1}>
                <Grid xs={3}>
                    <div>
                        <FormControl fullWidth>
                            <Select
                                labelId="dimension-select-label"
                                id="dimension-select"
                                value={this.state.dimension}
                                label="Dimension"
                                onChange={this.handleDimensionSelect}
                            >
                                {
                                    Array.from(dimensionsConfig.values()).map((value) => {
                                        return <MenuItem key={value.get('name')} value={value.get('name')}>{value.get('title')}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <Select
                                labelId="dimension-multi-select-label"
                                id="dimension-multi-select"
                                multiple
                                value={this.state.dimensions}
                                renderValue={(selected) => selected.join(', ')}
                                label="Dimensions"
                                input={<OutlinedInput label="Name" />}
                                onChange={this.handleMultiDimensionSelect}
                            >
                                {
                                    Array.from(dimensionsConfig.values()).map((value) => {
                                        return <MenuItem key={value.get('name') + 'multi'} value={value.get('name')}>
                                            <Checkbox checked={this.state.dimensions.indexOf(value.get('name')) > -1} />
                                            <ListItemText primary={value.get('title')} />
                                        </MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                    </div>
                </Grid>
                <Grid xs={9}>
                    <div>
                        <ChartContainer dimension={this.state.dimension} dimensions={this.state.dimensions} data={this.state.data} />
                    </div>
                </Grid>
            </Grid>
        )
    }
}

export default App;
