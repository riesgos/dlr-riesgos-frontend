import Plotly from 'plotly.js-basic-dist-min';
import { getBuildingClassColor } from './colorhelpers';



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
    anchorSelector: any, data: BarData[], width: number, height: number, xLabel: string, yLabel: string) {


        const maxLabelLength = Math.max(...data.map(d => d.label.length));

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
                }
            },
            yaxis: {
                title: {
                    text: yLabel
                },
                range: [0, yMax + 1]
            },
            autosize: false,
            width: width,
            height: height,
            margin: {
                l: 50,
                r: 30,
                b: 20 + maxLabelLength * 7,
                t: 15,
                pad: 5
            },
        };

        Plotly.newPlot(anchorSelector, newData, layout, {staticPlot: true});
}
