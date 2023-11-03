import { getBuildingClassColor } from './colorhelpers';
import { select, pointer } from 'd3-selection';
import { scaleBand, scaleLinear, scaleOrdinal } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { format } from 'd3-format';



export interface BarDatum {
    label: string;
    value: number;
    hoverText?: string;
    color?: string;
}

export function createBigBarChart(
    anchorSelector: any, data: BarDatum[], widthTotal: number, heightTotal: number, xLabel: string, yLabel: string, noDataString?: string) {
  
  
        const base = select(anchorSelector);
  
        let dataLength = 0;
        for (const dp of data) {
            dataLength += dp.value;
        }
        if (dataLength === 0 && noDataString) {
            base.append('p').html(noDataString);
            return;
        }
        const barNames = data.map(d => d.label);
  
        const margin = { top: 10, right: 10, bottom: 30, left: 40 };
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
            .attr('transform', `translate(${widthTotal / 2}, ${heightTotal - margin.bottom / 4})`)
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
              const deltaX = xScale(datum as string);
              const rotation = 60;
              const transform = `translate(${letterSize / 2}, ${letterSize / 2}) rotate(${rotation})`;
              return transform;
            })
        }
        const xAxis = graph.select<SVGGElement>('.xAxis')!;
        const xAxisSize = xAxis.node()!.getBBox();
    
    
        // y-axis
        const minVal = data.reduce((c, v) => Math.min(c, v.value), Infinity);
        const maxVal = data.reduce((c, v) => Math.max(c, v.value), -Infinity);
        const padding = 0.1 * (maxVal - minVal);
        const startVal = minVal >= 0.0 ? 0 : minVal - padding;
        const endVal = Math.max(maxVal + padding, 1.0);
        let yScale = scaleLinear()
            .domain([Math.round(startVal), Math.round(endVal)])
            .range([height - xAxisSize.height, 0]);
        const yAxisGenerator = axisLeft(yScale);

        if (maxVal < 50) { // making sure that only integer values on y-axis
          const yAxisTicks = yScale.ticks().filter(tick => Number.isInteger(tick));
          yAxisGenerator.tickValues(yAxisTicks).tickFormat(format("d"));
        }

        graph.append('g')
            .attr('class', 'yAxis')
            .call(yAxisGenerator);
        const yAxis = graph.select<SVGGElement>('.yAxis')!;
        const yAxisSize = yAxis.node()!.getBBox();
        
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
        const colorScale = scaleOrdinal<string>()
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
          const text = datum.hoverText ? datum.hoverText : `${yLabel}: ${datum.value}`;
          infoboxP.html(text);
          const positionInsideSvg = pointer(evt, svg.node());  // doesnt seem to work in popup
          const positionInLayer = [evt.layerX, evt.layerY];    // doesnt seem to work in raw html
          let x = Math.min(positionInsideSvg[0], positionInLayer[0]);
          if (x > centerWidth / 2) {
            x -= text.length * 6;
            x -= 20;  // safety-distance so popup doesn't touch mouse (which would trigger a `mouseout` event)
          } else {
            x += 20; // safety-distance so popup doesn't touch mouse (which would trigger a `mouseout` event)
          }
          const y = Math.min(positionInsideSvg[1], positionInLayer[1]);
          infobox
            .style('left', `${x}px`)
            .style('top', `${y}px`);
          infobox.style('visibility', 'visible');
    
          bars.select('rect').style('fill', 'lightgray');
          select(evt.target).select('rect').style('fill', colorScale(datum.label));
          xAxis.selectAll('text').style('fill', 'lightgray');
          const n = xAxis.selectAll<SVGTextElement, unknown>('text').nodes().find(n => n.innerHTML === datum.label);
          if (n) select(n).style('fill', 'black');
        })
        
        bars.on('mouseout', (evt, datum) => {
          infobox.style('visibility', 'hidden');
          bars.selectAll<SVGRectElement, BarDatum>('rect').style('fill', d => colorScale(d.label));
          xAxis.selectAll('text').style('fill', 'lightgray'); // 'hsl(198deg, 0%, 40%)'); // = --clr-global-font-color
        });
  }
