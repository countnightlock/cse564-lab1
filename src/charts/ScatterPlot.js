// ScatterPlot.js
import * as d3 from 'd3';
import { Component } from 'react';
import { Element } from 'react-faux-dom';
import { SVG_HEIGHT, SVG_MARGINS, SVG_WIDTH } from '../utils/config';

import { dimensionsConfig } from '../utils/dimensions';

class ScatterPlot extends Component {

    componentDidMount() {
        // TODO: move init logic here
    }

    getBestFitLine(data, dimensionX, dimensionY) {
        const meanX = d3.mean(data, d => d[dimensionX]);
        const meanY = d3.mean(data, d => d[dimensionY]);

        const cov = d3.sum(data, d => ((d[dimensionX] - meanX)*(d[dimensionY] - meanY)));
        const varX = d3.sum(data, d => ((d[dimensionX] - meanX)*(d[dimensionX] - meanX)));
        const varY = d3.sum(data, d => ((d[dimensionY] - meanY)*(d[dimensionY] - meanY)));

        const m = cov / varX;

        const b = meanY - m * meanX;

        // Pearson's Correlation Coeff
        const r = cov / Math.sqrt(varX * varY);

        // y = mx + b
        const [x1, x2] = d3.extent(data, d => d[dimensionX]);
        const [y1, y2] = [x1, x2].map(x => m * x + b);

        // TODO: fix for lines that intersect with the y axis below min(Y)
        return [x1, x2, y1, y2, r];
    }

    // TODO: this can definitely be cleaned up
    plotScatterPlot(chart, width, height, margins) {
        const dimensionX = this.props.dimensionX;
        const dimensionY = this.props.dimensionY;
        const data = this.props.data;

        let xScale, yScale;

        const xIsCategorical = dimensionsConfig.get(dimensionX).get('type') !== 'numerical';
        const yIsCategorical = dimensionsConfig.get(dimensionY).get('type') !== 'numerical';

        if (xIsCategorical) {
            xScale = d3.scaleBand()
                .domain(data
                    .sort((a, b) => +a[dimensionX] - +b[dimensionX])
                    .map(d => d[dimensionX])
                )
                .range([0, width]);
        } else {
            xScale = d3.scaleLinear()
                .domain(d3.extent(data, d => d[dimensionX])).nice()
                .range([0, width]);
        }

        if (yIsCategorical) {
            yScale = d3.scaleBand()
                .domain(data
                    .sort((a, b) => +a[dimensionY] - +b[dimensionY])
                    .map(d => d[dimensionY]))
                .range([height, 0]);
        } else {
            yScale = d3.scaleLinear()
                .domain(d3.extent(data, d => d[dimensionY])).nice()
                .range([height, 0]);
        }

        const yGridLines = d3.axisLeft()
            .scale(yScale)
            .ticks(20)
            .tickSize(-width, 0, 0)
            .tickFormat('');

        chart.append('g')
            .call(yGridLines)
            .classed('gridline', true)
            .attr('stroke-opacity', 0.1);

        chart.append('g')
            .selectAll('.dot')
            .data(data)
            .enter()
            .append('circle')
            .classed('dot', true)
            .attr('cx', d => xScale(d[dimensionX]) + (xIsCategorical ? xScale.bandwidth()/2 : 0))
            .attr('cy', d => yScale(d[dimensionY]) + (yIsCategorical ? yScale.bandwidth()/2 : 0))
            .attr('r', 2.0)
            .attr('opacity', xIsCategorical || yIsCategorical ? 0.2 : 1.0)
            .style('stroke', 'black')
            .style('fill', '#1DB954');

        const xAxis = d3.axisBottom()
            .scale(xScale);

        const yAxis = d3.axisLeft()
            .scale(yScale);

        chart.append('g')
            .classed('x-axis', true)
            .attr('transform', `translate(0, ${height})`)
            .call(xAxis)
            .selectAll('text')
            .style('text-anchor', 'middle');

        chart.select('.x-axis')
            .append('text')
            .attr('x', width)
            .attr('y', 27)
            .attr('fill', 'currentColor')
            .style('font-size', '10px')
            .style('text-anchor', 'end')
            .text(dimensionX + ' ???');

        chart.append('g')
            .classed('y-axis', true)
            .attr('transform', 'translate(0,0)')
            .call(yAxis);

        chart.select('.y-axis')
            .append('text')
            .attr('x', 0)
            .attr('y', -10)
            .attr('fill', 'currentColor')
            .style('font-size', '10px')
            .style('text-anchor', 'middle')
            .text('??? ' + dimensionY);

        const [x1, x2, y1, y2, r] = this.getBestFitLine(data, dimensionX, dimensionY, 500);

        if (!xIsCategorical && !yIsCategorical) {
        chart.append('line')
            .classed('best-fit', true)
            .attr('x1', xScale(x1))
            .attr('y1', yScale(y1))
            .attr('x2', xScale(x2))
            .attr('y2', yScale(y2))
            .attr('stroke', 'red')
            .style('stroke-opacity', 0.8);

        chart.append('text')
            .classed('pearson-coeff', true)
            .attr('x', width)
            .attr('y', 0)
            .style('text-anchor', 'end')
            .style('fill', 'red')
            .text(`R: ${parseFloat(r).toFixed(3)}`);
        }
    }

    drawChart() {
        const width = SVG_WIDTH;
        const height = SVG_HEIGHT;

        const div = new Element('div');
        const svg = d3.select(div)
            .append('svg')
            .attr('id', 'chart')
            .attr('viewBox', [0, 0, width, height])
            .style('max-width', '100%')
            .style('height', 'auto')
            .style('height', 'intrinsic');

        const margins = SVG_MARGINS;

        const chart = svg.append('g')
            .classed('display', true)
            .attr('transform', `translate(${margins.left}, ${margins.top})`);

        const chartWidth = width - (margins.left + margins.right);
        const chartHeight = height - (margins.top + margins.bottom);

        this.plotScatterPlot(chart, chartWidth, chartHeight, margins);

        return div.toReact();
    }

    render() {
        return this.drawChart();
    }
}

export default ScatterPlot;
