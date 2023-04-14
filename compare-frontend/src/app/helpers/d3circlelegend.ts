import { create, select, Selection } from "d3-selection";
import { scaleBand } from 'd3-scale';



export interface LegendEntry {
    radius: number, label: string, fill?: string
}

export type Orientation = "horizontal" | "vertical";

export function drawLegend(
    svg: Selection<SVGSVGElement, unknown, HTMLElement, any>, 
    legendData: LegendEntry[], 
    orientation: Orientation,
    legendWidth = 150,
    legendHeight = 150,
) {

    const letterLength = 10;
    const textAngle = 45;
    const textAngleRads = textAngle * 2.0 * Math.PI / 360.0;

    const lbls = legendData.map(d => d.label);
    const maxRadius = Math.max(...legendData.map(e => e.radius));
    const primaryAxisLength = orientation === "horizontal" ? legendWidth : legendHeight;

    const scale = scaleBand()
        .domain(lbls)
        .range([0, primaryAxisLength])
        .padding(0.2);

    // Create a group element for the legend
    const baseGroup = svg.append("g");
    
    if (orientation === "vertical") {
        baseGroup.attr(`transform`, `translate(${maxRadius + 10}, ${10})`);
    } else {
        // create(`svg:text`).text("some text").node()!.getComputedTextLength();
        const textLength = Math.max(... lbls.map(l => l.length));
        const spacingTop = textLength * letterLength * Math.sin(textAngleRads);
        baseGroup.attr(`transform`, `translate(${maxRadius + 10}, ${10 + spacingTop})`);
    }

    // Create a circle and label for each legend item
    const circles = baseGroup.selectAll("circle")
        .data(legendData)
        .enter()
        .append("circle")
        .attr("r", d => d.radius)
        .style("fill", d => d.fill || "none")

    const labels = baseGroup.selectAll("text")
        .data(legendData)
        .enter()
        .append("text")
        .text(d => d.label)
        .attr('class', "label")
        .attr("text-anchor", "start")
        .style('dominant-baseline', 'central');

    // Adjust circle and label layout based on orientation
    if (orientation === "horizontal") {
        circles.attr("transform", (d, i) => `translate(${scale(d.label)}, 0)`);
        labels.attr("transform", (d, i) => `translate(${d.radius + (scale(d.label) || 0)}, ${-10}) rotate(-${textAngle})`);
    } else {
        circles.attr("transform", (d, i) => `translate(0, ${scale(d.label)})`);
        labels.attr("transform", d => `translate(${d.radius + 5}, ${scale(d.label)})`);
    }

    // Add stroke to circles last to ensure it's on top of any fill
    circles.style("stroke", "black");
}


export function circleLegendComponent() {
    let _width = 150;
    let _height = 150;
    let _orientation: Orientation = "vertical";
    let _data: LegendEntry[] = [];

    function legend(selection: Selection<SVGSVGElement, any, any, any>) {
        drawLegend(selection, _data, _orientation, _width, _height);
    }

    legend.width       = (width: number)            => {_width = width;             return legend;}      
    legend.height      = (height: number)           => {_height = height;           return legend;}      
    legend.orientation = (orientation: Orientation) => {_orientation = orientation; return legend;}              
    legend.data        = (data: LegendEntry[])      => {_data = data;               return legend;}

    return legend;
}

// ** EXAMPLE USAGE **
// // Define the legend data
// const legendData: LegendEntry[] = [
//     { radius: 10, label: "Magnitude 8+" },
//     { radius: 8, label: "Magnitude 7-8" },
//     { radius: 6, label: "Magnitude 6-7", fill: "orange" },
//     { radius: 4, label: "Magnitude 5-6", fill: "yellow" },
//     { radius: 2, label: "Magnitude 4-5", fill: "green" }
// ];

// // Define the SVG element where the legend will be drawn
// const container = select('#app');
// const svg = container.append('svg');
// const legend1 = circleLegendComponent().orientation("vertical").data(legendData);
// svg.call(legend1);

