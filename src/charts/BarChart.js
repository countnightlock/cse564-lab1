// BarChart.js
import * as d3 from 'd3';
import { Component } from 'react';
import { Element } from 'react-faux-dom';

import { dimensions } from '../utils/dimensions';

class BarChart extends Component {

    componentDidMount() {
        // TODO: move init logic here
    }

    // TODO: this can definitely be cleaned up
    plotBarChart(chart, width, height, margins) {
        const dimension = this.props.dimension;
        const data = d3.sort(this.props.data, this.props.sortFunction);

        // dimension -> frequency map
        const frequencies = d3.rollup(data, v => v.length, d => d[dimension]);

        const xScale = d3.scaleBand()
            .domain(frequencies.keys())
            .range([0, width])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(frequencies.values())*1.2])
            .range([height, 0]);

        const yGridLines = d3.axisLeft()
            .scale(yScale)
            .ticks(20)
            .tickSize(-width, 0, 0)
            .tickFormat('');

        chart.append('g')
            .call(yGridLines)
            .classed('gridline', true)
            .attr('stroke-opacity', 0.1);

        chart.selectAll('.bar')
            .data(frequencies.entries())
            .enter()
            .append('rect')
            .classed('bar', true)
            .attr('x', d => xScale(d[0]))
            .attr('y', d => yScale(d[1]))
            .attr('height', d => (height - yScale(d[1])))
            .attr('width', xScale.bandwidth())
            .style('stroke', '#191414')
            .style('fill', '#1DB954');

        chart.selectAll('.bar-label')
            .data(frequencies.entries())
            .enter()
            .append('text')
            .classed('bar-label', true)
            .attr('x', d => xScale(d[0]))
            .attr('dx', xScale.bandwidth()/2)
            .attr('y', d => yScale(d[1]))
            .attr('dy', -6)
            .style('text-anchor', 'middle')
            .text(d => d[1]);
        
        const xAxis = d3.axisBottom()
            .scale(xScale)
            .tickFormat((dv, i) => {
                const val = dimensions.get(dimension).get('valueMap').get(dv)
                return val ? val : '???';
            });

        const yAxis = d3.axisLeft()
            .ticks(15)
            .scale(yScale);

        chart.append('g')
            .classed('x-axis', true)
            .attr('transform', `translate(0, ${height})`)
            .call(xAxis)
            .selectAll('text')
            .attr('transform', 'translate(-10,0) rotate(-45)')
            .style('text-anchor', 'end');

        chart.select('.x-axis')
            .append('text')
            .attr('x', width)
            .attr('y', 27)
            .attr('fill', 'currentColor')
            .style('font-size', '12px')
            .style('text-anchor', 'end')
            .text(dimensions.get(dimension).get('title') + ' →');

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
            .text('↑ Frequency');

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
            .style('height', 'auto')
            .style('height', 'intrinsic');

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

        this.plotBarChart(chart, chartWidth, chartHeight, margins);

        return div.toReact();
    }

    render() {
        return this.drawChart();
    }
}

export default BarChart;
