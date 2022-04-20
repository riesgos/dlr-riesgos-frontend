//@ts-ignore
import { select, scaleBand, scaleLinear, scaleOrdinal, axisBottom, axisLeft, easeBounce, format } from 'd3';
import { unique } from './helpers';


export interface SubGroupData {
    key: string,
    val: number
}

export interface GroupedBarChartData {
    groupName: string;
    subGroups: SubGroupData[];
}

export interface SubGroupColorMap {
    [key: string]: string
}

function getGroupNames(data: GroupedBarChartData[]) {
    return data.map((d: any) => d.groupName).sort();
}

function getSubGroupNames(data: GroupedBarChartData[]) {
    const sgs = [];
    for (const dp of data) {
        const dpSgs = dp.subGroups.map(sg => sg.key);
        sgs.push(... dpSgs);
    }
    return unique(sgs).sort();
}

function getMaxY(data: GroupedBarChartData[]) {
    const nrs = [];
    for (const gdp of data) {
        for (const sgdp of gdp.subGroups) {
            nrs.push(sgdp.val);
        }
    }
    const maxY = Math.max(...nrs);
    return maxY;
}

export function createGroupedBarChart(container: HTMLElement, widthTotal: number, heightTotal: number, data: GroupedBarChartData[], subGroupColors: SubGroupColorMap) {
    const groupNames = getGroupNames(data);
    const subGroupNames = getSubGroupNames(data);
    const maxY = getMaxY(data);
    
    // set the dimensions and margins of the graph
    const margin = { top: 10, right: 30, bottom: 30, left: 50 };
    const width = widthTotal - margin.left - margin.right;
    const height = heightTotal - margin.top - margin.bottom;
    
    
    // append the svg object to the container
    const svg = select(container)
        .append('svg')
        .attr('class', 'fullGraph')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);
    
    const graph = svg
        .append('g')
        .attr('class', 'graph')
        .attr('transform',
            'translate(' + margin.left + ',' + margin.top + ')');
    
    // x-axis
    const xScale = scaleBand()
        .domain(groupNames)
        .range([0, width])
        .padding([0.2]);
    const xAxisGenerator = axisBottom(xScale).tickSize(0);
    graph.append('g')
        .attr('class', 'xAxis')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxisGenerator);
    
    // x-subgroup-scale
    const xSubgroupScale = scaleBand()
        .domain(subGroupNames)
        .range([0, xScale.bandwidth()])
        .padding([0.05]);
    
    // y-axis
    const yAxis = scaleLinear()
        .domain([0, maxY])
        .range([height, 0]);
    const yAxisGenerator = axisLeft(yAxis);
    graph.append('g')
        .attr('class', 'yAxis')
        .call(yAxisGenerator);
        
    // color palette = one color per subgroup
    const subGroupColorScale = scaleOrdinal()
        .domain(Object.keys(subGroupColors))
        .range(Object.values(subGroupColors));
    
    // Show the bars
    const barGroups = graph
        .append('g')
        .attr('class', 'barGroups')
        .selectAll('barGroup')
        .data(data)
        .enter()
            .append('g')
            .attr('class', 'barGroup')
            .attr('data-groupname', (d: any) => d.groupName)
            .attr('transform', (d: any) => `translate(${xScale(d.groupName)}, 0 )` );

    const barSubGroups = barGroups
        .selectAll('barSubGroup')
        .data((d: any) => d.subGroups)
        .enter()
            .append('rect')
            .attr('class', 'barSubGroup')
            .attr('x', (d: any) => xSubgroupScale(d.key))
            .attr('width',  xSubgroupScale.bandwidth())
            .attr('fill',   (d: any) => subGroupColorScale(d.key))
            .attr('y', yAxis(0))
            .attr('height', 0)
            .transition()
                .duration(250)
                .ease(easeBounce)
                .attr('y', (d: any) => yAxis(d.val))
                .attr('height', (d: any) => height - yAxis(d.val));


    return {svg, graph, barGroups, barSubGroups};
}   


export type GroupingFunction = (data: SubGroupData[]) => SubGroupData[];
export type ColoringFunction = (groupName: string) => string;

export class RearrangingGroupedBarChart {
    private selectors: any = { svg: null, graph: null, barGroups: null, xScale: null, legend: null, hoverText: null };
    private margin = { top: 10, right: 30, bottom: 100, left: 50 };

