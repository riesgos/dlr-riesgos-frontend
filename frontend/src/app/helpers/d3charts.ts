import Plotly from 'plotly.js-basic-dist-min';
import { getBuildingClassColor } from './colorhelpers';
import { select, pointer } from 'd3-selection';
import { scaleBand, scaleLinear, scaleOrdinal } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';


export function createGroupedBarChart(
    anchorSelector: any, data: {[groupName: string]: BarData[]}, width: number, height: number, xLabel: string, yLabel: string
) {

    let dataLength = 0;
    for (const key in data) {
        for (const el of data[key]) {
            dataLength += el.value;
        }
    }
    if (dataLength === 0) {
        anchorSelector.innerHTML = '<p>{{ NoData }}</p>';
        return;
    }

    // completing data: all groups must contain the same datasets
    const xAxisLabels = [];
    const groupNames = [];
    for (const key in data) {
        if (data[key]) {
            groupNames.push(key);
            for (const el of data[key]) {
                if (!xAxisLabels.includes(el.label)) {
                    xAxisLabels.push(el.label);
                }
            }
        }
    }

    for (const groupName of groupNames) {
            for (const label of xAxisLabels) {
                if (!data[groupName].find(el => el.label === label)) {
                    data[groupName].push({
                        label: label,
                        value: 0
                    });
                }
            }
    }

    // sorting data alphabetically
    for (const groupName of groupNames) {
            data[groupName].sort((dp1, dp2) => dp1.label > dp2.label ? 1 : -1);
    }

    // rendering
    const newData = [];
    for (const groupName of groupNames) {
        const groupData = data[groupName];
        const transformedGroupData = {
            type: 'bar',
            name: groupName.substr(0, 13),
            x: groupData.map(dp => dp.label),
            y: groupData.map(dp => dp.value),
            marker: {
                color: getBuildingClassColor(groupName)
            }
        };
        newData.push(transformedGroupData);
    }

    const yMax = newData.map(dp => dp.y).flat().reduce((last, curr) => curr > last ? curr : last, 0);

    const layout = {
        showlegend: true,
        legend: {
          orientation: 'h'
        },
        xaxis: {
          automargin: true,
          title: {
            text: xLabel,
            standoff: 20 + 20 * Math.ceil(groupNames.length / 2)
          }
        },
        yaxis: {
          title: {
            text: yLabel
          },
          range: [0, yMax + 1]
        },
        width,
        height,
        margin: {
          l: 50,
          r: 30,
          b: 50,
          t: 15,
          pad: 5
        }
      };

    Plotly.newPlot(anchorSelector, newData, layout, {staticPlot: true});
}

export interface BarData {
    label: string;
    value: number;
    hoverText?: string;
    color?: string;
}



export function createBarChart(
    anchorSelector: any, data: BarData[], width: number, height: number, xLabel: string, yLabel: string,
    options?: {yRange?: [number, number]}) {

        let dataLength = 0;
        for (const dp of data) {
            dataLength += dp.value;
        }
        if (dataLength === 0) {
            anchorSelector.innerHTML = '<p>{{ NoData }}</p>';
            return;
        }

        const newData = [{
            type: 'bar',
            x: data.map(dp => dp.label),
            y: data.map(dp => dp.value),
            marker: {
                color: data.map(dp => getBuildingClassColor(dp.label))
            }
        }];

        const yMax = newData[0].y.reduce((last, curr) => curr > last ? curr : last, 0);

        const layout = {
            xaxis: {
                title: {
                    text: xLabel
                },
            },
            yaxis: {
                title: {
                    text: yLabel
                },
                range: options?.yRange ? options.yRange : [0, yMax + 1]
            },
            width,
            height,
            margin: {
                l: 50,
                r: 30,
                b: 50,
                t: 15,
                pad: 5
            },
        };

        Plotly.newPlot(anchorSelector, newData, layout, {staticPlot: true});
}


