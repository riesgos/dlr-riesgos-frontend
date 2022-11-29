import { select, color, hsl, scaleBand } from 'd3';



function linearGradientComponent(gradientName: string) {
  let _stops = [];
  let _name = gradientName;
  let _direction = 'horizontal';

  function _getOrAddDefs(selection) {
    let defs = selection.select('defs');
    if (!defs.node()) defs = selection.append('defs');
    return defs;
  }

  function _getOrAddGrad(defsSelection) {
    let grad = defsSelection.select(`#${_name}`);
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

  function gradient(selection) {
    const defs = _getOrAddDefs(selection);
    const gradient = _getOrAddGrad(defs);
    gradient.selectAll('stop').data(_stops)
      .enter()
      .append('stop')
      .attr('offset', d => `${d.offset}%`)
      .attr('style', d => `stop-color:rgb(${color(d.color).r}, ${color(d.color).g}, ${color(d.color).b}); stop-opacity:${d.opacity}`);
  }

  gradient.stops = (stops) => { _stops = stops; return gradient; }
  gradient.gradId = (name) => { _name = name; return gradient; }
  gradient.direction = (direction) => { _direction = direction; return gradient; }

  return gradient;
}

function scaleColor() {

  // default parameters
  let _domain = [0, 1];
  let _range = ['rgb(255, 0, 0)', 'rgb(0, 0, 255)'];

  // actual interpolation
  function interpolate(rStart, rEnd, rel) {
    const cStart = color(rStart);
    const cEnd = color(rEnd);
    const cStartHSL = hsl(cStart);
    const cEndHSL = hsl(cEnd);
    const hInterp = cStartHSL.h + rel * (cEndHSL.h - cStartHSL.h);
    const sInterp = cStartHSL.s + rel * (cEndHSL.s - cStartHSL.s);
    const lInterp = cStartHSL.l + rel * (cEndHSL.l - cStartHSL.l);
    const interpHSL = hsl(hInterp, sInterp, lInterp);
    return interpHSL.rgb().toString();
  }

  // deciding which colors to interpolate between
  function scale(d) {
    for (let i = 0; i < _domain.length; i++) {
      const dStart = _domain[i];
      const dEnd = _domain[i + 1];
      if (d < dStart) {
        return _range[0];
      }
      if (dStart <= d && d < dEnd) {
        const rStart = _range[i];
        const rEnd = _range[i + 1];
        const rel = (d - dStart) / (dEnd - dStart);
        return interpolate(rStart, rEnd, rel);
      }
      if (dEnd < d) {
        return _range[_range.length - 1];
      }
    }
  };

  // public methods
  scale.domain = function (d) { _domain = d; return scale; };
  scale.range = function (r) { _range = r; return scale; };

  return scale;
}


export interface Entry {
    position: number,
    color: string,
    text: string
}

export type LegendDirection = 'horizontal' | 'vertical';

function createLegend(svgSelection, id: string, width: number, height: number, continuous: boolean, direction: LegendDirection, entries: Entry[]) {

  // layouting

  const placementScale = scaleBand()
    .domain(entries.map(e => e.position))
    .range([0, direction === 'horizontal' ? width : height]);

  const colorScale = scaleColor();
  colorScale
    .domain(entries.map(e => e.position))
    .range(entries.map(e => e.color));


  const graphicWidth        = direction === 'horizontal' ? width                      : placementScale.bandwidth();
  const graphicHeight       = direction === 'horizontal' ? height / 2                 : height;
  const graphicEntryWidth   = direction === 'horizontal' ? placementScale.bandwidth() : placementScale.bandwidth();
  const graphicEntryHeight  = direction === 'horizontal' ? height / 2                 : placementScale.bandwidth();


  // appending legend to selection

  const legendGroup = svgSelection
    .attr('width', width)
    .attr('height', height)
    .append('g')
      .attr('class', 'legendGroup');

  if (continuous) {
    const legendGradient = linearGradientComponent(id)
      .direction(direction)
      .stops(entries.map(e => ({
        offset: e.position * 100,
        color: colorScale(e.position),
        opacity: 1
      })));
  
    svgSelection.call(legendGradient);
    
    const graphic = legendGroup.append('rect')
      .attr('class', 'graphic')
      .attr('width', graphicWidth)
      .attr('height', graphicHeight)
      .attr('fill', `url(#${id})`);
  } 
  
  else {
    const graphic = legendGroup.selectAll('.legendRect')
      .data(entries)
      .enter()
        .append('g')
        .attr('class', 'legendRect')
        .attr('transform', d => direction === 'horizontal' ? 
                                `translate(${placementScale(d.position)}, 0)` :
                                `translate(0, ${placementScale(d.position)})` )
        .append('rect')
        .attr('width', graphicEntryWidth)
        .attr('height', graphicEntryHeight)
        .attr('fill', d => colorScale(d.position));
  }



  const labels = legendGroup.selectAll('.label')
    .data(entries)
    .enter()
    .append('g')
    .attr('class', 'label')
    .attr('transform', d => direction === 'horizontal' ?
                            `translate(${placementScale(d.position) + placementScale.bandwidth() / 2}, ${graphicHeight + 20})` : 
                            `translate(${graphicWidth + 20}, ${placementScale(d.position) + placementScale.bandwidth() / 2})` )
    .append('text')
    .text(d => d.text)
    .style('font-size', '.75em')
    .style('text-anchor', direction === 'horizontal' ? 'middle' : 'left')
    .attr('fill', 'black');

}


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
    position: 0.0
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
    .continuous(true).entries(entries);
    ```
 * 
 */
export function legendComponent() {
  let _id = 'myLegendGradient';
  let _width = 300;
  let _height = 100;
  let _continuous = false;
  let _direction: LegendDirection = 'horizontal';
  let _entries: Entry[] = [];

  function legend(selection) {
    createLegend(selection, _id, _width, _height, _continuous, _direction, _entries);
  }

  legend.id         = (id: string)                  => { _id = id; return legend; }
  legend.width      = (width: number)               => { _width = width; return legend; }
  legend.height     = (height: number)              => { _height = height; return legend; }
  legend.continuous = (continuous: boolean)         => { _continuous = continuous; return legend; }
  legend.direction  = (direction: LegendDirection)  => { _direction = direction; return legend; }
  legend.entries    = (entries: Entry[])            => { _entries = entries; return legend; }

  return legend;
}





