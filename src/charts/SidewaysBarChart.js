// BarChart.js
import * as d3 from 'd3';
import { Component } from 'react';
import { Element } from 'react-faux-dom';

import { dimensionsConfig } from '../utils/dimensions';
import { SVG_HEIGHT, SVG_MARGINS, SVG_WIDTH } from '../utils/config';

class SidewaysBarChart extends Component {

    componentDidMount() {
        // TODO: move init logic here
    }

    // TODO: this can definitely be cleaned up
    plotBarChart(chart, width, height, margins) {
        const dimension = this.props.dimension;
        const data = d3.reverse(d3.sort(this.props.data, this.props.sortFunction));

        // dimension -> frequency map
        const frequencies = d3.rollup(data, v => v.length, d => d[dimension]);

        const yScale = d3.scaleBand()
            .domain(frequencies.keys())
            .range([0, height])
            .padding(0.1);

        const xScale = d3.scaleLinear()
            .domain([0, d3.max(frequencies.values())]).nice()
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
            .data(frequencies.entries())
            .enter()
            .append('rect')
            .classed('bar', true)
            .attr('x', 0)
            .attr('y', d => yScale(d[0]))
            .attr('width', d => (xScale(d[1])))
            .attr('height', yScale.bandwidth())
            .style('stroke', '#191414')
            .style('fill', '#1DB954');

        chart.selectAll('.bar-label')
            .data(frequencies.entries())
            .enter()
            .append('text')
            .classed('bar-label', true)
            .attr('x', d => xScale(d[1]))
            .attr('dy', yScale.bandwidth()/2)
            .attr('y', d => yScale(d[0]))
            .attr('dx', d => 6)
            .style('font-size', '10px')
            .style('text-anchor', 'beginning')
            .text(d => d[1]);
        
        const xAxis = d3.axisBottom()
            .scale(xScale);

        const yAxis = d3.axisLeft()
            .ticks(15)
            .scale(yScale)
            .tickFormat((dv, i) => {
                const val = dimensionsConfig.get(dimension).get('valueMap').get(dv)
                return val ? val : '???';
            });

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
            .text('Frequency →');
            
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
            .text('↑' + dimensionsConfig.get(dimension).get('title'));
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

        this.plotBarChart(chart, chartWidth, chartHeight, margins);

        return div.toReact();
    }

    render() {
        return this.drawChart();
    }
}

export default SidewaysBarChart;