    constructor(
        private container: HTMLElement, private widthTotal: number, private heightTotal: number,
        private xLabel: string, private yLabel: string,
        private data: GroupedBarChartData[]
    ) {
        const groupNames = getGroupNames(data);
            
        // set the dimensions and margins of the graph
        const margin = this.margin;
        const width = widthTotal - margin.left - margin.right;
        const height = heightTotal - margin.top - margin.bottom;
        
        // append the svg object to the container
        const svg = select(container)
            .append('svg')
            .attr('class', 'fullGraph')
            .attr('width', widthTotal)
            .attr('height', heightTotal);

        // x-label
        svg.append('text')    
            .style('text-anchor', 'middle')
            .attr('x', widthTotal / 2)
            .attr('y', height + 35)
            .text(xLabel);
        
        // y-label
        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', margin.left / 2 - 5)
            .attr('x', 2 - height / 2)
            .style('text-anchor', 'middle')
            .text(yLabel);

        // legend
        const legend = svg.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(${widthTotal / 2}, ${heightTotal - margin.bottom + 30})`);
        
        const graph = svg
            .append('g')
            .attr('class', 'graph')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);
        
        // x-axis
        const xScale = scaleBand()
            .domain(groupNames)
            .range([0, width])
            .padding([0.2]);
        const xAxisGenerator = axisBottom(xScale).tickSize(0);
        graph.append('g')
            .attr('class', 'xAxis')
            .attr('transform', `translate(0, ${height})`)
            .call(xAxisGenerator);

        // y-axis
        const yAxis = scaleLinear()
            .domain([0, 10])
            .range([height, 0]);
        const yAxisGenerator = axisLeft(yAxis);
        graph.append('g')
            .attr('class', 'yAxis')
            .call(yAxisGenerator);

        const barGroups = graph
            .append('g')
            .attr('class', 'barGroups')
            .selectAll('barGroup')
            .data(data)
            .enter()
                .append('g')
                .attr('class', 'barGroup')
                .attr('data-groupname', (d: any) => d.groupName)
                .attr('transform', (d: any) => `translate(${xScale(d.groupName)}, 0 )` );

        const hoverText = svg.append('text')
            .style('font-size', '.5em');
            
        this.selectors.svg = svg;
        this.selectors.graph = graph;
        this.selectors.legend = legend;
        this.selectors.barGroups = barGroups;
        this.selectors.xScale = xScale;
        this.selectors.hoverText = hoverText;
    }

    regroup(regroupingFunction: GroupingFunction, coloringFunction: ColoringFunction) {
        const newData: GroupedBarChartData[] = [];
        for (const oldDataPoint of this.data) {
            newData.push({
                groupName: oldDataPoint.groupName,
                subGroups: regroupingFunction(oldDataPoint.subGroups)
            })
        }
        const subGroupNames = getSubGroupNames(newData);
        const subGroupColors = subGroupNames.map(sgn => coloringFunction(sgn));
        const maxY = Math.max(1, getMaxY(newData));
        const graphHeight = this.selectors.svg.attr('height') - this.margin.top - this.margin.bottom;


        // resizing subgroup-bar-width
        const xSubgroupScale = scaleBand()
            .domain(subGroupNames)
            .range([0, this.selectors.xScale.bandwidth()])
            .padding([0.05]);

        // resizing y-axis
        const yAxis = scaleLinear()
            .domain([0, maxY])
            .range([graphHeight, 0]);
        const yAxisGenerator = axisLeft(yAxis)
            .tickFormat(format("d"));
        if (maxY < 1.1) yAxisGenerator.ticks(2);
        this.selectors.graph.select('.yAxis')
            .call(yAxisGenerator);
            
        // updating color palette
        const subGroupColorScale = scaleOrdinal()
            .domain(subGroupNames)
            .range(subGroupColors);

        // update legend
        const colorData = subGroupNames.map((n, i) => ({key: n, val: subGroupColors[i]}));
        const I = subGroupNames.length;
        this.selectors.legend.selectAll('.legendEntry').remove();
        const legendEntries = this.selectors.legend
            .selectAll('.legendEntry')
            .data(colorData, (d: any) => d.key);
        const newLegendEntriesG = legendEntries
            .enter()
                .append('g')
                .attr('class', 'legendEntry')
                .attr('transform', (d: any, i: number) => `translate(${(i - I / 2) * 10}, 0)`);
        newLegendEntriesG
            .append('rect')
            .attr('fill', (d: any) => d.val)
            .attr('width', 10)
            .attr('height', 10);
        newLegendEntriesG
            .append('text')
            .text((d: any) => d.key)
            .style('font-size', '.5em')
            .attr('transform', `translate(3, 15), rotate(90)`);

        // updating sub-groups
        const barSubGroups = this.selectors.barGroups
            .selectAll('.barSubGroup')
            .data(
                (d: any) => newData.find((nd: any) => nd.groupName === d.groupName)?.subGroups,
                (d: any) => d.key
            );
        barSubGroups
            .exit().remove();
        barSubGroups
            .attr('x', (d: any) => xSubgroupScale(d.key))
            .attr('width',  xSubgroupScale.bandwidth())
            .attr('fill',   (d: any) => subGroupColorScale(d.key))
            .attr('y', yAxis(0))
            .attr('height', 0)
            .transition()
                .duration(250)
                .ease(easeBounce)
                .attr('y', (d: any) => yAxis(d.val))
                .attr('height', (d: any) => graphHeight - yAxis(d.val));
        barSubGroups
            .enter()
                .append('rect')
                .attr('class', 'barSubGroup')
                .attr('x', (d: any) => xSubgroupScale(d.key))
                .attr('width',  xSubgroupScale.bandwidth())
                .attr('fill',   (d: any) => subGroupColorScale(d.key))
                .attr('y', yAxis(0))
                .attr('height', 0)
                .transition()
                    .duration(250)
                    .ease(easeBounce)
                    .attr('y', (d: any) => yAxis(d.val))
                    .attr('height', (d: any) => graphHeight - yAxis(d.val));

        // hover-text
        // barSubGroups
        //     .on('mouseover', (d: any) => {
        //         const bar = select(d.target);
        //         const labelText = bar.data()[0].key;
        //         const x = d.clientX;
        //         const y = d.clientY;
        //         this.selectors.hoverText
        //             .attr('x', x)
        //             .attr('y', y)
        //             .text(labelText);
        //     })
        //     .on('mouseout', (d: any) => {});
    }
}


