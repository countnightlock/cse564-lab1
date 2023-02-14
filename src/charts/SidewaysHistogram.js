// SidewaysHistogram.js
import * as d3 from 'd3';
import { Component } from 'react';
import { Element } from 'react-faux-dom';

import { dimensionsConfig } from '../utils/dimensions';

class SidewaysHistogram extends Component {

    componentDidMount() {
        // TODO: move init logic here
    }

    // TODO: this can definitely be cleaned up
    // Adapted from https://observablehq.com/@d3/SidewaysHistogram
    plotSidewaysHistogram(chart, width, height, margins) {
        const dimension = this.props.dimension;
        const data = d3.sort(this.props.data, this.props.sortFunction);

        const X = d3.map(data, d => d[dimension]);
        const Y0 = d3.map(data, () => 1);
        const I = d3.range(X.length);

        // const binningFunction = d3.bin().thresholds(10);
        // const bins = binningFunction(X);

        const bins = d3.bin()
            // TODO: fool this function into generating more bins
            .thresholds(20)
            .value(i => X[i])(I);

        const Y = Array.from(bins, bin => d3.sum(bin, i => Y0[i]));

        const yScale = d3.scaleLinear()
            .domain([
               bins[0].x0, bins[bins.length - 1].x1
            ])
            .range([height, 0]);

        const xScale = d3.scaleLinear()
            .domain([0, d3.max(Y)]).nice()
            .range([0, width]);

        const xGridLines = d3.axisBottom()
            .scale(xScale)
            .ticks(20)
            .tickSize(height, 0, 0)
            .tickFormat('');

        chart.append('g')
            .call(xGridLines)
            .classed('gridline', true)
            .attr('stroke-opacity', 0.1);

        chart.selectAll('.bar')
            .data(bins)
            .enter()
            .append('rect')
            .classed('bar', true)
            .attr('x', 0)
            .attr('y', (d, i) => yScale(d.x1))
            .attr('width', (d, i) => (xScale(Y[i]) - xScale(0)))
            .attr('height', (d, i) => Math.abs(yScale(d.x1) - yScale(d.x0)))
            .style('stroke', '#191414')
            .style('fill', '#1DB954');

        chart.selectAll('.bar-label')
            .data(bins)
            .enter()
            .append('text')
            .classed('bar-label', true)
            .attr('x', (d, i) => xScale(Y[i]))
            .attr('dx', (d, i) => 6)
            .attr('y', (d, i) => yScale(d.x0))
            .attr('dy', (d, i) => Math.abs(yScale(d.x1) - yScale(d.x0))/-3)
            .style('text-anchor', 'beginning')
            .text((d, i) => Y[i].toString());

        const xAxis = d3.axisBottom()
            .scale(xScale)
            .ticks(bins.length);

        const yAxis = d3.axisLeft()
            .ticks(15)
            .tickFormat((dv) => {
                if (dimension !== 'duration_ms') return dv;

                const date = new Date(dv);
                return [date.getMinutes(), date.getSeconds()].map(
                    v => String(v).padStart(2, '0')
                ).join(':');
            })
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
            .attr('y', 30)
            .attr('fill', 'currentColor')
            .style('font-size', '12px')
            .style('text-anchor', 'end')
            .text('Frequency' + ' →');

        chart.append('g')
            .classed('y-axis', true)
            .attr('transform', 'translate(0,0)')
            .call(yAxis);

        chart.select('.y-axis')
            .append('text')
            .attr('x', 0)
            .attr('y', -10)
            .attr('fill', 'currentColor')
            .style('font-size', '12px')
            .style('text-anchor', 'middle')
            .text('↑' + dimensionsConfig.get(dimension).get('title'));

    }

    drawChart() {
        const width = 800;
        const height = 600;

        const div = new Element('div');
        const svg = d3.select(div)
            .append('svg')
            .attr('id', 'chart')
            .attr('viewBox', [0, 0, width, height])
            .style('max-width', '100%')
            // .style('height', 'auto')
            // .style('height', 'intrinsic');

        const margins = {
            top: 60,
            bottom: 100,
            left: 80,
            right: 40
        };

        const chart = svg.append('g')
            .classed('display', true)
            .attr('transform', `translate(${margins.left}, ${margins.top})`);

        const chartWidth = width - (margins.left + margins.right);
        const chartHeight = height - (margins.top + margins.bottom);

        this.plotSidewaysHistogram(chart, chartWidth, chartHeight, margins);

        return div.toReact();
    }

    render() {
        return this.drawChart();
    }
}

export default SidewaysHistogram;
