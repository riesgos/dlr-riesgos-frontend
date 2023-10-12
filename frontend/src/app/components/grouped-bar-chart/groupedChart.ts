import { scaleBand, scaleLinear, scaleOrdinal, ScaleOrdinal } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { format } from 'd3-format';
import { select } from 'd3-selection';
import { color, hsl } from 'd3-color';
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



export type GroupingFunction = (data: SubGroupData[]) => SubGroupData[];
export type ColoringFunction = (groupName: string) => string;

export class RearrangingGroupedBarChart {
    private selectors: any = {
        svg: null,
        xLabel: null,
        yLabel: null,
        graph: null,
        barGroups: null,
        xScale: null,
        legend: null,
        legendEntriesG: null
    };
    private margin = { top: 15, right: 30, bottom: 100, left: 50 };

    constructor(
        private container: HTMLElement, 
        private widthTotal: number, 
        private heightTotal: number,
        private data: GroupedBarChartData[],
        private grayColor = color(hsl(0, 0, 0.7)).toString()
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
        const xLabelContainer = svg.append('text')
            .attr('class', 'xLabel')
            .style('text-anchor', 'middle')
            .attr('x', widthTotal / 4)
            .attr('y', height + 35)
            .text('x-label');
        
        // y-label
        const yLabelContainer = svg.append('text')        
            .attr('class', 'yLabel')
            .attr('transform', 'rotate(-90)')
            .style('text-anchor', 'middle')
            .attr('y', margin.left / 2 - 10)
            .attr('x', 2 - height / 2)
            .text('y-label');

        // legend
        const legend = svg.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(${2 * widthTotal / 3}, ${height + 45})`);
        
        const graph = svg
            .append('g')
            .attr('class', 'graph')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);
        
        // x-axis
        const xScale = scaleBand()
            .domain(groupNames)
            .range([0, width])
            .padding(0.2);
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
            .selectAll('.barGroup')
            .data(data)
            .enter()
                .append('g')
                .attr('class', 'barGroup')
                .attr('data-groupname', (d: any) => d.groupName)
                .attr('transform', (d: any) => `translate(${xScale(d.groupName)}, 0 )` );
            
        this.selectors.svg = svg;
        this.selectors.graph = graph;
        this.selectors.xLabel = xLabelContainer;
        this.selectors.yLabel = yLabelContainer;
        this.selectors.legend = legend;
        this.selectors.barGroups = barGroups;
        this.selectors.xScale = xScale;
    }

    regroup(regroupingFunction: GroupingFunction, coloringFunction: ColoringFunction, xLabel: string, yLabel: string, grayColor?: string) {
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


        // updating gray-color
        if (grayColor) this.grayColor = grayColor;

        // updating labels
        this.selectors.xLabel.text(xLabel);
        this.selectors.yLabel.text(yLabel);


        // resizing subgroup-bar-width
        const xSubgroupScale = scaleBand()
            .domain(subGroupNames)
            .range([0, this.selectors.xScale.bandwidth()])
            .padding(0.05);

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
        const rectWidth = 14;
        const rectHeight = 10;
        const newLegendEntriesG = legendEntries
            .enter()
                .append('g')
                .attr('class',     'legendEntry'                                                    )
                .attr('transform', (d: any, i: number) => `translate(${(i - I / 2) * rectWidth}, 0)`);
        if (I > 1) {
            newLegendEntriesG
                .append('rect')
                    .attr('fill',   (d: any) => d.val )
                    .attr('width',  rectWidth         )
                    .attr('height', rectHeight        );
            newLegendEntriesG
                .append('text')
                    .text((d: any) => d.key                          )
                    .style('font-size', '.75em'                      )
                    .attr('fill',       (d: any) => d.val            )
                    .attr('transform', `translate(3, 15), rotate(90)`);
        }
        this.selectors.legendEntriesG = newLegendEntriesG;


        // updating sub-groups
        const barSubGroups = this.selectors.barGroups.selectAll('.barSubGroup');
        barSubGroups
            .remove()
            .data(
                (d: GroupedBarChartData) => newData.find((nd: GroupedBarChartData) => nd.groupName === d.groupName)?.subGroups,
                (d: SubGroupData) => d.key
            )
            .enter()
                .append('g')
                    .attr('class',     'barSubGroup'                                                  )
                    .attr('transform', (d: SubGroupData) => `translate(${xSubgroupScale(d.key)}, 0 )` )
            .exit()
                .remove();

        this.selectors.barGroups.selectAll('.barSubGroup')
            .append('rect')
                .attr('x',      0                                              )
                .attr('width',  xSubgroupScale.bandwidth()                     )
                .attr('fill',   (d: SubGroupData) => subGroupColorScale(d.key) )
                .attr('y',      (d: SubGroupData) => yAxis(d.val)              )
                .attr('height', (d: SubGroupData) => graphHeight - yAxis(d.val));
        this.selectors.barGroups.selectAll('.barSubGroup')
            .append('text')
                .attr('x',             0                                                )
                .attr('y',            (d: any) => yAxis(d.val)                          )
                .style('font-size',   '0.75em'                                          )
                .style('text-anchor', 'center'                                          )
                .attr('fill',         (d: SubGroupData) => subGroupColorScale(d.key)    )
                .attr('transform',    `translate(0, -3)`)
                .text((d: SubGroupData) => d.val < 0.1 ? '' : d.val.toFixed(1) );


        // on hover
        this.selectors.barGroups.selectAll('.barSubGroup').selectAll('rect')
            .on('mouseover', (evt: any, datum: SubGroupData) => {
                this.setHoverColors(datum, subGroupColorScale);
            })
            .on('mouseout', (d: any) => {
                this.setDefaultColors(subGroupColorScale);
            });
        this.selectors.legendEntriesG.select('rect')
            .on('mouseover', (evt: any, datum: SubGroupData) => {
                this.setHoverColors(datum, subGroupColorScale);
            })
            .on('mouseout', (d: any) => {
                this.setDefaultColors(subGroupColorScale);
            });
    }

    private setDefaultColors(subGroupColorScale: ScaleOrdinal<string, any>) {
        this.selectors.barGroups
            .selectAll('.barSubGroup').selectAll('rect')
            .attr('fill', (d: SubGroupData) => subGroupColorScale(d.key));
        this.selectors.barGroups
            .selectAll('.barSubGroup').selectAll('text')
            .attr('fill', (d: SubGroupData) => subGroupColorScale(d.key));
        this.selectors.legendEntriesG.selectAll('text')
            .attr('fill', (d: any) => d.val);
        this.selectors.legendEntriesG.selectAll('rect')
            .attr('fill', (d: any) => d.val);
    }

    private setHoverColors(datum: SubGroupData, subGroupColorScale: ScaleOrdinal<string, any>) {
        this.selectors.barGroups
            .selectAll('.barSubGroup').selectAll('rect')
            .attr('fill', (d: SubGroupData) => {
                if (d.key === datum.key) return subGroupColorScale(d.key);
                else return this.grayColor;
            });
        this.selectors.barGroups
            .selectAll('.barSubGroup').selectAll('text')
            .attr('fill', (d: SubGroupData) => {
                if (d.key === datum.key) return subGroupColorScale(d.key);
                else return this.grayColor;
            });
        this.selectors.legendEntriesG.selectAll('text')
            .attr('fill', (d: any) => {
                if (d.key === datum.key) return d.val;
                else return this.grayColor;
            });
        this.selectors.legendEntriesG.selectAll('rect')
            .attr('fill', (d: any) => {
                if (d.key === datum.key) return d.val;
                else return this.grayColor;
            });
    }
}


