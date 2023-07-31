import { Selection } from 'd3-selection';
import { HSLColor, RGBColor, color, hsl } from 'd3-color';
import { scaleLinear } from 'd3-scale';
import { fraction } from './colorhelpers';
import { rgb } from 'd3-color';


function ensureRgb(colorString: string, fallback: {r: number, g: number, b: number} = {r: 125, g: 125, b: 125}): RGBColor {
  const c = color(colorString);
  if (c !== null) return c.rgb();
  return rgb(fallback.r, fallback.g, fallback.b);
}

export interface Stop {
  offset: number,
  color: string,
  opacity: number
}

function linearGradientComponent(gradientName: string) {
  let _stops: Stop[] = [];
  let _name = gradientName;
  let _direction: LegendDirection = 'horizontal';

  function _getOrAddDefs(selection: Selection<any, any, any, any>) {
    let defs: Selection<SVGDefsElement, any, any, any> = selection.select('defs');
    if (!defs.node()) defs = selection.append('defs');
    return defs;
  }

  function _getOrAddGrad(defsSelection: Selection<SVGDefsElement, any, any, any>) {
    let grad: Selection<SVGLinearGradientElement, any, any, any> = defsSelection.select(`#${_name}`);
    if (!grad.node()) {
      grad = defsSelection.append('linearGradient')
        .attr('id', _name);
      if (_direction === 'horizontal') {
        grad
          .attr('x1', '0%').attr('y1', '0%')
          .attr('x2', '100%').attr('y2', '0%');
      }
      else if (_direction === 'vertical') {
        grad
          .attr('x1', '0%').attr('y1', '0%')
          .attr('x2', '0%').attr('y2', '100%');
      }
    }
    return grad;
  }

  function gradient(selection: Selection<HTMLElement, any, any, any>) {
    const defs = _getOrAddDefs(selection);
    const gradient = _getOrAddGrad(defs);
    gradient.selectAll('stop').data(_stops)
      .enter()
      .append('stop')
      .attr('offset', d => `${d.offset}%`)
      .attr('style', d => `stop-color:rgb(${ensureRgb(d.color).r}, ${ensureRgb(d.color).g}, ${ensureRgb(d.color).b}); stop-opacity:${d.opacity}`);
  }

  gradient.stops = (stops: Stop[])                  => { _stops = stops; return gradient; }
  gradient.gradId = (name: string)                  => { _name = name; return gradient; }
  gradient.direction = (direction: LegendDirection) => { _direction = direction; return gradient; }

  return gradient;
}

function scaleColor() {

  // default parameters
  let _domain: number[] = [0, 1];
  let _range: string[] = ['rgb(255, 0, 0)', 'rgb(0, 0, 255)'];

  // actual interpolation
  function interpolate(rStart: string, rEnd: string, rel: number) {
    const cStart = color(rStart)!;
    const cEnd = color(rEnd)!;
    const cStartHSL = hsl(cStart);
    const cEndHSL = hsl(cEnd);
    const hInterp = cStartHSL.h + rel * (cEndHSL.h - cStartHSL.h);
    const sInterp = cStartHSL.s + rel * (cEndHSL.s - cStartHSL.s);
    const lInterp = cStartHSL.l + rel * (cEndHSL.l - cStartHSL.l);
    const interpHSL = hsl(hInterp, sInterp, lInterp);
    return interpHSL.rgb().toString();
  }

  // deciding which colors to interpolate between
  function scale(d: number) {
    // if smaller than domain-start ...
    if (d < _domain[0]) {
      return _range[0];
    }
    // if somewhere in between domain-start and -end, find out where exactly and interpolate:
    for (let i = 0; i < _domain.length; i++) {
      const dStart = _domain[i];
      const dEnd = _domain[i + 1];
      if (dStart <= d && d < dEnd) {
        const rStart = _range[i];
        const rEnd = _range[i + 1];
        const rel = fraction(d, dStart, dEnd);
        return interpolate(rStart, rEnd, rel);
      }
    }
    // ... if larger or equal to domain-end:
    return _range[_range.length - 1];
  };

  // public methods
  scale.domain = function (d: number[]) { _domain = d; return scale; };
  scale.range  = function (r: string[]) { _range = r;  return scale; };

  return scale;
}


export interface LegendEntryDiscrete {
  size: number,
  color: string,
  text: string
}

interface LegendEntryDiscretePositioned extends LegendEntryDiscrete {
  startPos: number,
  textPos: number,
  endPos: number,
  scaledSize: number
}


