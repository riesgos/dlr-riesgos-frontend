import { IconAlias, IconShapeTuple } from '../interfaces/icon.interfaces.js';
import { axisChartIconName } from '../shapes/axis-chart.js';
import { barChartIconName } from '../shapes/bar-chart.js';
import { bellCurveIconName } from '../shapes/bell-curve.js';
import { boxPlotIconName } from '../shapes/box-plot.js';
import { bubbleChartIconName } from '../shapes/bubble-chart.js';
import { cloudChartIconName } from '../shapes/cloud-chart.js';
import { curveChartIconName } from '../shapes/curve-chart.js';
import { gridChartIconName } from '../shapes/grid-chart.js';
import { heatMapIconName } from '../shapes/heat-map.js';
import { lineChartIconName } from '../shapes/line-chart.js';
import { pieChartIconName } from '../shapes/pie-chart.js';
import { scatterPlotIconName } from '../shapes/scatter-plot.js';
import { tickChartIconName } from '../shapes/tick-chart.js';
export declare const chartCollectionIcons: IconShapeTuple[];
export declare const chartCollectionAliases: IconAlias[];
/**
 * Function that can be called to load the core icon set.
 *
 * ```typescript
 * import '@cds/core/icon/register.js';
 * import { loadChartIconSet } from '@cds/core/icon';
 *
 * loadChartIconSet();
 * ```
 *
 */
export declare function loadChartIconSet(): void;
declare module '@cds/core/internal' {
    interface IconRegistrySources {
        [axisChartIconName]: string;
        [barChartIconName]: string;
        [bellCurveIconName]: string;
        [boxPlotIconName]: string;
        [bubbleChartIconName]: string;
        [cloudChartIconName]: string;
        [curveChartIconName]: string;
        [gridChartIconName]: string;
        [heatMapIconName]: string;
        [lineChartIconName]: string;
        [pieChartIconName]: string;
        [scatterPlotIconName]: string;
        [tickChartIconName]: string;
    }
}
