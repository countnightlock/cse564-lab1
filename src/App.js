// App.js
import { Checkbox, Divider, FormControl, FormControlLabel, FormGroup, Grid, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, Stack, Switch, TextField } from '@mui/material';
import React, { Component } from 'react';
import './App.css';
import ChartContainer from './ui/ChartContainer';
import { dimensionsConfig } from './utils/dimensions';

import { fetchData } from './utils/file';

const gridStyles = {
    paddingBottom: 2,
    paddingRight: 2,
    marginTop: 2,
    marginLeft: "auto",
    marginRight: "auto",
};

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {data: [], dimension: '', dimensions: [], sideways: false};
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
        this.setState({ dimension : ""});
        this.setState({ dimensions: e.target.value });
    }

    handleToggleSwitch = (e) => {
        this.setState({ sideways : !this.state.sideways})
    }

    render() {
        return (
            <Grid container spacing={3} justifyContent='space-around' sx={gridStyles}>
                <Grid item xs={3}>
                    <Stack spacing={2} divider={<Divider orientation='horizontal' flexItem/>} >
                        <h3>Menu</h3>
                        <TextField
                            labelId='dimension-select-label'
                            id='dimension-select'
                            select
                            SelectProps={{
                                value: this.state.dimension
                            }}
                            label="Dimension for BarChart"
                            onChange={this.handleDimensionSelect}
                        >
                            {
                                Array.from(dimensionsConfig.values()).map((value) => {
                                    return <MenuItem key={value.get('name')} value={value.get('name')}>{value.get('title')}</MenuItem>
                                })
                            }
                        </TextField>
                        <TextField
                            labelId='multi-select-label'
                            id='dimension-multi-select'
                            select
                            SelectProps={{
                                multiple: true,
                                renderValue: (selected) => selected.join(', '),
                                value: this.state.dimensions
                            }}
                            label='Dimensions for ScatterPlot'
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
                        </TextField>
                        <FormGroup>
                            <FormControlLabel control={<Switch onChange={this.handleToggleSwitch} />} label="Turn Sideways" />
                        </FormGroup>
                    </Stack>
                </Grid>
                <Grid item xs={9}>
                    <div>
                        <ChartContainer dimension={this.state.dimension} dimensions={this.state.dimensions} data={this.state.data} sideways={this.state.sideways}/>
                    </div>
                </Grid>
            </Grid>
        )
    }
}

export default App;