function createLegendDiscrete(
  svgSelection: Selection<HTMLElement, any, any, any>, 
  id: string,
  width: number, height: number,
  direction: LegendDirection,
  entries: LegendEntryDiscrete[],
  fractionGraphic: number = 0.5,
  margin: number = 10,
  labelAngle: number = 0
) {

  // layouting
  const dominantSize = direction === 'horizontal' ? width : height;

  const layoutEntries: LegendEntryDiscretePositioned[] = [];
  let wSum = 0.0;
  for (const entry of entries) {
    layoutEntries.push({
      ...entry,
      startPos:    (wSum),
      textPos:     (wSum + entry.size / 2.0),
      endPos:      (wSum + entry.size),
      scaledSize:   entry.size,
    })
    wSum += entry.size;
  }
  for (const entry of layoutEntries) {
    entry.startPos    *=   dominantSize / wSum;
    entry.textPos     *=   dominantSize / wSum;
    entry.endPos      *=   dominantSize / wSum;
    entry.scaledSize  *=   dominantSize / wSum;
  }

  const bandWidth           = dominantSize / entries.length;
  const graphicWidth        = direction === 'horizontal' ? width : fractionGraphic * width;
  const graphicHeight       = direction === 'horizontal' ? fractionGraphic * height : height;
  const graphicEntryWidth   = direction === 'horizontal' ? bandWidth : fractionGraphic * width;
  const graphicEntryHeight  = direction === 'horizontal' ? fractionGraphic * height : bandWidth;


  // appending legend to selection

  const legendGroup = svgSelection
    .attr('width', width + (2 * margin))
    .attr('height', height + (2 * margin))
    .append('g')
      .attr('transform', `translate(${margin}, ${margin})`)
      .attr('class', 'legendGroup');


  const graphic = legendGroup.selectAll('.legendRect')
    .data(layoutEntries)
    .enter()
    .append('g')
      .attr('class', 'legendRect')
      .attr('transform', d => direction === 'horizontal' ?
                                            `translate(${d.startPos}, 0)` :
                                            `translate(0, ${d.startPos})`)
    .append('rect')
      .attr('width',  d => direction === 'horizontal' ? d.scaledSize : graphicEntryWidth)
      .attr('height', d => direction === 'horizontal' ? graphicEntryHeight : d.scaledSize)
      .attr('fill',   d => d.color)
      .attr('stroke', d => `rgb(${[... Object.values(ensureRgb(d.color).darker().rgb())]})` )
      .attr('stroke-width', 1);


  const labels = legendGroup.selectAll('.label')
    .data(layoutEntries)
    .enter()
    .append('g')
      .attr('class', 'label')
      .attr('transform', d => direction === 'horizontal' ?
                                            `rotate(${labelAngle}) translate(${d.textPos}, ${graphicHeight + 10})` :
                                            `rotate(${labelAngle}) translate(${graphicWidth + 10}, ${d.textPos})`)
    .append('text')
      .text(d => d.text)
      .style('text-anchor', direction === 'horizontal' ? 'middle' : 'left')
      .style('dominant-baseline', 'central');

}

export interface LegendEntryContinuous {
  position: number,
  color: string,
  text: string
}

export type LegendDirection = 'horizontal' | 'vertical';