export function createBigBarChart(
    anchorSelector: any, data: BarData[], widthTotal: number, heightTotal: number, xLabel: string, yLabel: string, noDataString = 'No data') {
  
  
        const base = select(anchorSelector);
  
        let dataLength = 0;
        for (const dp of data) {
            dataLength += dp.value;
        }
        if (dataLength === 0) {
            base.append('p').html(noDataString);
            return;
        }
        const barNames = data.map(d => d.label);
  
        const margin = { top: 10, right: 10, bottom: 10, left: 20 };
        const width = widthTotal - margin.left - margin.right;
        const height = heightTotal - margin.top - margin.bottom;
        
        // append the svg object to the container
        const svg = base
            .append('svg')
            .attr('class', 'fullGraph')
            .attr('width', widthTotal)
            .attr('height', heightTotal)
            .attr('viewport', `0, 0, ${widthTotal}, ${heightTotal}`);
        
        // x-label
        const xLabelContainer = svg.append('text')
            .attr('class', 'xLabel')
            .style('text-anchor', 'middle')
            .attr('transform', `translate(${widthTotal / 2}, ${heightTotal - margin.bottom / 2})`)
            .text(xLabel);
        
        // y-label
        const yLabelContainer = svg.append('text')
            .attr('class', 'yLabel')
            .attr('transform', `translate(${margin.left / 2}, ${height / 2}) rotate(-90)`)
            .style('text-anchor', 'middle')
            .text(yLabel);
    
        // central canvas including axes, but without x- and y-label
        const graph = svg
            .append('g')
            .attr('class', 'graph')
            .attr('width', width)
            .attr('height', height)
            .attr('transform', `translate(${margin.left}, ${margin.top})`);
        
        // x-axis
        const xScale = scaleBand()
            .domain(barNames)
            .range([0, width - 40]) // should be `- yAxis.width`, but we don't know that yet.
            .padding(0.2);
        const xAxisGenerator = axisBottom(xScale);
        graph.append('g')
            .attr('class', 'xAxis')
            .call(xAxisGenerator);
        // rotating x-labels
        const letterSize = 10;
        const maxLabelSize = barNames.reduce((c, n) => n.length > c ? n.length : c, 0) * letterSize;
        const tickSize = xAxisGenerator.tickSize();
        if (maxLabelSize > tickSize) {
          graph.select('.xAxis').selectAll('.tick').selectAll('text')
            .attr('text-anchor', 'start')
            .attr('transform', (datum, index, elements) => {
              const element = elements[index];
              const deltaX = xScale(datum);
              const rotation = 60;
              const transform = `translate(${letterSize / 2}, ${letterSize / 2}) rotate(${rotation})`;
              return transform;
            })
        }
        const xAxis = graph.select('.xAxis');
        const xAxisSize = xAxis.node().getBBox();
    
    
        // y-axis
        const minVal = data.reduce((c, v) => Math.min(c, v.value), Infinity);
        const maxVal = data.reduce((c, v) => Math.max(c, v.value), -Infinity);
        const padding = 0.1 * (maxVal - minVal);
        const startVal = minVal === 0.0 ? minVal : minVal - padding;
        const endVal = maxVal + padding;
        const yScale = scaleLinear()
            .domain([startVal, endVal])
            .range([height - xAxisSize.height, 0]);
        const yAxisGenerator = axisLeft(yScale);
        graph.append('g')
            .attr('class', 'yAxis')
            .call(yAxisGenerator);
        const yAxis = graph.select('.yAxis');
        const yAxisSize = yAxis.node().getBBox();
        
        xAxis.attr('transform', `translate(${yAxisSize.width}, ${height - xAxisSize.height})`);
        yAxis.attr('transform', `translate(${yAxisSize.width}, 0)`);
    
    
        // center: actual plot without x- and y-axis
        const centerHeight = height - xAxisSize.height;
        const centerWidth = width - yAxisSize.width;
        const center = graph
            .append('g')
            .attr('class', 'center')
            .attr('transform', `translate(${yAxisSize.width}, 0)`)
            .attr('width', centerWidth)
            .attr('height', centerHeight);
    
    
        const barColors: string[] = data.map(d => d.color ? d.color : getBuildingClassColor(d.label));
        const colorScale = scaleOrdinal()
          .domain(barNames)
          .range(barColors);
    
        // bars
        const bars = center.selectAll('.bar')
            .data(data)
            .enter()
                .append('g')
                .attr('class', 'bar')
                .attr('transform', (d: any) => `translate(${xScale(d.label)}, 0)`);
    
        // bars: append rect
        bars.append('rect')
          .attr('width', xScale.step())
          .attr('height', d => centerHeight - yScale(d.value))
          .attr('y',      d => yScale(d.value))
          .attr('fill',   d => colorScale(d.label));
    
  
  
        // bars: hover-effect
        const maxWidthHoverText = 200;
        const infobox = base.append('div')
            .style('max-width', `${maxWidthHoverText}px`)
            .style('visibility', 'hidden')
            .style('position', 'absolute')
            .style('display', 'block')
            .style('z-index', 1000)
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "3px")
            .style('padding', '3px');
        const infoboxP = infobox.append('p');
    
        bars.on('mouseenter', (evt, datum) => {
          infobox.style('visibility', 'visible');
          const text = datum.hoverText ? datum.hoverText : `${yLabel}: ${datum.value}`;
          infoboxP.html(text);
          const positionInsideSvg = pointer(evt, svg.node());  // doesnt seem to work in popup
          const positionInLayer = [evt.layerX, evt.layerY];    // doesnt seem to work in raw html
          let x = Math.min(positionInsideSvg[0], positionInLayer[0]);
          if (x > centerWidth / 2) {
            x -= maxWidthHoverText;
          }
          const y = Math.min(positionInsideSvg[1], positionInLayer[1]);
          infobox
            .style('left', `${x}px`)
            .style('top', `${y}px`);
    
          bars.select('rect').attr('fill', 'lightgray');
          select(evt.target).select('rect').attr('fill', colorScale(datum.label));
          xAxis.selectAll('text').attr('color', 'lightgray');
          const n = xAxis.selectAll('text').nodes().find(n => n.innerHTML === datum.label);
          select(n).attr('color', 'black');
        })
        .on('mouseleave', (evt, datum) => {
          infobox.style('visibility', 'hidden');
          bars.selectAll('rect').attr('fill', d => colorScale(d.label));
          xAxis.selectAll('text').attr('color', 'currentColor'); // 'hsl(198deg, 0%, 40%)'); // = --clr-global-font-color
        });
  }