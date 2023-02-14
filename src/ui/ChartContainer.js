import React, { Component } from 'react';
import BarChart from '../charts/BarChart';
import Histogram from '../charts/Histogram';
import ScatterPlot from '../charts/ScatterPlot';
import { dimensionsConfig } from '../utils/dimensions';

class ChartContainer extends Component {
    render() {
        let chart;
        if (this.props.dimensions) {
            const [dimensionX, dimensionY] = this.props.dimensions.split(',');
            chart = <ScatterPlot data={this.props.data} dimensionX={dimensionX} dimensionY={dimensionY}/>;
        } else {
            if (dimensionsConfig.get(this.props.dimension).get('type') === 'categorical') {
                chart = <BarChart data={this.props.data} dimension={this.props.dimension} sortFunction={(d) => (+d[this.props.dimension])}/>;
            } else {
                chart = <Histogram data={this.props.data} dimension={this.props.dimension}/>;
            }
        }

        return (
            <div>
                <h1>{dimensionsConfig.get(this.props.dimension).get('title')}</h1>
                {chart}
                <p>{dimensionsConfig.get(this.props.dimension).get('description')}</p>
            </div>
        )
    }
}

export default ChartContainer;