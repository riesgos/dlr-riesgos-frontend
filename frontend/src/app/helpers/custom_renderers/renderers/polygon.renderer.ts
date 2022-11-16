import { ElementsBundle, Program, Index, AttributeData, Context, UniformData } from '../engine/engine.core';
import { getCurrentFramebuffersPixel, getCurrentFramebuffersPixels, setup3dScene } from '../engine/webgl2';
import earcut from 'earcut';

import { Feature } from 'ol';
import { Vector as VectorLayer } from 'ol/layer';
import LayerRenderer from 'ol/renderer/Layer';
import { FrameState } from 'ol/PluggableMap';
import Polygon from 'ol/geom/Polygon';
import MultiPolygon from 'ol/geom/MultiPolygon';
import { Options } from 'ol/layer/BaseVector';
import { Pixel } from 'ol/pixel';
import { Coordinate } from 'ol/coordinate';
import VectorSource from 'ol/source/Vector';
import { containsXY } from 'ol/extent';


function apply(transform, coordinate) {
    const x = coordinate[0];
    const y = coordinate[1];
    coordinate[0] = transform[0] * x + transform[2] * y + transform[4];
    coordinate[1] = transform[1] * x + transform[3] * y + transform[5];
    return coordinate;
  }

export interface PolygonRendererData {
    coords: AttributeData;
    colors: AttributeData;
    polyIndex: Index;
    lineIndex: Index;
    bbox: number[];
}


export function parseFeaturesToRendererData(
    source: VectorSource<Polygon | MultiPolygon>,
    colorFunction: (f: Feature<Polygon>) =>  number[]
    ): PolygonRendererData {

    /**
     * Path: Coords[]
     * Polygon: Path[] <-- first path: outline, all other paths: holes
     * MultiPolygon: Polygon[]
     */

    const polygonIndices: number[][] = [];
    const lineIndices: number[][] = [];
    const coords: number[][] = [];
    const colors: number[][] = [];

    const extent = source.getExtent();

    const features = source.getFeatures();
    let prevIndx = 0;
    for (const feature of features) {

        const type = feature.getGeometry().getType();
        const coordinates = feature.getGeometry().getCoordinates();
        if (type === 'Polygon') {

            coords.push(...(coordinates  as number[][][])[0]);
            const pIndices = earcut(coordinates[0].flat()).map(i => i + prevIndx);
            polygonIndices.push(pIndices);
            const lIndices = [];
            const nrPoints = coordinates[0].length;
            for (let n = 0; n < nrPoints - 1; n++) {
                lIndices.push(prevIndx + n);
                lIndices.push(prevIndx + n + 1);
            }
            lIndices.push(prevIndx + nrPoints - 1);
            lIndices.push(prevIndx);
            lineIndices.push(lIndices);
            const color = colorFunction(feature as Feature<Polygon>);
            colors.push(... Array(nrPoints).fill(color));

            prevIndx += nrPoints;
        } else if (type === 'MultiPolygon') {
            for (const polygonCoords of coordinates) {

                coords.push(... (polygonCoords as number[][][])[0]);
                const pIndices = earcut(polygonCoords[0].flat()).map(i => i + prevIndx);
                polygonIndices.push(pIndices);
                const lIndices = [];
                const nrPoints = polygonCoords[0].length;
                for (let n = 0; n < nrPoints - 1; n++) {
                    lIndices.push(prevIndx + n);
                    lIndices.push(prevIndx + n + 1);
                }
                lIndices.push(prevIndx + nrPoints - 1);
                lIndices.push(prevIndx);
                lineIndices.push(lIndices);
                const color = colorFunction(feature as any);
                colors.push(... Array(nrPoints).fill(color));

                prevIndx += nrPoints;
            }
        }
    }

    const coordAttr = new AttributeData(new Float32Array(coords.flat()), 'vec2', false);
    const colorsAttr = new AttributeData(new Float32Array(colors.flat()), 'vec4', false);
    const polyIndex = new Index(new Uint32Array(polygonIndices.flat()));
    const lineIndex = new Index(new Uint32Array(lineIndices.flat()));

    return {
        colors: colorsAttr,
        coords: coordAttr,
        polyIndex: polyIndex,
        lineIndex: lineIndex,
        bbox: extent,
    };
}

export class WebGlPolygonRenderer extends LayerRenderer<VectorLayer<VectorSource<Polygon>>> {
    polyShader: ElementsBundle;
    lineShader: ElementsBundle;
    context: Context;
    canvas: HTMLCanvasElement;
    bbox: number[];

