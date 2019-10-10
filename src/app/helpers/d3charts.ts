import * as d3 from 'd3';


export interface Scatterpoint {
    x: number;
    y: number;
    v: number;
}

export function createScatterPlot(
    anchorSelector: any, data: Scatterpoint[], height: number, width: number, xlabel: string, ylabel: string) {

    const margins = { top: 30, right: 30, bottom: 50, left: 50 };

    const anchor = d3.select(anchorSelector);

    const svg = anchor.append('svg')
        .attr('width', width + margins.left + margins.right)
        .attr('height', height + margins.top + margins.bottom);

    const canvas = svg.append('g')
        .attr('transform', `translate(${margins.left}, ${margins.top})`);

    const xScale = d3.scaleLinear()
        .domain([0, 40])
        .range([0, width]);

    const xAxisCallback = d3.axisBottom(xScale);

    const xAxis = canvas.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxisCallback);

    xAxis.append('text')
        .attr('class', 'axis-label')
        .attr('transform', `translate(${width / 2}, 30)`)
        .text(xlabel)
        .style('fill', 'black')
        .style('font-size', '14px');

    const yScale = d3.scaleLinear()
        .domain([0, 40])
        .range([height, 0]);

    const yAxisCallback = d3.axisLeft(yScale);

    const yAxis = canvas.append('g')
        .attr('class', 'y-axis')
        .call(yAxisCallback);

    yAxis.append('text')
        .attr('class', 'axis-label')
        .attr('transform', `translate(-30, ${height / 2})rotate(-90)`)
        .text(ylabel)
        .style('fill', 'black')
        .style('font-size', '14px');

    canvas.selectAll('circle') // create group
        .data(data)    // add data
        .enter()    // for each datapoint ...
        .append('circle')
        .attr('cx', (dp) => xScale(dp.x))
        .attr('cy', (dp) => yScale(dp.y))
        .attr('r', (dp) => 5 * dp.v)
        .attr('fill', 'blue');

    return anchor;
}

export interface Bardata {
    label: string;
    value: number;
}

export function createBarchart(
    anchorSelector: any, data: Bardata[], width: number, height: number, xlabel: string, ylabel: string) {

    const margins = { top: 30, right: 30, bottom: 50, left: 50 };

    const anchor = d3.select(anchorSelector);

    const svg = anchor.append('svg')
        .attr('width', width + margins.left + margins.right)
        .attr('height', height + margins.top + margins.bottom);

    const canvas = svg.append('g')
        .attr('transform', `translate(${margins.left}, ${margins.top})`);

    const labels = data.map(dp => dp.label);
    const values = data.map(dp => dp.value);

    const xScale = d3.scaleBand()
        .domain(labels)
        .range([0, width])
        .padding(0.2);

    const xAxisCallback = d3.axisBottom(xScale);

    const xAxis = canvas.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxisCallback);

    xAxis.append('text')
        .attr('class', 'axis-label')
        .attr('transform', `translate(${width / 2}, 30)`)
        .text(xlabel)
        .style('fill', 'black')
        .style('font-size', '14px');

    const yScale = d3.scaleLinear()
        .domain([Math.min(...values) - 1, Math.max(...values)])
        .range([height, 0]);

    const yAxisCallback = d3.axisLeft(yScale);

    const yAxis = canvas.append('g')
        .attr('class', 'y-axis')
        .call(yAxisCallback);

    yAxis.append('text')
        .attr('class', 'axis-label')
        .attr('transform', `translate(-30, ${height / 2})rotate(-90)`)
        .text(ylabel)
        .style('fill', 'black')
        .style('font-size', '14px');

    canvas.selectAll('rect') // create group
        .data(data)    // add data
        .enter()    // for each datapoint ...
        .append('rect')
        .attr('x', (dp) => xScale(dp.label))
        .attr('y', (dp) => yScale(dp.value))
        .attr('width', xScale.bandwidth())
        .attr('height', (dp) => height - yScale(dp.value))
        .attr('fill', 'blue');

    return anchor;
}