function createLegendContinuous(
  svgSelection: Selection<HTMLElement, any, any, any>,
  id: string,
  width: number, height: number,
  direction: LegendDirection,
  entries: LegendEntryContinuous[],
  fractionGraphic: number = 0.5,
  margin: number = 10,
  labelAngle: number = 0
) {

  // layouting
  const dominantSize = direction === 'horizontal' ? width : height;
  const minPos = Math.min(...entries.map(e => e.position));
  const maxPos = Math.max(...entries.map(e => e.position));

  const placementScale = scaleLinear()
    .domain([minPos, maxPos])
    .range([0, dominantSize]);

  const percentageScale = scaleLinear()
    .domain([minPos, maxPos])
    .range([0, 100]);

  const colorScale = scaleColor();
  colorScale
    .domain(entries.map(e => e.position))
    .range(entries.map(e => e.color));

  const graphicWidth  = direction === 'horizontal' ? width : fractionGraphic * width;
  const graphicHeight = direction === 'horizontal' ? fractionGraphic * height : height;


  // appending legend to selection

  const legendGroup = svgSelection
    .attr('width', width + (2 * margin))
    .attr('height', height + (2 * margin))
    .append('g')
    .attr('transform', `translate(${margin}, ${margin})`)
    .attr('class', 'legendGroup');


  const legendGradient = linearGradientComponent(id)
    .direction(direction)
    .stops(entries.map(e => ({
      offset: percentageScale(e.position),
      color: colorScale(e.position),
      opacity: 1,
    })));

  svgSelection.call(legendGradient);

  const markLines = legendGroup.selectAll('.markLine')
    .data(entries)
    .enter()
    .append('line')
    .attr('class', 'markLine')
    .attr('x1', (d: LegendEntryContinuous) => direction == 'vertical' ? 0                         : placementScale(d.position) )
    .attr('x2', (d: LegendEntryContinuous) => direction == 'vertical' ? graphicWidth + 8           : placementScale(d.position) )
    .attr('y1', (d: LegendEntryContinuous) => direction == 'vertical' ? placementScale(d.position) : 0                          )
    .attr('y2', (d: LegendEntryContinuous) => direction == 'vertical' ? placementScale(d.position) : graphicHeight + 6          )
    .attr('stroke', 'grey');

  const graphic = legendGroup.append('rect')
    .attr('class', 'graphic')
    .attr('width', graphicWidth)
    .attr('height', graphicHeight)
    .attr('fill', `url(#${id})`);

  const labels = legendGroup.selectAll('.label')
    .data(entries)
    .enter()
    .append('g')
      .attr('class', 'label')
      .attr('transform', (d: LegendEntryContinuous) => direction === 'horizontal' ?
        `translate(${placementScale(d.position)}, ${graphicHeight + 15})` :
        `translate(${graphicWidth + 10}, ${placementScale(d.position)} )`)
    .append('text')
      .text((d: LegendEntryContinuous) => d.text)
      // .style('text-anchor', direction === 'horizontal' ? 'middle' : 'left')
      .style('dominant-baseline', 'middle')
      .attr('transform', direction === 'horizontal' ? `rotate(${labelAngle})` : `rotate(${labelAngle})`);

}


export type LegendEntry = {
  color: string,
  text: string,
  position?: number,
  size?: number
};

/**
 * ## Legend component
 * When applied to a d3-selection, adds a legend to it.
 * 
 * ## Example usage
 * 
    ```js
    const entries: Entry[] = [{
    color: 'rgb(255, 0, 0)',
    text: 'red',
    position: 0.0  // position: legend infers that it must be continuous.
                   // for a discrete legend, use `size`
    }, {
    color: 'rgb(0, 255, 0)',
    text: 'green',
    position: 0.5
    }, {
    color: 'rgb(0, 0, 255)',
    text: 'blue',
    position: 1.0
    }];

    const base = select('app');
    const svg = base.append('svg');
    const legend = legendComponent()
      .id('mylegend')
      .width(300).height(50).direction('horizontal')
      .fractionGraphic(0.4)   // how much of the secondary direction should be taken up by graphic (vs labels)=
      .margin(5)
      .entries(entries);
    ```
 * 
 */
export function legendComponent() {
  let _id = 'myLegendGradient';
  let _width = 300;
  let _height = 100;
  let _angle = 0;
  let _direction: LegendDirection = 'horizontal';
  let _fractionGraphic = 0.5;
  let _continuous = false;
  let _margin = 10;
  let _entries: LegendEntry[] = [];

  function legend(selection: Selection<HTMLElement, any, any, any>) {
    if (_continuous) {
      
      let p = 0;
      const delta = Math.max(_width, _height) / _entries.length;
      const entries: LegendEntryContinuous[] = [];
      for (const entry of _entries) {
        const pos = entry.position ??  p;
        entries.push({
          color: entry.color,
          text: entry.text,
          position: pos
        });
        p += delta;
      }
      createLegendContinuous(selection, _id, _width, _height, _direction, entries, _fractionGraphic, _margin, _angle);

    } else {
      
      const entries: LegendEntryDiscrete[] = [];
      for (const entry of _entries) {
        const size = entry.size ?? 1;
        entries.push({
          color: entry.color,
          text: entry.text,
          size: size
        })
      }
      createLegendDiscrete(selection, _id, _width, _height, _direction, entries, _fractionGraphic, _margin, _angle);
    }
  }

  legend.id              = (id: string)                       => { _id = id; return legend; }
  legend.width           = (width: number)                    => { _width = width; return legend; }
  legend.height          = (height: number)                   => { _height = height; return legend; }
  legend.angle           = (angle: number)                    => { _angle = angle; return legend; }
  legend.fractionGraphic = (fractionGraphic: number)          => { _fractionGraphic = fractionGraphic; return legend; }
  legend.margin          = (margin: number)                   => { _margin = margin; return legend; }
  legend.direction       = (direction: LegendDirection)       => { _direction = direction; return legend; }
  legend.continuous      = (continuous: boolean)              => { _continuous = continuous; return legend; }
  legend.entries         = (entries: LegendEntry[])           => { _entries = entries; return legend; }

  return legend;
}