    constructor(layer: VectorLayer<VectorSource<Polygon>>, colorFunction: (feature) => number[]) {
        super(layer);

        const data = parseFeaturesToRendererData(layer.getSource(), colorFunction);

        const canvas = document.createElement('canvas') as HTMLCanvasElement;
        canvas.width = 600;
        canvas.height = 600;
        canvas.style.setProperty('position', 'absolute');
        canvas.style.setProperty('left', '0px');
        canvas.style.setProperty('top', '0px');
        canvas.style.setProperty('width', '100%');
        canvas.style.setProperty('height', '100%');
        const context = new Context(canvas.getContext('webgl2', {preserveDrawingBuffer: true}) as WebGL2RenderingContext);


        const polyShader = new ElementsBundle(new Program(`#version 300 es
        precision lowp float;
        in vec2 a_coord;
        in vec4 a_color;
        flat out vec4 v_color;
        uniform vec4 u_bbox;

        void main() {
            gl_Position = vec4( -1.0 + 2.0 * (a_coord.x - u_bbox.x) / (u_bbox.z - u_bbox.x),  -1.0 + 2.0 * (a_coord.y - u_bbox.y) / (u_bbox.w - u_bbox.y), 0, 1);
            v_color = a_color;
        }`, `#version 300 es
        precision lowp float;
        flat in vec4 v_color;
        out vec4 vertexColor;

        void main() {
            vertexColor = v_color;
        }`), {
            a_coord: data.coords,
            a_color: data.colors
        }, {
            u_bbox: new UniformData('vec4', [0, 0, 360, 180])
        }, {}, 'triangles', data.polyIndex);

        const lineShader = new ElementsBundle(new Program(`#version 300 es
        precision lowp float;
        in vec2 a_coord;
        in vec4 a_color;
        flat out vec4 v_color;
        uniform vec4 u_bbox;

        void main() {
            gl_Position = vec4( -1.0 + 2.0 * (a_coord.x - u_bbox.x) / (u_bbox.z - u_bbox.x),  -1.0 + 2.0 * (a_coord.y - u_bbox.y) / (u_bbox.w - u_bbox.y), 0, 1);
            v_color = a_color;
        }`, `#version 300 es
        precision lowp float;
        flat in vec4 v_color;
        out vec4 vertexColor;

        void main() {
            vertexColor = vec4(0.8 * v_color.xyz, 1.0);
        }`), {
            a_coord: data.coords,
            a_color: data.colors
        }, {
            u_bbox: new UniformData('vec4', [0, 0, 360, 180])
        }, {}, 'lines', data.lineIndex);

        setup3dScene(context.gl);
        polyShader.upload(context);
        polyShader.initVertexArray(context);
        lineShader.upload(context);
        lineShader.initVertexArray(context);

        // for saving memory: deleting local copies of GPU data.
        delete(polyShader.attributes);
        delete(polyShader.index.data);
        delete(lineShader.attributes);
        delete(lineShader.index.data);

        this.polyShader = polyShader;
        this.lineShader = lineShader;
        this.context = context;
        this.canvas = canvas;
        this.bbox = data.bbox;
    }

    prepareFrame(frameState: FrameState): boolean {
        return true;
    }

    renderFrame(frameState: FrameState, target: HTMLElement): HTMLElement {
        const layerState = frameState.layerStatesArray[frameState.layerIndex];
        this.canvas.style.opacity = `${layerState.opacity}`;
        const bbox = frameState.extent;
        this.polyShader.bind(this.context);
        this.polyShader.updateUniformData(this.context, 'u_bbox', bbox);
        this.polyShader.draw(this.context, [0, 0, 0, 0]);
        this.lineShader.bind(this.context);
        this.lineShader.updateUniformData(this.context, 'u_bbox', bbox);
        this.lineShader.draw(this.context);
        return this.canvas;
    }

    renderDeclutter(frameState) {}


    /**
     * @param pixel Pixel.
     * @param frameState FrameState.
     * @param hitTolerance Hit tolerance in pixels.
     * @return {Uint8ClampedArray|Uint8Array|} The result.  If there is no data at the pixel
     *    location, null will be returned.  If there is data, but pixel values cannot be
     *    returned, and empty array will be returned.
     */
    getDataAtPixel(pixel: Pixel, frameState: FrameState, hitTolerance: number) {
        const coordinate = apply(
            frameState.pixelToCoordinateTransform,
            pixel.slice()
        );
        if (!containsXY(this.bbox, coordinate[0], coordinate[1])) {
            return null;
        }

        const viewBox = frameState.extent;
        const fractionX = (coordinate[0] - viewBox[0]) / (viewBox[2] - viewBox[0]);
        const fractionY = (coordinate[1] - viewBox[1]) / (viewBox[3] - viewBox[1]);
        const pixelX = this.canvas.width * fractionX;
        const pixelY = this.canvas.height * fractionY;
        const x = Math.round(pixelX);
        const y = Math.round(pixelY);

        const rawData = getCurrentFramebuffersPixel(this.canvas, [x, y]) as Uint8Array;
        if (rawData[3] > 0) {
            return rawData;
        }
        return null;
    }

    /**
     * @param coordinate Coordinate.
     * @param frameState Frame state.
     * @param hitTolerance Hit tolerance in pixels.
     * @param callback Feature callback.
     * @param matches ... honestly, haven't checked. Should look into this.
     * @return Callback result.
     * @template T
     */
    forEachFeatureAtCoordinate(coordinate: Coordinate, frameState: FrameState, hitTolerance: number, callback: any, matches: any[]) {
        const layer = super.getLayer();
        const features = layer.getSource().getFeaturesAtCoordinate(coordinate);
        for (const feature of features) {
            return callback(feature, layer);
        }
        return undefined;
    }
}

export interface WebGlPolygonLayerOptions extends Options<VectorSource<Polygon>> {
    webGlColorFunction: (feature) => number[];
}

export class WebGlPolygonLayer extends VectorLayer<VectorSource<Polygon>> {

    webGlColorFunction: (feature) => number[];

    constructor(opt_options: WebGlPolygonLayerOptions) {
        super(opt_options);
        this.webGlColorFunction = opt_options.webGlColorFunction;
    }

    createRenderer() {
        const renderer = new WebGlPolygonRenderer(this, this.webGlColorFunction);
        return renderer;
    }

    renderDeclutter(frameState) {}
}
