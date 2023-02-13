// BarChart.js
import * as d3 from 'd3';
import { Component } from 'react';
import { Element } from 'react-faux-dom';

class BarChart extends Component {

    componentDidMount() {
        // TODO: move init logic here
    }

    // TODO: this can definitely be cleaned up
    plotBarChart(chart, width, height) {
        const dimension = this.props.dimension;
        const data = d3.sort(this.props.data, d => +d[dimension]);

        const xScale = d3.scaleBand()
            .domain(data.map(d => d[dimension]))
            .range([0, width])
            .padding(0.1);

        const frequencies = d3.rollup(data, v => v.length, d => d[dimension]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(frequencies.values()) * 1.1])
            .range([height, 0]);

        const yGridLines = d3.axisLeft()
            .scale(yScale)
            .ticks(10)
            .tickSize(-width, 0, 0)
            .tickFormat('');

        chart.append('g')
            .call(yGridLines)
            .classed('gridline', true);

        chart.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .classed('bar', true)
            .attr('x', d => xScale(d[dimension]))
            .attr('y', d => yScale(frequencies.get(d[dimension])))
            .attr('height', d => (height - yScale(frequencies.get(d[dimension]))))
            .attr('width', xScale.bandwidth())
            .style('stroke', '#191414')
            .style('fill', '#1DB954');

        chart.selectAll('.bar-label')
            .data(data)
            .enter()
            .append('text')
            .classed('bar-label', true)
            .attr('x', d => xScale(d[dimension]))
            .attr('dx', xScale.bandwidth()/2)
            .attr('y', d => yScale(frequencies.get(d[dimension])))
            .attr('dy', -6)
            .style('text-anchor', 'middle')
            .text(d => frequencies.get(d[dimension]).toString());
        
        const xAxis = d3.axisBottom().scale(xScale);
        const yAxis = d3.axisLeft().ticks(10).scale(yScale);

        chart.append('g')
            .classed('x-axis', true)
            .attr('transform', `translate(0, ${height})`)
            .call(xAxis);

        chart.select('.x-axis')
            .append('text')
            .attr('x', width/2)
            .attr('y', 60)
            .attr('fill', '#000')
            .style('font-size', '20px')
            .style('text-anchor', 'middle')
            .text(dimension);

        chart.append('g')
            .classed('y-axis', true)
            .attr('transform', 'translate(0,0)')
            .call(yAxis);

        chart.select('.y-axis')
            .append('text')
            .attr('x', 0)
            .attr('y', 0)
            .attr('transform', `translate(-50, ${height/2}) rotate(-90)`)
            .attr('fill', '#000')
            .style('font-size', '20px')
            .style('text-anchor', 'middle')
            .text('Frequency');

    }

    drawChart() {
        const width = 800;
        const height = 600;

        const div = new Element('div');
        const svg = d3.select(div)
            .append('svg')
            .attr('id', 'chart')
            .attr('width', width)
            .attr('height', height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

        const margin = {
            top: 60,
            bottom: 100,
            left: 80,
            right: 40
        };

        const chart = svg.append('g')
            .classed('display', true)
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        const chartWidth = width - (margin.left + margin.right);
        const chartHeight = height - (margin.top + margin.bottom);

        this.plotBarChart(chart, chartWidth, chartHeight);

        return div.toReact();
    }

    render() {
        return this.drawChart();
    }
}

export default BarChart;
