import React, { Component } from 'react';
import BarChart from '../charts/BarChart';
import Histogram from '../charts/Histogram';
import ScatterPlot from '../charts/ScatterPlot';
import SidewaysBarChart from '../charts/SidewaysBarChart';
import SidewaysHistogram from '../charts/SidewaysHistogram';
import { dimensionsConfig } from '../utils/dimensions';

class ChartContainer extends Component {
    render() {
        let chart;
        if (!this.props.dimension && this.props.dimensions.length !== 2) {
            return (
                <div>
                    <p>
                        Either select one dimension for a bar chart or histogram, or two for a scatterplot.
                    </p>
                </div>
            );
        }

        if (this.props.dimensions.length == 2) {
            const [dimensionX, dimensionY] = this.props.dimensions;
            chart = <ScatterPlot data={this.props.data} dimensionX={dimensionX} dimensionY={dimensionY}/>;

            return (
                <div>
                    <h3>{`${dimensionsConfig.get(dimensionX).get('title')} vs ${dimensionsConfig.get(dimensionY).get('title')}`}</h3>
                    {chart}
                    <p>{dimensionsConfig.get(dimensionX).get('description')}</p>
                    <p>{dimensionsConfig.get(dimensionY).get('description')}</p>
                </div>
            );
        } else {
            if (dimensionsConfig.get(this.props.dimension).get('type') === 'categorical') {
                if (!this.props.sideways) {
                    chart = <BarChart data={this.props.data} dimension={this.props.dimension} sortFunction={(d) => (+d[this.props.dimension])}/>;
                } else {
                    chart = <SidewaysBarChart data={this.props.data} dimension={this.props.dimension} sortFunction={(d) => (+d[this.props.dimension])}/>;
                }
            } else {
                if (!this.props.sideways) {
                    chart = <Histogram data={this.props.data} dimension={this.props.dimension}/>;
                } else {
                    chart = <SidewaysHistogram data={this.props.data} dimension={this.props.dimension}/>;
                }
            }
        }

        return (
            <div>
                <h3>{dimensionsConfig.get(this.props.dimension).get('title')}</h3>
                {chart}
                <p>{dimensionsConfig.get(this.props.dimension).get('description')}</p>
            </div>
        )
    }
}

export default ChartContainer;