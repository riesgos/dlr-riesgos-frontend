import Plotly from 'plotly.js/dist/plotly';


export interface Bardata {
    label: string;
    value: number;
}

export function createBarchart(
    anchorSelector: any, data: Bardata[], width: number, height: number, xlabel: string, ylabel: string,
    xAxisAngle = 0, yAxisAngle = 0) {

        const newData = [{
            type: 'bar',
            x: data.map(dp => dp.label),
            y: data.map(dp => dp.value)
        }];

        const layout = {
            xaxis: {
                title: {
                    text: xlabel
                }
            },
            yaxis: {
                title: {
                    text: ylabel
                }
            },
            width: width,
            height: height,
        };


        Plotly.newPlot(anchorSelector, newData, layout, {staticPlot: true});
}

export function createBigBarchart(
    anchorSelector: any, data: Bardata[], width: number, height: number, xlabel: string, ylabel: string) {

        const newData = [{
            type: 'bar',
            x: data.map(dp => dp.label),
            y: data.map(dp => dp.value)
        }];

        const layout = {
            xaxis: {
                title: {
                    text: xlabel
                }
            },
            yaxis: {
                title: {
                    text: ylabel
                }
            },
            autosize: false,
            width: width,
            height: height,
            margin: {
                l: 50,
                r: 30,
                b: 130,
                t: 15,
                pad: 5
            },
        };


        Plotly.newPlot(anchorSelector, newData, layout, {staticPlot: true});
}

export function createConfusionMatrix(
    anchorSelector: any, data: number[][], width: number, height: number, xlabel: string, ylabel: string) {

    const newData = [{
        type: 'heatmap',
        z: data
    }];

    const layout = {
        xaxis: {
            title: {
                text: xlabel
            }
        },
        yaxis: {
            title: {
                text: ylabel
            }
        },
        width: width,
        height: height,
    };

    Plotly.newPlot(anchorSelector, newData, layout, {staticPlot: true});
}
