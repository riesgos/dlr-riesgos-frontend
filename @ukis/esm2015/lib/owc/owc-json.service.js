/**
 * @fileoverview added by tsickle
 * Generated from: lib/owc/owc-json.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { VectorLayer, RasterLayer, WmsLayertype, WmtsLayertype, WfsLayertype, GeojsonLayertype, CustomLayertype, XyzLayertype, isRasterLayertype, isVectorLayertype, WmtsLayer, WmsLayer } from '@ukis/services-layers';
import { WmtsClientService } from '../wmts/wmtsclient.service';
import { of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../wmts/wmtsclient.service";
/**
 * @param {?} str
 * @return {?}
 */
export function isWmsOffering(str) {
    return str === 'http://www.opengis.net/spec/owc-geojson/1.0/req/wms'
        || str === 'http://schemas.opengis.net/wms/1.1.1'
        || str === 'http://schemas.opengis.net/wms/1.1.0';
}
/**
 * @param {?} str
 * @return {?}
 */
export function isWfsOffering(str) {
    return str === 'http://www.opengis.net/spec/owc-geojson/1.0/req/wfs';
}
/**
 * @param {?} str
 * @return {?}
 */
export function isWpsOffering(str) {
    return str === 'http://www.opengis.net/spec/owc-geojson/1.0/req/wcs';
}
/**
 * @param {?} str
 * @return {?}
 */
export function isCswOffering(str) {
    return str === 'http://www.opengis.net/spec/owc-geojson/1.0/req/csw';
}
/**
 * @param {?} str
 * @return {?}
 */
export function isWmtsOffering(str) {
    return str === 'http://www.opengis.net/spec/owc-geojson/1.0/req/wmts'
        || str === 'http://schemas.opengis.net/wmts/1.0.0'
        || str === 'http://schemas.opengis.net/wmts/1.1.0';
}
/**
 * @param {?} str
 * @return {?}
 */
export function isGmlOffering(str) {
    return str === 'http://www.opengis.net/spec/owc-geojson/1.0/req/gml';
}
/**
 * @param {?} str
 * @return {?}
 */
export function isKmlOffering(str) {
    return str === 'http://www.opengis.net/spec/owc-geojson/1.0/req/kml';
}
/**
 * @param {?} str
 * @return {?}
 */
export function isGeoTIFFOffering(str) {
    return str === 'http://www.opengis.net/spec/owc-geojson/1.0/req/geotiff';
}
/**
 * @param {?} str
 * @return {?}
 */
export function isGMLJP2Offering(str) {
    return str === 'http://www.opengis.net/spec/owc-geojson/1.0/req/gmljp2';
}
/**
 * @param {?} str
 * @return {?}
 */
export function isGMLCOVOffering(str) {
    return str === 'http://www.opengis.net/spec/owc-geojson/1.0/req/gmlcov';
}
/**
 * @param {?} str
 * @return {?}
 */
export function isXyzOffering(str) {
    return str === 'http://www.opengis.net/spec/owc-geojson/1.0/req/xyz';
}
/**
 * @param {?} str
 * @return {?}
 */
export function isGeoJsonOffering(str) {
    return str === 'http://www.opengis.net/spec/owc-geojson/1.0/req/geojson';
}
/**
 * @param {?} v
 * @return {?}
 */
export function shardsExpand(v) {
    if (!v) {
        return;
    }
    /** @type {?} */
    let o = [];
    for (let i in v.split(',')) {
        /** @type {?} */
        var j = v.split(',')[i].split("-");
        if (j.length == 1) {
            o.push(v.split(',')[i]);
        }
        else if (j.length == 2) {
            /** @type {?} */
            let start = j[0].charCodeAt(0);
            /** @type {?} */
            let end = j[1].charCodeAt(0);
            if (start <= end) {
                for (let k = start; k <= end; k++) {
                    o.push(String.fromCharCode(k).toLowerCase());
                }
            }
            else {
                for (let k = start; k >= end; k--) {
                    o.push(String.fromCharCode(k).toLowerCase());
                }
            }
        }
    }
    return o;
}
/**
 * OWS Context Service
 * OGC OWS Context Geo Encoding Standard Version: 1.0
 * http://docs.opengeospatial.org/is/14-055r2/14-055r2.html
 * http://www.owscontext.org/owc_user_guide/C0_userGuide.html
 *
 * This service allows you to read and write OWC-data.
 * We have added some custom fields to the OWC standard.
 *   - accepts the OWC-standard-datatypes as function inputs (so as to be as general as possible)
 *   - returns our extended OWC-datatypes as function outputs (so as to be as information-rich as possible)
 *
 */
export class OwcJsonService {
    /**
     * @param {?} wmtsClient
     */
    constructor(wmtsClient) {
        this.wmtsClient = wmtsClient;
        //http://www.owscontext.org/owc_user_guide/C0_userGuide.html#truegeojson-encoding-2
    }
    /**
     * @param {?} context
     * @return {?}
     */
    checkContext(context) {
        /** @type {?} */
        let isContext_1_0;
        if (!Array.isArray(context.properties.links)) {
            isContext_1_0 = context.properties.links.profiles.find((/**
             * @param {?} item
             * @return {?}
             */
            item => item === 'http://www.opengis.net/spec/owc-geojson/1.0/req/core'));
        }
        else {
            isContext_1_0 = context.properties.links.find((/**
             * @param {?} item
             * @return {?}
             */
            item => item.href === 'http://www.opengis.net/spec/owc-geojson/1.0/req/core'));
        }
        if (!isContext_1_0) {
            console.error('this is not a valid OWS Context v1.0!');
        }
        return isContext_1_0;
    }
    /**
     * @param {?} context
     * @return {?}
     */
    getContextTitle(context) {
        return context.properties.title;
    }
    /**
     * @param {?} context
     * @return {?}
     */
    getContextPublisher(context) {
        return (context.properties.publisher) ? context.properties.publisher : null;
    }
    /**
     * @param {?} context
     * @return {?}
     */
    getContextExtent(context) {
        return (context.bbox) ? context.bbox : null; // or [-180, -90, 180, 90];
    }
    /**
     * @param {?} context
     * @return {?}
     */
    getResources(context) {
        return context.features;
    }
    /**
     * Resource ---------------------------------------------------
     * @param {?} resource
     * @return {?}
     */
    getResourceTitle(resource) {
        return resource.properties.title;
    }
    /**
     * @param {?} resource
     * @return {?}
     */
    getResourceUpdated(resource) {
        return resource.properties.updated;
    }
    /**
     * @param {?} resource
     * @return {?}
     */
    getResourceDate(resource) {
        return (resource.properties.date) ? resource.properties.date : null;
    }
    /**
     * @param {?} resource
     * @return {?}
     */
    getResourceOfferings(resource) {
        return (resource.properties.offerings) ? resource.properties.offerings : null;
    }
    /**
     * retrieve layer status active / inactive based on IOwsResource
     * @param {?} resource
     * @return {?}
     */
    isActive(resource) {
        /** @type {?} */
        let active = true;
        if (resource.properties.hasOwnProperty('active')) {
            active = resource.properties.active;
        }
        return active;
    }
    /**
     * @param {?} resource
     * @return {?}
     */
    getResourceOpacity(resource) {
        /** @type {?} */
        let opacity = 1;
        if (resource.properties.hasOwnProperty('opacity')) {
            opacity = resource.properties.opacity;
        }
        return opacity;
    }
    /**
     * @param {?} resource
     * @return {?}
     */
    getResourceAttribution(resource) {
        /** @type {?} */
        let attribution = '';
        if (resource.properties.hasOwnProperty('attribution')) {
            attribution = resource.properties.attribution;
        }
        return attribution;
    }
    /**
     * @param {?} resource
     * @return {?}
     */
    getResourceShards(resource) {
        if (resource.properties.hasOwnProperty('shards')) {
            return resource.properties.shards;
        }
    }
    /**
     * @param {?} owctime
     * @return {?}
     */
    convertOwcTimeToIsoTimeAndPeriodicity(owctime) {
        /**
         * Convert from
         * @type {?}
         */
        let arr = owctime.split('/');
        /** @type {?} */
        let t = (arr.length == 3) ? arr[0] + '/' + arr[1] : owctime;
        /** @type {?} */
        let p = (arr.length == 3) ? arr[2] : null;
        if (p) {
            return { "interval": t, "periodicity": p };
        }
        else {
            return t;
        }
    }
    /**
     * @param {?} resource
     * @return {?}
     */
    getResourceDimensions(resource) {
        if (!resource.properties.hasOwnProperty('dimensions')) {
            return undefined;
        }
        /** @type {?} */
        let dims = {};
        /** @type {?} */
        let dimensions = {};
        if (Array.isArray(resource.properties.dimensions)) {
            for (let d of resource.properties.dimensions) {
                dimensions[d.name] = d;
            }
        }
        else {
            dimensions = resource.properties.dimensions;
        }
        for (let name in dimensions) {
            /** @type {?} */
            let dim = {};
            console.log(name);
            if (name === "time" || dimensions[name].units == "ISO8601") {
                /** @type {?} */
                let value = dimensions[name].value;
                /** @type {?} */
                let values = (value) ? value.split(',').map((/**
                 * @param {?} v
                 * @return {?}
                 */
                (v) => this.convertOwcTimeToIsoTimeAndPeriodicity(v))) : null;
                dim = {
                    "values": ((!values) || values.length > 1) ? values : values[0],
                    "units": dimensions[name].units,
                    "display": {
                        "format": "YYYMMDD",
                        "period": dimensions[name].display,
                        "default": "end"
                    }
                };
            }
            else if (name === "elevation") {
                dim = dimensions[name];
            }
            else {
                dim = dimensions[name];
            }
            dims[name] = dim;
        }
        return dims;
    }
    /**
     * Offering ---------------------------------------------------
     * @param {?} offering
     * @return {?}
     */
    getLayertypeFromOfferingCode(offering) {
        if (isWmsOffering(offering.code)) {
            return WmsLayertype;
        }
        else if (isWmtsOffering(offering.code)) {
            return WmtsLayertype;
        }
        else if (isWfsOffering(offering.code)) {
            return WfsLayertype;
        }
        else if (isGeoJsonOffering(offering.code)) {
            return GeojsonLayertype;
        }
        else if (isXyzOffering(offering.code)) {
            return XyzLayertype;
        }
        else {
            return offering.code; // an offering can also be any other string.
        }
    }
    /**
     * @param {?} offering
     * @return {?}
     */
    checkIfServiceOffering(offering) {
        return (!offering.contents && offering.operations) ? true : false;
    }
    /**
     * @param {?} offering
     * @return {?}
     */
    checkIfDataOffering(offering) {
        return (offering.contents && !offering.operations) ? true : false;
    }
    /**
     * @param {?} offering
     * @return {?}
     */
    getOfferingContents(offering) {
        if (this.checkIfServiceOffering(offering)) {
            return offering.operations;
        }
        else if (this.checkIfDataOffering(offering)) {
            return offering.contents;
        }
    }
    /**
     * Helper function to extract legendURL from project specific ows Context
     * @param {?} offering layer offering
     * @return {?}
     */
    getLegendUrl(offering) {
        /** @type {?} */
        let legendUrl = '';
        if (offering.hasOwnProperty('styles')) {
            /** @type {?} */
            let defaultStyle = offering.styles.filter((/**
             * @param {?} style
             * @return {?}
             */
            style => style.default));
            if (defaultStyle.length > 0) {
                return defaultStyle[0].legendURL;
            }
        }
        else if (offering.hasOwnProperty('legendUrl')) {
            legendUrl = offering.legendUrl;
        }
        return legendUrl;
    }
    /**
     * retrieve iconUrl based on IOwsOffering
     * @param {?} offering
     * @return {?}
     */
    getIconUrl(offering) {
        /** @type {?} */
        let iconUrl = '';
        if (offering.hasOwnProperty('iconUrl')) {
            iconUrl = offering.iconUrl;
        }
        return iconUrl;
    }
    /**
     * layer priority: first wms, then wmts, then wfs, then others.
     * @param {?} owc
     * @param {?} targetProjection
     * @return {?}
     */
    getLayers(owc, targetProjection) {
        /** @type {?} */
        const resources = owc.features;
        /** @type {?} */
        const layers$ = [];
        for (const resource of resources) {
            /** @type {?} */
            const offerings = resource.properties.offerings;
            if (offerings.length > 0) {
                /** @type {?} */
                const offering = offerings.find((/**
                 * @param {?} o
                 * @return {?}
                 */
                o => isWmsOffering(o.code)))
                    || offerings.find((/**
                     * @param {?} o
                     * @return {?}
                     */
                    o => isWmtsOffering(o.code)))
                    || offerings.find((/**
                     * @param {?} o
                     * @return {?}
                     */
                    o => isWfsOffering(o.code)))
                    || offerings[0];
                layers$.push(this.createLayerFromOffering(offering, resource, owc, targetProjection));
            }
        }
        return forkJoin(layers$);
    }
    /**
     * @param {?} offering
     * @param {?} resource
     * @param {?} context
     * @param {?} targetProjection
     * @return {?}
     */
    createLayerFromOffering(offering, resource, context, targetProjection) {
        /** @type {?} */
        const layerType = this.getLayertypeFromOfferingCode(offering);
        if (isRasterLayertype(layerType)) {
            return this.createRasterLayerFromOffering(offering, resource, context, targetProjection);
        }
        else if (isVectorLayertype(layerType)) {
            return this.createVectorLayerFromOffering(offering, resource, context);
        }
        else {
            console.error(`This type of service (${layerType}) has not been implemented yet.`);
        }
    }
    /**
     * @param {?} offering
     * @param {?} resource
     * @param {?=} context
     * @return {?}
     */
    createVectorLayerFromOffering(offering, resource, context) {
        /** @type {?} */
        const layerType = this.getLayertypeFromOfferingCode(offering);
        if (!isVectorLayertype(layerType)) {
            console.error(`This type of layer '${layerType}' / offering '${offering.code}' cannot be converted into a Vectorlayer`);
            return null;
        }
        /** @type {?} */
        const iconUrl = this.getIconUrl(offering);
        /** @type {?} */
        let layerUrl;
        /** @type {?} */
        let params;
        // if we have a operations-offering (vs. a data-offering):
        if (offering.operations)
            layerUrl = this.getUrlFromUri(offering.operations[0].href);
        if (offering.operations)
            params = this.getJsonFromUri(offering.operations[0].href);
        /** @type {?} */
        let data;
        // if we have a data-offering: 
        if (offering.contents) {
            data = offering.contents[0].content;
        }
        /** @type {?} */
        let legendUrl = this.getLegendUrl(offering);
        /** @type {?} */
        let layerOptions = {
            id: (/** @type {?} */ (resource.id)),
            name: this.getResourceTitle(resource),
            displayName: this.getDisplayName(offering, resource),
            visible: this.isActive(resource),
            type: layerType,
            removable: true,
            attribution: this.getResourceAttribution(resource),
            continuousWorld: false,
            opacity: this.getResourceOpacity(resource),
            url: layerUrl ? layerUrl : null,
            legendImg: legendUrl ? legendUrl : null,
            data: data
        };
        /** @type {?} */
        const layer = new VectorLayer(layerOptions);
        if (resource.bbox) {
            layer.bbox = resource.bbox;
        }
        else if (context && context.bbox) {
            layer.bbox = context.bbox;
        }
        return of(layer);
    }
    /**
     * @param {?} offering
     * @param {?} resource
     * @param {?} context
     * @param {?} targetProjection
     * @return {?}
     */
    createRasterLayerFromOffering(offering, resource, context, targetProjection) {
        /** @type {?} */
        const layerType = this.getLayertypeFromOfferingCode(offering);
        if (!isRasterLayertype(layerType)) {
            console.error(`This type of offering '${offering.code}' cannot be converted into a rasterlayer.`);
            return null;
        }
        /** @type {?} */
        let rasterLayer$;
        switch (layerType) {
            case WmsLayertype:
                rasterLayer$ = this.createWmsLayerFromOffering(offering, resource, context);
                break;
            case WmtsLayertype:
                rasterLayer$ = this.createWmtsLayerFromOffering(offering, resource, context, targetProjection);
                break;
            case XyzLayertype:
                // @TODO
                break;
            case CustomLayertype:
                // custom layers are meant to be userdefined and not easily encoded in a OWC.
                break;
        }
        return rasterLayer$;
    }
    /**
     * @private
     * @param {?} offering
     * @param {?} resource
     * @param {?} context
     * @param {?} targetProjection
     * @return {?}
     */
    createWmtsLayerFromOffering(offering, resource, context, targetProjection) {
        return this.getWmtsOptions(offering, resource, context, targetProjection).pipe(map((/**
         * @param {?} options
         * @return {?}
         */
        (options) => {
            /** @type {?} */
            const layer = new WmtsLayer(options);
            return layer;
        })));
    }
    /**
     * @private
     * @param {?} offering
     * @param {?} resource
     * @param {?} context
     * @return {?}
     */
    createWmsLayerFromOffering(offering, resource, context) {
        /** @type {?} */
        const options = this.getWmsOptions(offering, resource, context);
        /** @type {?} */
        const layer = new WmsLayer(options);
        return of(layer);
    }
    /**
     * @private
     * @param {?} offering
     * @param {?} resource
     * @param {?} context
     * @param {?} targetProjection
     * @return {?}
     */
    getWmtsOptions(offering, resource, context, targetProjection) {
        /** @type {?} */
        const rasterOptions = this.getRasterLayerOptions(offering, resource, context);
        /** @type {?} */
        const layer = this.getLayerForWMTS(offering, resource);
        /** @type {?} */
        let style;
        if (offering.styles) {
            /** @type {?} */
            const styleInfo = offering.styles.find((/**
             * @param {?} s
             * @return {?}
             */
            s => s.default));
            if (styleInfo) {
                style = styleInfo.name;
            }
        }
        return this.getMatrixSetForWMTS(offering, resource, targetProjection).pipe(map(((/**
         * @param {?} matrixSet
         * @return {?}
         */
        (matrixSet) => {
            /** @type {?} */
            const matrixSetOptions = {
                matrixSet: matrixSet.matrixSet,
                matrixIds: matrixSet.matrixIds,
                resolutions: matrixSet.resolutions
            };
            /** @type {?} */
            const wmtsOptions = Object.assign({}, rasterOptions, { type: 'wmts', params: {
                    layer: layer,
                    matrixSetOptions: matrixSetOptions,
                    projection: targetProjection,
                    style: style,
                    format: 'image/png'
                } });
            return wmtsOptions;
        }))));
    }
    /**
     * @private
     * @param {?} offering
     * @param {?} resource
     * @return {?}
     */
    getLayerForWMTS(offering, resource) {
        const [url, urlParams] = this.parseOperationUrl(offering, 'GetTile');
        if (urlParams['LAYER']) {
            return urlParams['LAYER'];
        }
        else {
            console.error(`There is no layer-parameter in the offering ${offering.code} for resource ${resource.id}.
      Cannot infer layer.`, offering);
        }
    }
    /**
     * @private
     * @param {?} offering
     * @param {?} opCode
     * @return {?}
     */
    parseOperationUrl(offering, opCode) {
        if (offering.operations) {
            /** @type {?} */
            const operation = offering.operations.find((/**
             * @param {?} op
             * @return {?}
             */
            op => op.code === opCode));
            if (operation) {
                /** @type {?} */
                const url = this.getUrlFromUri(operation.href);
                /** @type {?} */
                const urlParams = this.getJsonFromUri(operation.href);
                return [url, urlParams];
            }
            else {
                console.error(`There is no ${opCode}-operation in the offering ${offering.code}.`, offering);
            }
        }
        else {
            console.error(`The offering ${offering.code} has no operations.`, offering);
        }
    }
    /**
     * @private
     * @param {?} offering
     * @param {?} resource
     * @param {?} targetProjection
     * @return {?}
     */
    getMatrixSetForWMTS(offering, resource, targetProjection) {
        if (offering.matrixSets) {
            /** @type {?} */
            const matrixSet = offering.matrixSets.find((/**
             * @param {?} m
             * @return {?}
             */
            m => m.srs === targetProjection));
            return of(matrixSet);
        }
        else {
            const [url, urlParams] = this.parseOperationUrl(offering, 'GetCapabilities');
            return this.wmtsClient.getCapabilities(url).pipe(map((/**
             * @param {?} capabilities
             * @return {?}
             */
            (capabilities) => {
                /** @type {?} */
                const matrixSets = capabilities['value']['contents']['tileMatrixSet'];
                /** @type {?} */
                const matrixSet = matrixSets.find((/**
                 * @param {?} ms
                 * @return {?}
                 */
                ms => ms['identifier']['value'] === targetProjection));
                /** @type {?} */
                const owsMatrixSet = {
                    srs: targetProjection,
                    matrixSet: matrixSet['identifier']['value'],
                    matrixIds: matrixSet['tileMatrix'].map((/**
                     * @param {?} tm
                     * @return {?}
                     */
                    tm => tm['identifier']['value'])),
                    resolutions: matrixSet['tileMatrix'].map((/**
                     * @param {?} tm
                     * @return {?}
                     */
                    tm => tm['scaleDenominator'])),
                    origin: {
                        x: matrixSet['tileMatrix'][0]['topLeftCorner'][1],
                        y: matrixSet['tileMatrix'][0]['topLeftCorner'][0]
                    },
                    tilesize: matrixSet['tileMatrix'][0]['tileHeight']
                };
                return owsMatrixSet;
            })));
        }
    }
    /**
     * @private
     * @param {?} offering
     * @param {?} resource
     * @param {?} context
     * @return {?}
     */
    getWmsOptions(offering, resource, context) {
        /** @type {?} */
        const rasterOptions = this.getRasterLayerOptions(offering, resource, context);
        if (rasterOptions.type === WmsLayertype) {
            /** @type {?} */
            const urlParams = this.getJsonFromUri(offering.operations[0].href);
            /** @type {?} */
            let defaultStyle;
            if (offering.styles) {
                defaultStyle = offering.styles.find((/**
                 * @param {?} s
                 * @return {?}
                 */
                s => s.default)).name;
            }
            /** @type {?} */
            const params = {
                LAYERS: urlParams['LAYERS'],
                FORMAT: urlParams['FORMAT'],
                TIME: urlParams['TIME'],
                VERSION: urlParams['VERSION'],
                TILED: urlParams['TILED'],
                TRANSPARENT: true,
                STYLES: defaultStyle
            };
            /** @type {?} */
            const wmsOptions = Object.assign({}, rasterOptions, { type: 'wms', params: params });
            return wmsOptions;
        }
        else {
            console.error(`resource ${resource.id} cannot be converted into a WMS-Layer`, offering);
        }
    }
    /**
     * @private
     * @param {?} offering
     * @param {?} resource
     * @param {?} context
     * @return {?}
     */
    getRasterLayerOptions(offering, resource, context) {
        /** @type {?} */
        const layerOptions = this.getLayerOptions(offering, resource, context);
        if (isRasterLayertype(layerOptions.type)) {
            /** @type {?} */
            const rasterLayerOptions = Object.assign({}, layerOptions, { type: (/** @type {?} */ (layerOptions.type)), url: this.getUrlFromUri(offering.operations[0].href), subdomains: shardsExpand(this.getResourceShards(resource)) });
            return rasterLayerOptions;
        }
        else {
            console.error(`The layer ${layerOptions.id} is not a rasterlayer`, layerOptions);
        }
    }
    /**
     * @private
     * @param {?} offering
     * @param {?} resource
     * @param {?} context
     * @return {?}
     */
    getLayerOptions(offering, resource, context) {
        /** @type {?} */
        const layerOptions = {
            id: (/** @type {?} */ (resource.id)),
            type: this.getLayertypeFromOfferingCode(offering),
            name: this.getResourceTitle(resource),
            removable: true,
            continuousWorld: false,
            opacity: this.getResourceOpacity(resource),
            displayName: this.getDisplayName(offering, resource),
            visible: this.isActive(resource),
            attribution: this.getResourceAttribution(resource),
            dimensions: this.getResourceDimensions(resource),
            legendImg: this.getLegendUrl(offering),
            styles: offering.styles
        };
        if (resource.bbox) {
            layerOptions.bbox = resource.bbox;
        }
        else if (context && context.bbox) {
            layerOptions.bbox = context.bbox;
        }
        return layerOptions;
    }
    /**
     * Misc ---------------------------------------------------
     * @private
     * @param {?} uri
     * @return {?}
     */
    getUrlFromUri(uri) {
        return uri.substring(0, uri.indexOf('?'));
    }
    /**
     * helper to pack query-parameters of a uri into a JSON
     * @private
     * @param {?} uri any uri with query-parameters
     * @return {?}
     */
    getJsonFromUri(uri) {
        /** @type {?} */
        const query = uri.substr(uri.lastIndexOf('?') + 1);
        /** @type {?} */
        const result = {};
        query.split('&').forEach((/**
         * @param {?} part
         * @return {?}
         */
        function (part) {
            /** @type {?} */
            const item = part.split('=');
            result[item[0].toUpperCase()] = decodeURIComponent(item[1]);
        }));
        return result;
    }
    /**
     * retrieve display name of layer, based on IOwsResource and IOwsOffering
     * @private
     * @param {?} offering
     * @param {?} resource
     * @return {?}
     */
    getDisplayName(offering, resource) {
        /** @type {?} */
        let displayName = '';
        if (offering.hasOwnProperty('title')) {
            if (offering.title) {
                displayName = offering.title;
            }
            else {
                displayName = this.getResourceTitle(resource);
            }
        }
        return displayName;
    }
    /**------------ DATA TO FILE -----------------------------------------*/
    /**
     * \@TODO:
     *   - properties
     * @param {?} id
     * @param {?} layers
     * @param {?=} extent
     * @param {?=} properties
     * @return {?}
     */
    generateOwsContextFrom(id, layers, extent, properties) {
        if (!properties) {
            properties = {
                lang: '',
                links: [],
                title: '',
                updated: ''
            };
        }
        /** @type {?} */
        let owc = {
            'id': id,
            'type': 'FeatureCollection',
            'properties': properties,
            'features': []
        };
        if (extent) {
            owc['bbox'] = extent;
        }
        for (let layer of layers) {
            /** @type {?} */
            let resource = this.generateResourceFromLayer(layer);
            // TODO check for layer types
            owc.features.push(resource);
        }
        return owc;
    }
    /**
     * @param {?} layer
     * @return {?}
     */
    generateResourceFromLayer(layer) {
        /** @type {?} */
        let resource = {
            'id': layer.id,
            'properties': {
                title: layer.name,
                updated: null,
                offerings: [this.generateOfferingFromLayer(layer)],
                opacity: layer.opacity,
                attribution: layer.attribution,
            },
            'type': 'Feature',
            'geometry': null
        };
        return resource;
    }
    /**
     * @param {?} layer
     * @param {?=} legendUrl
     * @param {?=} iconUrl
     * @return {?}
     */
    generateOfferingFromLayer(layer, legendUrl, iconUrl) {
        /** @type {?} */
        let offering = {
            'code': this.getOfferingCodeFromLayer(layer),
            'title': layer.name
        };
        if (layer.type == GeojsonLayertype) {
            offering.contents = this.getContentsFromLayer((/** @type {?} */ (layer)));
        }
        else {
            offering.operations = this.getOperationsFromLayer(layer);
        }
        if (legendUrl)
            offering.legendUrl = legendUrl;
        if (iconUrl)
            offering.iconUrl = iconUrl;
        return offering;
    }
    /**
     * @param {?} layer
     * @return {?}
     */
    getOfferingCodeFromLayer(layer) {
        switch (layer.type) {
            case WmsLayertype:
                return 'http://www.opengis.net/spec/owc-geojson/1.0/req/wms';
            case WmtsLayertype:
                return 'http://www.opengis.net/spec/owc-geojson/1.0/req/wmts';
            case GeojsonLayertype:
                return 'http://www.opengis.net/spec/owc-geojson/1.0/req/geojson';
            case XyzLayertype:
                return 'http://www.opengis.net/spec/owc-geojson/1.0/req/xyz';
            default:
                console.error(`This type of layer (${layer.type}) has not been implemented yet.`);
                return null;
        }
    }
    /**
     * @param {?} layer
     * @return {?}
     */
    getContentsFromLayer(layer) {
        /** @type {?} */
        let contents = [];
        switch (layer.type) {
            case GeojsonLayertype:
                /** @type {?} */
                let content = {
                    type: 'FeatureCollection',
                    content: JSON.stringify(layer.data)
                };
                contents.push(content);
                break;
            default:
                console.error(`Cannot get contents for this type of vectorlayer: (${layer.type})`);
        }
        return contents;
    }
    /**
     * @param {?} layer
     * @return {?}
     */
    getOperationsFromLayer(layer) {
        if (layer instanceof RasterLayer) {
            switch (layer.type) {
                case WmsLayertype:
                    return this.getWmsOperationsFromLayer(layer);
                case WmtsLayertype:
                    return this.getWmtsOperationsFromLayer(layer);
                case XyzLayertype:
                    return this.getXyzOperationsFromLayer(layer);
                default:
                    console.error(`Cannot get operations for this type of layer: (${layer.type})`);
                    return [];
            }
        }
        else if (layer instanceof VectorLayer) {
            switch (layer.type) {
                // case 'wfs': <--- this type of layer has not been implemented yet in datatypes-layers/Layers.ts 
                //   return this.getWfsOperationsFromLayer(layer);
                default:
                    console.error(`This type of service (${layer.type}) has not been implemented yet.`);
                    return [];
            }
        }
    }
    /**
     * @param {?} layer
     * @return {?}
     */
    getXyzOperationsFromLayer(layer) {
        /** @type {?} */
        let restCall = {
            'code': 'REST',
            'method': 'GET',
            'type': 'text/html',
            'href': `${layer.url}`
        };
        /** @type {?} */
        let operations = [
            restCall
        ];
        return operations;
    }
    /**
     * @param {?} layer
     * @return {?}
     */
    getTmsOperationsFromLayer(layer) {
        // @TODO: what operations are defined on TMS? https://wiki.osgeo.org/wiki/Tile_Map_Service_Specification
        return [];
    }
    /**
     * @param {?} layer
     * @return {?}
     */
    getWfsOperationsFromLayer(layer) {
        /** @type {?} */
        let url = layer.url;
        /** @type {?} */
        let layerName = layer.name;
        /** @type {?} */
        let version = layer.options.version ? layer.options.version : '1.1.0';
        /** @type {?} */
        let GetFeature = {
            'code': 'GetFeature',
            'method': 'GET',
            'type': 'application/json',
            'href': `${url}?service=WFS&version=${version}&request=GetFeature`
        };
        // let DescribeFeatureType: IOwsOperation = null;
        // let GetCapabilities: IOwsOperation = null;
        // let GetPropertyValue: IOwsOperation = null;
        // let GetFeatureWithLock: IOwsOperation = null;
        // let LockFeature: IOwsOperation = null;
        // let Transaction: IOwsOperation = null;
        // let CreateStoredQuery: IOwsOperation = null;
        // let DropStoredQuery: IOwsOperation = null;
        // let ListStoredQueries: IOwsOperation = null;
        // let DescribeStoredQueries: IOwsOperation = null;
        /** @type {?} */
        let operations = [
            GetFeature,
        ];
        return operations;
    }
    /**
     * @param {?} layer
     * @return {?}
     */
    getWmsOperationsFromLayer(layer) {
        /** @type {?} */
        let url = layer.url;
        /** @type {?} */
        let wmsVersion = layer.params.VERSION;
        /** @type {?} */
        let layerName = layer.name;
        /** @type {?} */
        let layerId = layer.id;
        /** @type {?} */
        let format = 'image/vnd.jpeg-png';
        if (layer.params && layer.params.FORMAT)
            format = layer.params.FORMAT;
        /** @type {?} */
        let getMap = {
            'code': 'GetMap',
            'method': 'GET',
            'type': format,
            'href': `${url}?service=WMS&version=${wmsVersion}&request=GetMap&TRANSPARENT=TRUE&LAYERS=${layerId}&FORMAT=${format}&TILED=true`
        };
        /** @type {?} */
        let getCapabilities = {
            'code': 'GetCapabilities',
            'method': 'GET',
            'type': 'application/xml',
            'href': `${url}?service=WMS&version=${wmsVersion}&request=GetCapabilities`
        };
        /** @type {?} */
        let getFeatureInfo = {
            'code': 'GetFeatureInfo',
            'method': 'GET',
            'type': 'text/html',
            'href': `${url}?service=WMS&version=${wmsVersion}&request=GetFeatureInfo&TRANSPARENT=TRUE&LAYERS=${layerId}&FORMAT=${format}`
        };
        /** @type {?} */
        let operations = [
            getMap,
            getCapabilities,
            getFeatureInfo
        ];
        return operations;
    }
    /**
     * @param {?} layer
     * @return {?}
     */
    getWmtsOperationsFromLayer(layer) {
        /** @type {?} */
        let url = layer.url;
        /** @type {?} */
        let wmtsVersion = layer.params.version;
        /** @type {?} */
        let layerName = layer.name;
        /** @type {?} */
        let layerId = layer.id;
        /** @type {?} */
        let format = 'image/vnd.jpeg-png';
        if (layer.params && layer.params.FORMAT)
            format = layer.params.FORMAT;
        /** @type {?} */
        let getTile = {
            'code': 'GetTile',
            'href': `${url}?SERVICE=WMTS&REQUEST=GetTile&FORMAT=${format}&LAYER=${layerId}&VERSION=${wmtsVersion}`,
            'method': 'GET',
            'type': format
        };
        /** @type {?} */
        let getCapabilities = {
            'code': 'GetCapabilities',
            'href': `${url}?SERVICE=WMTS&REQUEST=GetCapabilities&VERSION=${wmtsVersion}`,
            'method': 'GET',
            'type': 'application/xml'
        }
        // Note: we deliberately use the WMS protocol here instead of WMTS.
        // Reason: WMTS delivers RGB-values, wheras WMS delivers the actual value that was used to create a tile.
        ;
        // Note: we deliberately use the WMS protocol here instead of WMTS.
        // Reason: WMTS delivers RGB-values, wheras WMS delivers the actual value that was used to create a tile.
        /** @type {?} */
        let getFeatureInfo = {
            'code': 'GetFeatureInfo',
            'href': `${url}?SERVICE=WMS&REQUEST=GetFeatureInfo&VERSION=${wmtsVersion}`,
            'method': 'GET',
            'type': 'text/html'
        };
        /** @type {?} */
        let operations = [
            getTile,
            getCapabilities,
            getFeatureInfo
        ];
        return operations;
    }
}
OwcJsonService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
OwcJsonService.ctorParameters = () => [
    { type: WmtsClientService }
];
/** @nocollapse */ OwcJsonService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function OwcJsonService_Factory() { return new OwcJsonService(i0.ɵɵinject(i1.WmtsClientService)); }, token: OwcJsonService, providedIn: "root" });
if (false) {
    /**
     * @type {?}
     * @private
     */
    OwcJsonService.prototype.wmtsClient;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3djLWpzb24uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0B1a2lzL3NlcnZpY2VzLW9nYy8iLCJzb3VyY2VzIjpbImxpYi9vd2Mvb3djLWpzb24uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFTM0MsT0FBTyxFQUNtRCxXQUFXLEVBQUUsV0FBVyxFQUM3RCxZQUFZLEVBQUUsYUFBYSxFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBZSxlQUFlLEVBQUUsWUFBWSxFQUN4RyxpQkFBaUIsRUFBRSxpQkFBaUIsRUFHdEQsU0FBUyxFQUVULFFBQVEsRUFJVCxNQUFNLHVCQUF1QixDQUFDO0FBRS9CLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQy9ELE9BQU8sRUFBRSxFQUFFLEVBQWMsUUFBUSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2hELE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7OztBQUtyQyxNQUFNLFVBQVUsYUFBYSxDQUFDLEdBQVc7SUFDdkMsT0FBTyxHQUFHLEtBQUsscURBQXFEO1dBQy9ELEdBQUcsS0FBSyxzQ0FBc0M7V0FDOUMsR0FBRyxLQUFLLHNDQUFzQyxDQUFDO0FBQ3RELENBQUM7Ozs7O0FBQ0QsTUFBTSxVQUFVLGFBQWEsQ0FBQyxHQUFXO0lBQ3ZDLE9BQU8sR0FBRyxLQUFLLHFEQUFxRCxDQUFDO0FBQ3ZFLENBQUM7Ozs7O0FBQ0QsTUFBTSxVQUFVLGFBQWEsQ0FBQyxHQUFXO0lBQ3ZDLE9BQU8sR0FBRyxLQUFLLHFEQUFxRCxDQUFDO0FBQ3ZFLENBQUM7Ozs7O0FBQ0QsTUFBTSxVQUFVLGFBQWEsQ0FBQyxHQUFXO0lBQ3ZDLE9BQU8sR0FBRyxLQUFLLHFEQUFxRCxDQUFDO0FBQ3ZFLENBQUM7Ozs7O0FBQ0QsTUFBTSxVQUFVLGNBQWMsQ0FBQyxHQUFXO0lBQ3hDLE9BQU8s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O1lBdnlCRixVQUFVLFNBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkI7Ozs7WUFyRlEsaUJBQWlCOzs7Ozs7OztJQXdGWixvQ0FBcUMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge1xyXG4gIElPd3NDb250ZXh0LCBJT3dzUmVzb3VyY2UsIElPd3NPZmZlcmluZywgSU93c09wZXJhdGlvbiwgSU93c0NvbnRlbnQsIFdNU19PZmZlcmluZywgV0ZTX09mZmVyaW5nLCBXQ1NfT2ZmZXJpbmcsXHJcbiAgQ1NXX09mZmVyaW5nLCBXTVRTX09mZmVyaW5nLCBHTUxfT2ZmZXJpbmcsIEtNTF9PZmZlcmluZywgR2VvVElGRl9PZmZlcmluZywgR01MSlAyX09mZmVyaW5nLCBHTUxDT1ZfT2ZmZXJpbmdcclxufSBmcm9tICcuL3R5cGVzL293Yy1qc29uJztcclxuaW1wb3J0IHtcclxuICBJRW9jT3dzQ29udGV4dCwgSUVvY093c1Jlc291cmNlLCBJRW9jT3dzT2ZmZXJpbmcsIEdlb0pzb25fT2ZmZXJpbmcsIFh5el9PZmZlcmluZywgSUVvY093c1dtdHNPZmZlcmluZyxcclxuICBJRW9jV21zT2ZmZXJpbmcsIElFb2NPd3NSZXNvdXJjZURpbWVuc2lvbiwgSUVvY093c1dtdHNNYXRyaXhTZXRcclxufSBmcm9tICcuL3R5cGVzL2VvYy1vd2MtanNvbic7XHJcbmltcG9ydCB7XHJcbiAgSUxheWVyR3JvdXBPcHRpb25zLCBJTGF5ZXJPcHRpb25zLCBJUmFzdGVyTGF5ZXJPcHRpb25zLCBWZWN0b3JMYXllciwgUmFzdGVyTGF5ZXIsIElWZWN0b3JMYXllck9wdGlvbnMsXHJcbiAgTGF5ZXIsIFRMYXllcnR5cGUsIFdtc0xheWVydHlwZSwgV210c0xheWVydHlwZSwgV2ZzTGF5ZXJ0eXBlLCBHZW9qc29uTGF5ZXJ0eXBlLCBDdXN0b21MYXllciwgQ3VzdG9tTGF5ZXJ0eXBlLCBYeXpMYXllcnR5cGUsXHJcbiAgVFJhc3RlckxheWVydHlwZSwgaXNSYXN0ZXJMYXllcnR5cGUsIGlzVmVjdG9yTGF5ZXJ0eXBlLCBUVmVjdG9yTGF5ZXJ0eXBlLCBJTGF5ZXJEaW1lbnNpb25zLFxyXG4gIElMYXllckludGVydmFsQW5kUGVyaW9kLFxyXG4gIElXbXRzUGFyYW1zLFxyXG4gIFdtdHNMYXllcixcclxuICBJV210c09wdGlvbnMsXHJcbiAgV21zTGF5ZXIsXHJcbiAgSVdtc1BhcmFtcyxcclxuICBJV21zT3B0aW9ucyxcclxuICBJTGlzdE1hdHJpeFNldFxyXG59IGZyb20gJ0B1a2lzL3NlcnZpY2VzLWxheWVycyc7XHJcbmltcG9ydCB7IFRHZW9FeHRlbnQgfSBmcm9tICdAdWtpcy9zZXJ2aWNlcy1tYXAtc3RhdGUnO1xyXG5pbXBvcnQgeyBXbXRzQ2xpZW50U2VydmljZSB9IGZyb20gJy4uL3dtdHMvd210c2NsaWVudC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgb2YsIE9ic2VydmFibGUsIGZvcmtKb2luIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1dtc09mZmVyaW5nKHN0cjogc3RyaW5nKTogc3RyIGlzIFdNU19PZmZlcmluZyB7XHJcbiAgcmV0dXJuIHN0ciA9PT0gJ2h0dHA6Ly93d3cub3Blbmdpcy5uZXQvc3BlYy9vd2MtZ2VvanNvbi8xLjAvcmVxL3dtcydcclxuICAgIHx8IHN0ciA9PT0gJ2h0dHA6Ly9zY2hlbWFzLm9wZW5naXMubmV0L3dtcy8xLjEuMSdcclxuICAgIHx8IHN0ciA9PT0gJ2h0dHA6Ly9zY2hlbWFzLm9wZW5naXMubmV0L3dtcy8xLjEuMCc7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGlzV2ZzT2ZmZXJpbmcoc3RyOiBzdHJpbmcpOiBzdHIgaXMgV0ZTX09mZmVyaW5nIHtcclxuICByZXR1cm4gc3RyID09PSAnaHR0cDovL3d3dy5vcGVuZ2lzLm5ldC9zcGVjL293Yy1nZW9qc29uLzEuMC9yZXEvd2ZzJztcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gaXNXcHNPZmZlcmluZyhzdHI6IHN0cmluZyk6IHN0ciBpcyBXQ1NfT2ZmZXJpbmcge1xyXG4gIHJldHVybiBzdHIgPT09ICdodHRwOi8vd3d3Lm9wZW5naXMubmV0L3NwZWMvb3djLWdlb2pzb24vMS4wL3JlcS93Y3MnO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBpc0Nzd09mZmVyaW5nKHN0cjogc3RyaW5nKTogc3RyIGlzIENTV19PZmZlcmluZyB7XHJcbiAgcmV0dXJuIHN0ciA9PT0gJ2h0dHA6Ly93d3cub3Blbmdpcy5uZXQvc3BlYy9vd2MtZ2VvanNvbi8xLjAvcmVxL2Nzdyc7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGlzV210c09mZmVyaW5nKHN0cjogc3RyaW5nKTogc3RyIGlzIFdNVFNfT2ZmZXJpbmcge1xyXG4gIHJldHVybiBzdHIgPT09ICdodHRwOi8vd3d3Lm9wZW5naXMubmV0L3NwZWMvb3djLWdlb2pzb24vMS4wL3JlcS93bXRzJ1xyXG4gICAgfHwgc3RyID09PSAnaHR0cDovL3NjaGVtYXMub3Blbmdpcy5uZXQvd210cy8xLjAuMCdcclxuICAgIHx8IHN0ciA9PT0gJ2h0dHA6Ly9zY2hlbWFzLm9wZW5naXMubmV0L3dtdHMvMS4xLjAnO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBpc0dtbE9mZmVyaW5nKHN0cjogc3RyaW5nKTogc3RyIGlzIEdNTF9PZmZlcmluZyB7XHJcbiAgcmV0dXJuIHN0ciA9PT0gJ2h0dHA6Ly93d3cub3Blbmdpcy5uZXQvc3BlYy9vd2MtZ2VvanNvbi8xLjAvcmVxL2dtbCc7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGlzS21sT2ZmZXJpbmcoc3RyOiBzdHJpbmcpOiBzdHIgaXMgS01MX09mZmVyaW5nIHtcclxuICByZXR1cm4gc3RyID09PSAnaHR0cDovL3d3dy5vcGVuZ2lzLm5ldC9zcGVjL293Yy1nZW9qc29uLzEuMC9yZXEva21sJztcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gaXNHZW9USUZGT2ZmZXJpbmcoc3RyOiBzdHJpbmcpOiBzdHIgaXMgR2VvVElGRl9PZmZlcmluZyB7XHJcbiAgcmV0dXJuIHN0ciA9PT0gJ2h0dHA6Ly93d3cub3Blbmdpcy5uZXQvc3BlYy9vd2MtZ2VvanNvbi8xLjAvcmVxL2dlb3RpZmYnO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBpc0dNTEpQMk9mZmVyaW5nKHN0cjogc3RyaW5nKTogc3RyIGlzIEdNTEpQMl9PZmZlcmluZyB7XHJcbiAgcmV0dXJuIHN0ciA9PT0gJ2h0dHA6Ly93d3cub3Blbmdpcy5uZXQvc3BlYy9vd2MtZ2VvanNvbi8xLjAvcmVxL2dtbGpwMic7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGlzR01MQ09WT2ZmZXJpbmcoc3RyOiBzdHJpbmcpOiBzdHIgaXMgR01MQ09WX09mZmVyaW5nIHtcclxuICByZXR1cm4gc3RyID09PSAnaHR0cDovL3d3dy5vcGVuZ2lzLm5ldC9zcGVjL293Yy1nZW9qc29uLzEuMC9yZXEvZ21sY292JztcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gaXNYeXpPZmZlcmluZyhzdHI6IHN0cmluZyk6IHN0ciBpcyBYeXpfT2ZmZXJpbmcge1xyXG4gIHJldHVybiBzdHIgPT09ICdodHRwOi8vd3d3Lm9wZW5naXMubmV0L3NwZWMvb3djLWdlb2pzb24vMS4wL3JlcS94eXonO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBpc0dlb0pzb25PZmZlcmluZyhzdHI6IHN0cmluZyk6IHN0ciBpcyBHZW9Kc29uX09mZmVyaW5nIHtcclxuICByZXR1cm4gc3RyID09PSAnaHR0cDovL3d3dy5vcGVuZ2lzLm5ldC9zcGVjL293Yy1nZW9qc29uLzEuMC9yZXEvZ2VvanNvbic7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHNoYXJkc0V4cGFuZCh2OiBzdHJpbmcpIHtcclxuICBpZiAoIXYpIHsgcmV0dXJuOyB9XHJcbiAgbGV0IG8gPSBbXVxyXG4gIGZvciAobGV0IGkgaW4gdi5zcGxpdCgnLCcpKSB7XHJcbiAgICB2YXIgaiA9IHYuc3BsaXQoJywnKVtpXS5zcGxpdChcIi1cIilcclxuICAgIGlmIChqLmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgIG8ucHVzaCh2LnNwbGl0KCcsJylbaV0pXHJcbiAgICB9IGVsc2UgaWYgKGoubGVuZ3RoID09IDIpIHtcclxuICAgICAgbGV0IHN0YXJ0ID0galswXS5jaGFyQ29kZUF0KDApXHJcbiAgICAgIGxldCBlbmQgPSBqWzFdLmNoYXJDb2RlQXQoMClcclxuICAgICAgaWYgKHN0YXJ0IDw9IGVuZCkge1xyXG4gICAgICAgIGZvciAobGV0IGsgPSBzdGFydDsgayA8PSBlbmQ7IGsrKykge1xyXG4gICAgICAgICAgby5wdXNoKFN0cmluZy5mcm9tQ2hhckNvZGUoaykudG9Mb3dlckNhc2UoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZvciAobGV0IGsgPSBzdGFydDsgayA+PSBlbmQ7IGstLSkge1xyXG4gICAgICAgICAgby5wdXNoKFN0cmluZy5mcm9tQ2hhckNvZGUoaykudG9Mb3dlckNhc2UoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBvXHJcbn1cclxuLyoqXHJcbiAqIE9XUyBDb250ZXh0IFNlcnZpY2VcclxuICogT0dDIE9XUyBDb250ZXh0IEdlbyBFbmNvZGluZyBTdGFuZGFyZCBWZXJzaW9uOiAxLjBcclxuICogaHR0cDovL2RvY3Mub3Blbmdlb3NwYXRpYWwub3JnL2lzLzE0LTA1NXIyLzE0LTA1NXIyLmh0bWxcclxuICogaHR0cDovL3d3dy5vd3Njb250ZXh0Lm9yZy9vd2NfdXNlcl9ndWlkZS9DMF91c2VyR3VpZGUuaHRtbFxyXG4gKlxyXG4gKiBUaGlzIHNlcnZpY2UgYWxsb3dzIHlvdSB0byByZWFkIGFuZCB3cml0ZSBPV0MtZGF0YS5cclxuICogV2UgaGF2ZSBhZGRlZCBzb21lIGN1c3RvbSBmaWVsZHMgdG8gdGhlIE9XQyBzdGFuZGFyZC5cclxuICogICAtIGFjY2VwdHMgdGhlIE9XQy1zdGFuZGFyZC1kYXRhdHlwZXMgYXMgZnVuY3Rpb24gaW5wdXRzIChzbyBhcyB0byBiZSBhcyBnZW5lcmFsIGFzIHBvc3NpYmxlKVxyXG4gKiAgIC0gcmV0dXJucyBvdXIgZXh0ZW5kZWQgT1dDLWRhdGF0eXBlcyBhcyBmdW5jdGlvbiBvdXRwdXRzIChzbyBhcyB0byBiZSBhcyBpbmZvcm1hdGlvbi1yaWNoIGFzIHBvc3NpYmxlKVxyXG4gKlxyXG4gKi9cclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIE93Y0pzb25TZXJ2aWNlIHtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSB3bXRzQ2xpZW50OiBXbXRzQ2xpZW50U2VydmljZSkge1xyXG4gICAgLy9odHRwOi8vd3d3Lm93c2NvbnRleHQub3JnL293Y191c2VyX2d1aWRlL0MwX3VzZXJHdWlkZS5odG1sI3RydWVnZW9qc29uLWVuY29kaW5nLTJcclxuICB9XHJcblxyXG5cclxuICBjaGVja0NvbnRleHQoY29udGV4dDogSU93c0NvbnRleHQpIHtcclxuICAgIGxldCBpc0NvbnRleHRfMV8wO1xyXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGNvbnRleHQucHJvcGVydGllcy5saW5rcykpIHtcclxuICAgICAgaXNDb250ZXh0XzFfMCA9IGNvbnRleHQucHJvcGVydGllcy5saW5rcy5wcm9maWxlcy5maW5kKGl0ZW0gPT4gaXRlbSA9PT0gJ2h0dHA6Ly93d3cub3Blbmdpcy5uZXQvc3BlYy9vd2MtZ2VvanNvbi8xLjAvcmVxL2NvcmUnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlzQ29udGV4dF8xXzAgPSBjb250ZXh0LnByb3BlcnRpZXMubGlua3MuZmluZChpdGVtID0+IGl0ZW0uaHJlZiA9PT0gJ2h0dHA6Ly93d3cub3Blbmdpcy5uZXQvc3BlYy9vd2MtZ2VvanNvbi8xLjAvcmVxL2NvcmUnKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIWlzQ29udGV4dF8xXzApIHtcclxuICAgICAgY29uc29sZS5lcnJvcigndGhpcyBpcyBub3QgYSB2YWxpZCBPV1MgQ29udGV4dCB2MS4wIScpO1xyXG5cclxuICAgIH1cclxuICAgIHJldHVybiBpc0NvbnRleHRfMV8wO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q29udGV4dFRpdGxlKGNvbnRleHQ6IElPd3NDb250ZXh0KSB7XHJcbiAgICByZXR1cm4gY29udGV4dC5wcm9wZXJ0aWVzLnRpdGxlO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q29udGV4dFB1Ymxpc2hlcihjb250ZXh0OiBJT3dzQ29udGV4dCkge1xyXG4gICAgcmV0dXJuIChjb250ZXh0LnByb3BlcnRpZXMucHVibGlzaGVyKSA/IGNvbnRleHQucHJvcGVydGllcy5wdWJsaXNoZXIgOiBudWxsO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q29udGV4dEV4dGVudChjb250ZXh0OiBJT3dzQ29udGV4dCkge1xyXG4gICAgcmV0dXJuIChjb250ZXh0LmJib3gpID8gY29udGV4dC5iYm94IDogbnVsbDsgLy8gb3IgWy0xODAsIC05MCwgMTgwLCA5MF07XHJcbiAgfVxyXG5cclxuXHJcbiAgZ2V0UmVzb3VyY2VzKGNvbnRleHQ6IElPd3NDb250ZXh0KSB7XHJcbiAgICByZXR1cm4gY29udGV4dC5mZWF0dXJlcztcclxuICB9XHJcblxyXG4gIC8qKiBSZXNvdXJjZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuICBnZXRSZXNvdXJjZVRpdGxlKHJlc291cmNlOiBJT3dzUmVzb3VyY2UpIHtcclxuICAgIHJldHVybiByZXNvdXJjZS5wcm9wZXJ0aWVzLnRpdGxlO1xyXG4gIH1cclxuXHJcbiAgZ2V0UmVzb3VyY2VVcGRhdGVkKHJlc291cmNlOiBJT3dzUmVzb3VyY2UpIHtcclxuICAgIHJldHVybiByZXNvdXJjZS5wcm9wZXJ0aWVzLnVwZGF0ZWQ7XHJcbiAgfVxyXG5cclxuICBnZXRSZXNvdXJjZURhdGUocmVzb3VyY2U6IElPd3NSZXNvdXJjZSkge1xyXG4gICAgcmV0dXJuIChyZXNvdXJjZS5wcm9wZXJ0aWVzLmRhdGUpID8gcmVzb3VyY2UucHJvcGVydGllcy5kYXRlIDogbnVsbDtcclxuICB9XHJcblxyXG4gIGdldFJlc291cmNlT2ZmZXJpbmdzKHJlc291cmNlOiBJT3dzUmVzb3VyY2UpIHtcclxuICAgIHJldHVybiAocmVzb3VyY2UucHJvcGVydGllcy5vZmZlcmluZ3MpID8gcmVzb3VyY2UucHJvcGVydGllcy5vZmZlcmluZ3MgOiBudWxsO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogcmV0cmlldmUgbGF5ZXIgc3RhdHVzIGFjdGl2ZSAvIGluYWN0aXZlIGJhc2VkIG9uIElPd3NSZXNvdXJjZVxyXG4gICAqIEBwYXJhbSByZXNvdXJjZTogSU93c1Jlc291cmNlXHJcbiAgICovXHJcbiAgaXNBY3RpdmUocmVzb3VyY2U6IElPd3NSZXNvdXJjZSkge1xyXG4gICAgbGV0IGFjdGl2ZSA9IHRydWU7XHJcbiAgICBpZiAocmVzb3VyY2UucHJvcGVydGllcy5oYXNPd25Qcm9wZXJ0eSgnYWN0aXZlJykpIHtcclxuICAgICAgYWN0aXZlID0gcmVzb3VyY2UucHJvcGVydGllcy5hY3RpdmU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYWN0aXZlO1xyXG4gIH1cclxuXHJcbiAgZ2V0UmVzb3VyY2VPcGFjaXR5KHJlc291cmNlOiBJT3dzUmVzb3VyY2UpOiBudW1iZXIge1xyXG4gICAgbGV0IG9wYWNpdHkgPSAxO1xyXG4gICAgaWYgKHJlc291cmNlLnByb3BlcnRpZXMuaGFzT3duUHJvcGVydHkoJ29wYWNpdHknKSkge1xyXG4gICAgICBvcGFjaXR5ID0gcmVzb3VyY2UucHJvcGVydGllcy5vcGFjaXR5O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG9wYWNpdHk7XHJcbiAgfVxyXG5cclxuICBnZXRSZXNvdXJjZUF0dHJpYnV0aW9uKHJlc291cmNlOiBJT3dzUmVzb3VyY2UpOiBzdHJpbmcge1xyXG4gICAgbGV0IGF0dHJpYnV0aW9uID0gJyc7XHJcbiAgICBpZiAocmVzb3VyY2UucHJvcGVydGllcy5oYXNPd25Qcm9wZXJ0eSgnYXR0cmlidXRpb24nKSkge1xyXG4gICAgICBhdHRyaWJ1dGlvbiA9IHJlc291cmNlLnByb3BlcnRpZXMuYXR0cmlidXRpb247XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXR0cmlidXRpb247XHJcbiAgfVxyXG5cclxuICBnZXRSZXNvdXJjZVNoYXJkcyhyZXNvdXJjZTogSU93c1Jlc291cmNlKTogc3RyaW5nIHtcclxuICAgIGlmIChyZXNvdXJjZS5wcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KCdzaGFyZHMnKSkge1xyXG4gICAgICByZXR1cm4gcmVzb3VyY2UucHJvcGVydGllcy5zaGFyZHM7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb252ZXJ0T3djVGltZVRvSXNvVGltZUFuZFBlcmlvZGljaXR5KG93Y3RpbWU6IHN0cmluZyk6IElMYXllckludGVydmFsQW5kUGVyaW9kIHwgc3RyaW5nIHtcclxuICAgIC8qKlxyXG4gICAgIENvbnZlcnQgZnJvbVxyXG4gICAgKi9cclxuICAgIGxldCBhcnIgPSBvd2N0aW1lLnNwbGl0KCcvJyk7XHJcbiAgICBsZXQgdCA9IChhcnIubGVuZ3RoID09IDMpID8gYXJyWzBdICsgJy8nICsgYXJyWzFdIDogb3djdGltZTtcclxuICAgIGxldCBwID0gKGFyci5sZW5ndGggPT0gMykgPyBhcnJbMl0gOiBudWxsO1xyXG4gICAgaWYgKHApIHtcclxuICAgICAgcmV0dXJuIHsgXCJpbnRlcnZhbFwiOiB0LCBcInBlcmlvZGljaXR5XCI6IHAgfTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICByZXR1cm4gdFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0UmVzb3VyY2VEaW1lbnNpb25zKHJlc291cmNlOiBJT3dzUmVzb3VyY2UpOiBJTGF5ZXJEaW1lbnNpb25zIHtcclxuICAgIGlmICghcmVzb3VyY2UucHJvcGVydGllcy5oYXNPd25Qcm9wZXJ0eSgnZGltZW5zaW9ucycpKSB7XHJcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgICBsZXQgZGltcyA9IHt9XHJcblxyXG4gICAgbGV0IGRpbWVuc2lvbnMgPSB7fVxyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkocmVzb3VyY2UucHJvcGVydGllcy5kaW1lbnNpb25zKSkge1xyXG4gICAgICBmb3IgKGxldCBkIG9mIHJlc291cmNlLnByb3BlcnRpZXMuZGltZW5zaW9ucykge1xyXG4gICAgICAgIGRpbWVuc2lvbnNbZC5uYW1lXSA9IGRcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZGltZW5zaW9ucyA9IHJlc291cmNlLnByb3BlcnRpZXMuZGltZW5zaW9uc1xyXG4gICAgfVxyXG4gICAgZm9yIChsZXQgbmFtZSBpbiBkaW1lbnNpb25zKSB7XHJcbiAgICAgIGxldCBkaW0gPSB7fVxyXG4gICAgICBjb25zb2xlLmxvZyhuYW1lKVxyXG4gICAgICBpZiAobmFtZSA9PT0gXCJ0aW1lXCIgfHwgZGltZW5zaW9uc1tuYW1lXS51bml0cyA9PSBcIklTTzg2MDFcIikge1xyXG4gICAgICAgIGxldCB2YWx1ZSA9IGRpbWVuc2lvbnNbbmFtZV0udmFsdWVcclxuICAgICAgICBsZXQgdmFsdWVzID0gKHZhbHVlKSA/IHZhbHVlLnNwbGl0KCcsJykubWFwKCh2OiBzdHJpbmcpID0+IHRoaXMuY29udmVydE93Y1RpbWVUb0lzb1RpbWVBbmRQZXJpb2RpY2l0eSh2KSkgOiBudWxsXHJcbiAgICAgICAgZGltID0ge1xyXG4gICAgICAgICAgXCJ2YWx1ZXNcIjogKCghdmFsdWVzKSB8fCB2YWx1ZXMubGVuZ3RoID4gMSkgPyB2YWx1ZXMgOiB2YWx1ZXNbMF0sXHJcbiAgICAgICAgICBcInVuaXRzXCI6IGRpbWVuc2lvbnNbbmFtZV0udW5pdHMsXHJcbiAgICAgICAgICBcImRpc3BsYXlcIjoge1xyXG4gICAgICAgICAgICBcImZvcm1hdFwiOiBcIllZWU1NRERcIixcclxuICAgICAgICAgICAgXCJwZXJpb2RcIjogZGltZW5zaW9uc1tuYW1lXS5kaXNwbGF5LFxyXG4gICAgICAgICAgICBcImRlZmF1bHRcIjogXCJlbmRcIlxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmIChuYW1lID09PSBcImVsZXZhdGlvblwiKSB7XHJcbiAgICAgICAgZGltID0gZGltZW5zaW9uc1tuYW1lXTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBkaW0gPSBkaW1lbnNpb25zW25hbWVdO1xyXG4gICAgICB9XHJcbiAgICAgIGRpbXNbbmFtZV0gPSBkaW07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGltcztcclxuICB9XHJcblxyXG4gIC8qKiBPZmZlcmluZyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuICBnZXRMYXllcnR5cGVGcm9tT2ZmZXJpbmdDb2RlKG9mZmVyaW5nOiBJT3dzT2ZmZXJpbmcpOiBUTGF5ZXJ0eXBlIHtcclxuICAgIGlmIChpc1dtc09mZmVyaW5nKG9mZmVyaW5nLmNvZGUpKSB7XHJcbiAgICAgIHJldHVybiBXbXNMYXllcnR5cGU7XHJcbiAgICB9IGVsc2UgaWYgKGlzV210c09mZmVyaW5nKG9mZmVyaW5nLmNvZGUpKSB7XHJcbiAgICAgIHJldHVybiBXbXRzTGF5ZXJ0eXBlO1xyXG4gICAgfSBlbHNlIGlmIChpc1dmc09mZmVyaW5nKG9mZmVyaW5nLmNvZGUpKSB7XHJcbiAgICAgIHJldHVybiBXZnNMYXllcnR5cGU7XHJcbiAgICB9IGVsc2UgaWYgKGlzR2VvSnNvbk9mZmVyaW5nKG9mZmVyaW5nLmNvZGUpKSB7XHJcbiAgICAgIHJldHVybiBHZW9qc29uTGF5ZXJ0eXBlO1xyXG4gICAgfSBlbHNlIGlmIChpc1h5ek9mZmVyaW5nKG9mZmVyaW5nLmNvZGUpKSB7XHJcbiAgICAgIHJldHVybiBYeXpMYXllcnR5cGU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gb2ZmZXJpbmcuY29kZTsgLy8gYW4gb2ZmZXJpbmcgY2FuIGFsc28gYmUgYW55IG90aGVyIHN0cmluZy5cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNoZWNrSWZTZXJ2aWNlT2ZmZXJpbmcob2ZmZXJpbmc6IElPd3NPZmZlcmluZyk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuICghb2ZmZXJpbmcuY29udGVudHMgJiYgb2ZmZXJpbmcub3BlcmF0aW9ucykgPyB0cnVlIDogZmFsc2U7XHJcbiAgfVxyXG5cclxuICBjaGVja0lmRGF0YU9mZmVyaW5nKG9mZmVyaW5nOiBJT3dzT2ZmZXJpbmcpOiBib29sZWFuIHtcclxuICAgIHJldHVybiAob2ZmZXJpbmcuY29udGVudHMgJiYgIW9mZmVyaW5nLm9wZXJhdGlvbnMpID8gdHJ1ZSA6IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZ2V0T2ZmZXJpbmdDb250ZW50cyhvZmZlcmluZzogSU93c09mZmVyaW5nKTogSU93c09wZXJhdGlvbltdIHwgSU93c0NvbnRlbnRbXSB7XHJcbiAgICBpZiAodGhpcy5jaGVja0lmU2VydmljZU9mZmVyaW5nKG9mZmVyaW5nKSkge1xyXG4gICAgICByZXR1cm4gb2ZmZXJpbmcub3BlcmF0aW9ucztcclxuICAgIH0gZWxzZSBpZiAodGhpcy5jaGVja0lmRGF0YU9mZmVyaW5nKG9mZmVyaW5nKSkge1xyXG4gICAgICByZXR1cm4gb2ZmZXJpbmcuY29udGVudHM7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBIZWxwZXIgZnVuY3Rpb24gdG8gZXh0cmFjdCBsZWdlbmRVUkwgZnJvbSBwcm9qZWN0IHNwZWNpZmljIG93cyBDb250ZXh0XHJcbiAgICogQHBhcmFtIG9mZmVyaW5nIGxheWVyIG9mZmVyaW5nXHJcbiAgICovXHJcbiAgZ2V0TGVnZW5kVXJsKG9mZmVyaW5nOiBJT3dzT2ZmZXJpbmcpIHtcclxuICAgIGxldCBsZWdlbmRVcmwgPSAnJztcclxuXHJcbiAgICBpZiAob2ZmZXJpbmcuaGFzT3duUHJvcGVydHkoJ3N0eWxlcycpKSB7XHJcbiAgICAgIGxldCBkZWZhdWx0U3R5bGUgPSBvZmZlcmluZy5zdHlsZXMuZmlsdGVyKHN0eWxlID0+IHN0eWxlLmRlZmF1bHQpO1xyXG4gICAgICBpZiAoZGVmYXVsdFN0eWxlLmxlbmd0aCA+IDApIHtcclxuICAgICAgICByZXR1cm4gZGVmYXVsdFN0eWxlWzBdLmxlZ2VuZFVSTDtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChvZmZlcmluZy5oYXNPd25Qcm9wZXJ0eSgnbGVnZW5kVXJsJykpIHtcclxuICAgICAgbGVnZW5kVXJsID0gb2ZmZXJpbmcubGVnZW5kVXJsO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGxlZ2VuZFVybDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHJldHJpZXZlIGljb25VcmwgYmFzZWQgb24gSU93c09mZmVyaW5nXHJcbiAgICogQHBhcmFtIG9mZmVyaW5nXHJcbiAgICovXHJcbiAgZ2V0SWNvblVybChvZmZlcmluZzogSU93c09mZmVyaW5nKSB7XHJcbiAgICBsZXQgaWNvblVybCA9ICcnO1xyXG4gICAgaWYgKG9mZmVyaW5nLmhhc093blByb3BlcnR5KCdpY29uVXJsJykpIHtcclxuICAgICAgaWNvblVybCA9IG9mZmVyaW5nLmljb25Vcmw7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gaWNvblVybDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGxheWVyIHByaW9yaXR5OiBmaXJzdCB3bXMsIHRoZW4gd210cywgdGhlbiB3ZnMsIHRoZW4gb3RoZXJzLlxyXG4gICAqL1xyXG4gIHB1YmxpYyBnZXRMYXllcnMob3djOiBJT3dzQ29udGV4dCwgdGFyZ2V0UHJvamVjdGlvbjogc3RyaW5nKTogT2JzZXJ2YWJsZTxMYXllcltdPiB7XHJcbiAgICBjb25zdCByZXNvdXJjZXMgPSBvd2MuZmVhdHVyZXM7XHJcbiAgICBjb25zdCBsYXllcnMkOiBPYnNlcnZhYmxlPExheWVyPltdID0gW107XHJcblxyXG4gICAgZm9yIChjb25zdCByZXNvdXJjZSBvZiByZXNvdXJjZXMpIHtcclxuICAgICAgY29uc3Qgb2ZmZXJpbmdzID0gcmVzb3VyY2UucHJvcGVydGllcy5vZmZlcmluZ3M7XHJcbiAgICAgIGlmIChvZmZlcmluZ3MubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGNvbnN0IG9mZmVyaW5nID0gb2ZmZXJpbmdzLmZpbmQobyA9PiBpc1dtc09mZmVyaW5nKG8uY29kZSkpXHJcbiAgICAgICAgICB8fCBvZmZlcmluZ3MuZmluZChvID0+IGlzV210c09mZmVyaW5nKG8uY29kZSkpXHJcbiAgICAgICAgICB8fCBvZmZlcmluZ3MuZmluZChvID0+IGlzV2ZzT2ZmZXJpbmcoby5jb2RlKSlcclxuICAgICAgICAgIHx8IG9mZmVyaW5nc1swXTtcclxuICAgICAgICBsYXllcnMkLnB1c2godGhpcy5jcmVhdGVMYXllckZyb21PZmZlcmluZyhvZmZlcmluZywgcmVzb3VyY2UsIG93YywgdGFyZ2V0UHJvamVjdGlvbikpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZvcmtKb2luKGxheWVycyQpO1xyXG4gIH1cclxuXHJcbiAgY3JlYXRlTGF5ZXJGcm9tT2ZmZXJpbmcob2ZmZXJpbmc6IElPd3NPZmZlcmluZywgcmVzb3VyY2U6IElPd3NSZXNvdXJjZSwgY29udGV4dDogSU93c0NvbnRleHQsIHRhcmdldFByb2plY3Rpb246IHN0cmluZyk6IE9ic2VydmFibGU8TGF5ZXI+IHtcclxuICAgIGNvbnN0IGxheWVyVHlwZSA9IHRoaXMuZ2V0TGF5ZXJ0eXBlRnJvbU9mZmVyaW5nQ29kZShvZmZlcmluZyk7XHJcbiAgICBpZiAoaXNSYXN0ZXJMYXllcnR5cGUobGF5ZXJUeXBlKSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5jcmVhdGVSYXN0ZXJMYXllckZyb21PZmZlcmluZyhvZmZlcmluZywgcmVzb3VyY2UsIGNvbnRleHQsIHRhcmdldFByb2plY3Rpb24pO1xyXG4gICAgfSBlbHNlIGlmIChpc1ZlY3RvckxheWVydHlwZShsYXllclR5cGUpKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmNyZWF0ZVZlY3RvckxheWVyRnJvbU9mZmVyaW5nKG9mZmVyaW5nLCByZXNvdXJjZSwgY29udGV4dCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zb2xlLmVycm9yKGBUaGlzIHR5cGUgb2Ygc2VydmljZSAoJHtsYXllclR5cGV9KSBoYXMgbm90IGJlZW4gaW1wbGVtZW50ZWQgeWV0LmApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY3JlYXRlVmVjdG9yTGF5ZXJGcm9tT2ZmZXJpbmcob2ZmZXJpbmc6IElPd3NPZmZlcmluZywgcmVzb3VyY2U6IElPd3NSZXNvdXJjZSwgY29udGV4dD86IElPd3NDb250ZXh0KTogT2JzZXJ2YWJsZTxWZWN0b3JMYXllcj4ge1xyXG4gICAgY29uc3QgbGF5ZXJUeXBlID0gdGhpcy5nZXRMYXllcnR5cGVGcm9tT2ZmZXJpbmdDb2RlKG9mZmVyaW5nKTtcclxuXHJcbiAgICBpZiAoIWlzVmVjdG9yTGF5ZXJ0eXBlKGxheWVyVHlwZSkpIHtcclxuICAgICAgY29uc29sZS5lcnJvcihgVGhpcyB0eXBlIG9mIGxheWVyICcke2xheWVyVHlwZX0nIC8gb2ZmZXJpbmcgJyR7b2ZmZXJpbmcuY29kZX0nIGNhbm5vdCBiZSBjb252ZXJ0ZWQgaW50byBhIFZlY3RvcmxheWVyYCk7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGljb25VcmwgPSB0aGlzLmdldEljb25Vcmwob2ZmZXJpbmcpO1xyXG5cclxuICAgIGxldCBsYXllclVybCwgcGFyYW1zO1xyXG4gICAgLy8gaWYgd2UgaGF2ZSBhIG9wZXJhdGlvbnMtb2ZmZXJpbmcgKHZzLiBhIGRhdGEtb2ZmZXJpbmcpOlxyXG4gICAgaWYgKG9mZmVyaW5nLm9wZXJhdGlvbnMpIGxheWVyVXJsID0gdGhpcy5nZXRVcmxGcm9tVXJpKG9mZmVyaW5nLm9wZXJhdGlvbnNbMF0uaHJlZik7XHJcbiAgICBpZiAob2ZmZXJpbmcub3BlcmF0aW9ucykgcGFyYW1zID0gdGhpcy5nZXRKc29uRnJvbVVyaShvZmZlcmluZy5vcGVyYXRpb25zWzBdLmhyZWYpO1xyXG5cclxuICAgIGxldCBkYXRhO1xyXG4gICAgLy8gaWYgd2UgaGF2ZSBhIGRhdGEtb2ZmZXJpbmc6IFxyXG4gICAgaWYgKG9mZmVyaW5nLmNvbnRlbnRzKSB7XHJcbiAgICAgIGRhdGEgPSBvZmZlcmluZy5jb250ZW50c1swXS5jb250ZW50O1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBsZWdlbmRVcmwgPSB0aGlzLmdldExlZ2VuZFVybChvZmZlcmluZyk7XHJcblxyXG4gICAgbGV0IGxheWVyT3B0aW9uczogSVZlY3RvckxheWVyT3B0aW9ucyA9IHtcclxuICAgICAgaWQ6IHJlc291cmNlLmlkIGFzIHN0cmluZyxcclxuICAgICAgbmFtZTogdGhpcy5nZXRSZXNvdXJjZVRpdGxlKHJlc291cmNlKSxcclxuICAgICAgZGlzcGxheU5hbWU6IHRoaXMuZ2V0RGlzcGxheU5hbWUob2ZmZXJpbmcsIHJlc291cmNlKSxcclxuICAgICAgdmlzaWJsZTogdGhpcy5pc0FjdGl2ZShyZXNvdXJjZSksXHJcbiAgICAgIHR5cGU6IGxheWVyVHlwZSxcclxuICAgICAgcmVtb3ZhYmxlOiB0cnVlLFxyXG4gICAgICBhdHRyaWJ1dGlvbjogdGhpcy5nZXRSZXNvdXJjZUF0dHJpYnV0aW9uKHJlc291cmNlKSxcclxuICAgICAgY29udGludW91c1dvcmxkOiBmYWxzZSxcclxuICAgICAgb3BhY2l0eTogdGhpcy5nZXRSZXNvdXJjZU9wYWNpdHkocmVzb3VyY2UpLFxyXG4gICAgICB1cmw6IGxheWVyVXJsID8gbGF5ZXJVcmwgOiBudWxsLFxyXG4gICAgICBsZWdlbmRJbWc6IGxlZ2VuZFVybCA/IGxlZ2VuZFVybCA6IG51bGwsXHJcbiAgICAgIGRhdGE6IGRhdGFcclxuICAgIH07XHJcblxyXG5cclxuICAgIGNvbnN0IGxheWVyID0gbmV3IFZlY3RvckxheWVyKGxheWVyT3B0aW9ucyk7XHJcblxyXG4gICAgaWYgKHJlc291cmNlLmJib3gpIHtcclxuICAgICAgbGF5ZXIuYmJveCA9IHJlc291cmNlLmJib3g7XHJcbiAgICB9IGVsc2UgaWYgKGNvbnRleHQgJiYgY29udGV4dC5iYm94KSB7XHJcbiAgICAgIGxheWVyLmJib3ggPSBjb250ZXh0LmJib3g7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG9mKGxheWVyKTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZVJhc3RlckxheWVyRnJvbU9mZmVyaW5nKFxyXG4gICAgb2ZmZXJpbmc6IElPd3NPZmZlcmluZywgcmVzb3VyY2U6IElPd3NSZXNvdXJjZSwgY29udGV4dDogSU93c0NvbnRleHQsIHRhcmdldFByb2plY3Rpb246IHN0cmluZyk6IE9ic2VydmFibGU8UmFzdGVyTGF5ZXI+IHtcclxuICAgIGNvbnN0IGxheWVyVHlwZSA9IHRoaXMuZ2V0TGF5ZXJ0eXBlRnJvbU9mZmVyaW5nQ29kZShvZmZlcmluZyk7XHJcblxyXG4gICAgaWYgKCFpc1Jhc3RlckxheWVydHlwZShsYXllclR5cGUpKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoYFRoaXMgdHlwZSBvZiBvZmZlcmluZyAnJHtvZmZlcmluZy5jb2RlfScgY2Fubm90IGJlIGNvbnZlcnRlZCBpbnRvIGEgcmFzdGVybGF5ZXIuYCk7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCByYXN0ZXJMYXllciQ6IE9ic2VydmFibGU8UmFzdGVyTGF5ZXI+O1xyXG4gICAgc3dpdGNoIChsYXllclR5cGUpIHtcclxuICAgICAgY2FzZSBXbXNMYXllcnR5cGU6XHJcbiAgICAgICAgcmFzdGVyTGF5ZXIkID0gdGhpcy5jcmVhdGVXbXNMYXllckZyb21PZmZlcmluZyhvZmZlcmluZywgcmVzb3VyY2UsIGNvbnRleHQpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFdtdHNMYXllcnR5cGU6XHJcbiAgICAgICAgcmFzdGVyTGF5ZXIkID0gdGhpcy5jcmVhdGVXbXRzTGF5ZXJGcm9tT2ZmZXJpbmcob2ZmZXJpbmcsIHJlc291cmNlLCBjb250ZXh0LCB0YXJnZXRQcm9qZWN0aW9uKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBYeXpMYXllcnR5cGU6XHJcbiAgICAgICAgLy8gQFRPRE9cclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBDdXN0b21MYXllcnR5cGU6XHJcbiAgICAgICAgLy8gY3VzdG9tIGxheWVycyBhcmUgbWVhbnQgdG8gYmUgdXNlcmRlZmluZWQgYW5kIG5vdCBlYXNpbHkgZW5jb2RlZCBpbiBhIE9XQy5cclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmFzdGVyTGF5ZXIkO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjcmVhdGVXbXRzTGF5ZXJGcm9tT2ZmZXJpbmcoXHJcbiAgICBvZmZlcmluZzogSU93c09mZmVyaW5nLCByZXNvdXJjZTogSU93c1Jlc291cmNlLCBjb250ZXh0OiBJT3dzQ29udGV4dCwgdGFyZ2V0UHJvamVjdGlvbjogc3RyaW5nKTogT2JzZXJ2YWJsZTxXbXRzTGF5ZXI+IHtcclxuICAgIHJldHVybiB0aGlzLmdldFdtdHNPcHRpb25zKG9mZmVyaW5nLCByZXNvdXJjZSwgY29udGV4dCwgdGFyZ2V0UHJvamVjdGlvbikucGlwZShtYXAoKG9wdGlvbnM6IElXbXRzT3B0aW9ucykgPT4ge1xyXG4gICAgICBjb25zdCBsYXllciA9IG5ldyBXbXRzTGF5ZXIob3B0aW9ucyk7XHJcbiAgICAgIHJldHVybiBsYXllcjtcclxuICAgIH0pKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgY3JlYXRlV21zTGF5ZXJGcm9tT2ZmZXJpbmcob2ZmZXJpbmc6IElPd3NPZmZlcmluZywgcmVzb3VyY2U6IElPd3NSZXNvdXJjZSwgY29udGV4dDogSU93c0NvbnRleHQpOiBPYnNlcnZhYmxlPFdtc0xheWVyPiB7XHJcbiAgICBjb25zdCBvcHRpb25zOiBJV21zT3B0aW9ucyA9IHRoaXMuZ2V0V21zT3B0aW9ucyhvZmZlcmluZywgcmVzb3VyY2UsIGNvbnRleHQpO1xyXG4gICAgY29uc3QgbGF5ZXIgPSBuZXcgV21zTGF5ZXIob3B0aW9ucyk7XHJcbiAgICByZXR1cm4gb2YobGF5ZXIpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRXbXRzT3B0aW9ucyhcclxuICAgIG9mZmVyaW5nOiBJT3dzT2ZmZXJpbmcsIHJlc291cmNlOiBJT3dzUmVzb3VyY2UsIGNvbnRleHQ6IElPd3NDb250ZXh0LCB0YXJnZXRQcm9qZWN0aW9uOiBzdHJpbmcpOiBPYnNlcnZhYmxlPElXbXRzT3B0aW9ucz4ge1xyXG4gICAgY29uc3QgcmFzdGVyT3B0aW9uczogSVJhc3RlckxheWVyT3B0aW9ucyA9IHRoaXMuZ2V0UmFzdGVyTGF5ZXJPcHRpb25zKG9mZmVyaW5nLCByZXNvdXJjZSwgY29udGV4dCk7XHJcblxyXG4gICAgY29uc3QgbGF5ZXIgPSB0aGlzLmdldExheWVyRm9yV01UUyhvZmZlcmluZywgcmVzb3VyY2UpO1xyXG5cclxuICAgIGxldCBzdHlsZTogc3RyaW5nO1xyXG4gICAgaWYgKG9mZmVyaW5nLnN0eWxlcykge1xyXG4gICAgICBjb25zdCBzdHlsZUluZm8gPSBvZmZlcmluZy5zdHlsZXMuZmluZChzID0+IHMuZGVmYXVsdCk7XHJcbiAgICAgIGlmIChzdHlsZUluZm8pIHtcclxuICAgICAgICBzdHlsZSA9IHN0eWxlSW5mby5uYW1lO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZ2V0TWF0cml4U2V0Rm9yV01UUyhvZmZlcmluZywgcmVzb3VyY2UsIHRhcmdldFByb2plY3Rpb24pLnBpcGUobWFwKCgobWF0cml4U2V0OiBJRW9jT3dzV210c01hdHJpeFNldCkgPT4ge1xyXG4gICAgICBjb25zdCBtYXRyaXhTZXRPcHRpb25zOiBJTGlzdE1hdHJpeFNldCA9IHtcclxuICAgICAgICBtYXRyaXhTZXQ6IG1hdHJpeFNldC5tYXRyaXhTZXQsXHJcbiAgICAgICAgbWF0cml4SWRzOiBtYXRyaXhTZXQubWF0cml4SWRzLFxyXG4gICAgICAgIHJlc29sdXRpb25zOiBtYXRyaXhTZXQucmVzb2x1dGlvbnNcclxuICAgICAgfTtcclxuICAgICAgY29uc3Qgd210c09wdGlvbnM6IElXbXRzT3B0aW9ucyA9IHtcclxuICAgICAgICAuLi5yYXN0ZXJPcHRpb25zLFxyXG4gICAgICAgIHR5cGU6ICd3bXRzJyxcclxuICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgIGxheWVyOiBsYXllcixcclxuICAgICAgICAgIG1hdHJpeFNldE9wdGlvbnM6IG1hdHJpeFNldE9wdGlvbnMsXHJcbiAgICAgICAgICBwcm9qZWN0aW9uOiB0YXJnZXRQcm9qZWN0aW9uLFxyXG4gICAgICAgICAgc3R5bGU6IHN0eWxlLFxyXG4gICAgICAgICAgZm9ybWF0OiAnaW1hZ2UvcG5nJ1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuICAgICAgcmV0dXJuIHdtdHNPcHRpb25zO1xyXG4gICAgfSkpKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0TGF5ZXJGb3JXTVRTKG9mZmVyaW5nOiBJT3dzT2ZmZXJpbmcsIHJlc291cmNlOiBJT3dzUmVzb3VyY2UpOiBzdHJpbmcge1xyXG4gICAgY29uc3QgW3VybCwgdXJsUGFyYW1zXSA9IHRoaXMucGFyc2VPcGVyYXRpb25Vcmwob2ZmZXJpbmcsICdHZXRUaWxlJyk7XHJcbiAgICBpZiAodXJsUGFyYW1zWydMQVlFUiddKSB7XHJcbiAgICAgIHJldHVybiB1cmxQYXJhbXNbJ0xBWUVSJ107XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zb2xlLmVycm9yKGBUaGVyZSBpcyBubyBsYXllci1wYXJhbWV0ZXIgaW4gdGhlIG9mZmVyaW5nICR7b2ZmZXJpbmcuY29kZX0gZm9yIHJlc291cmNlICR7cmVzb3VyY2UuaWR9LlxyXG4gICAgICBDYW5ub3QgaW5mZXIgbGF5ZXIuYCwgb2ZmZXJpbmcpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBwYXJzZU9wZXJhdGlvblVybChvZmZlcmluZzogSU93c09mZmVyaW5nLCBvcENvZGU6IHN0cmluZyk6IFtzdHJpbmcsIG9iamVjdF0ge1xyXG4gICAgaWYgKG9mZmVyaW5nLm9wZXJhdGlvbnMpIHtcclxuICAgICAgY29uc3Qgb3BlcmF0aW9uID0gb2ZmZXJpbmcub3BlcmF0aW9ucy5maW5kKG9wID0+IG9wLmNvZGUgPT09IG9wQ29kZSk7XHJcbiAgICAgIGlmIChvcGVyYXRpb24pIHtcclxuICAgICAgICBjb25zdCB1cmwgPSB0aGlzLmdldFVybEZyb21Vcmkob3BlcmF0aW9uLmhyZWYpO1xyXG4gICAgICAgIGNvbnN0IHVybFBhcmFtcyA9IHRoaXMuZ2V0SnNvbkZyb21Vcmkob3BlcmF0aW9uLmhyZWYpO1xyXG4gICAgICAgIHJldHVybiBbdXJsLCB1cmxQYXJhbXNdO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYFRoZXJlIGlzIG5vICR7b3BDb2RlfS1vcGVyYXRpb24gaW4gdGhlIG9mZmVyaW5nICR7b2ZmZXJpbmcuY29kZX0uYCwgb2ZmZXJpbmcpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zb2xlLmVycm9yKGBUaGUgb2ZmZXJpbmcgJHtvZmZlcmluZy5jb2RlfSBoYXMgbm8gb3BlcmF0aW9ucy5gLCBvZmZlcmluZyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldE1hdHJpeFNldEZvcldNVFMob2ZmZXJpbmc6IElPd3NPZmZlcmluZywgcmVzb3VyY2U6IElPd3NSZXNvdXJjZSwgdGFyZ2V0UHJvamVjdGlvbjogc3RyaW5nKTogT2JzZXJ2YWJsZTxJRW9jT3dzV210c01hdHJpeFNldD4ge1xyXG4gICAgaWYgKG9mZmVyaW5nLm1hdHJpeFNldHMpIHtcclxuICAgICAgY29uc3QgbWF0cml4U2V0ID0gb2ZmZXJpbmcubWF0cml4U2V0cy5maW5kKG0gPT4gbS5zcnMgPT09IHRhcmdldFByb2plY3Rpb24pO1xyXG4gICAgICByZXR1cm4gb2YobWF0cml4U2V0KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnN0IFt1cmwsIHVybFBhcmFtc10gPSB0aGlzLnBhcnNlT3BlcmF0aW9uVXJsKG9mZmVyaW5nLCAnR2V0Q2FwYWJpbGl0aWVzJyk7XHJcbiAgICAgIHJldHVybiB0aGlzLndtdHNDbGllbnQuZ2V0Q2FwYWJpbGl0aWVzKHVybCkucGlwZShcclxuICAgICAgICBtYXAoKGNhcGFiaWxpdGllczogb2JqZWN0KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBtYXRyaXhTZXRzID0gY2FwYWJpbGl0aWVzWyd2YWx1ZSddWydjb250ZW50cyddWyd0aWxlTWF0cml4U2V0J107XHJcbiAgICAgICAgICBjb25zdCBtYXRyaXhTZXQgPSBtYXRyaXhTZXRzLmZpbmQobXMgPT4gbXNbJ2lkZW50aWZpZXInXVsndmFsdWUnXSA9PT0gdGFyZ2V0UHJvamVjdGlvbik7XHJcbiAgICAgICAgICBjb25zdCBvd3NNYXRyaXhTZXQ6IElFb2NPd3NXbXRzTWF0cml4U2V0ID0ge1xyXG4gICAgICAgICAgICBzcnM6IHRhcmdldFByb2plY3Rpb24sXHJcbiAgICAgICAgICAgIG1hdHJpeFNldDogbWF0cml4U2V0WydpZGVudGlmaWVyJ11bJ3ZhbHVlJ10sXHJcbiAgICAgICAgICAgIG1hdHJpeElkczogbWF0cml4U2V0Wyd0aWxlTWF0cml4J10ubWFwKHRtID0+IHRtWydpZGVudGlmaWVyJ11bJ3ZhbHVlJ10pLFxyXG4gICAgICAgICAgICByZXNvbHV0aW9uczogbWF0cml4U2V0Wyd0aWxlTWF0cml4J10ubWFwKHRtID0+IHRtWydzY2FsZURlbm9taW5hdG9yJ10pLFxyXG4gICAgICAgICAgICBvcmlnaW46IHtcclxuICAgICAgICAgICAgICB4OiBtYXRyaXhTZXRbJ3RpbGVNYXRyaXgnXVswXVsndG9wTGVmdENvcm5lciddWzFdLFxyXG4gICAgICAgICAgICAgIHk6IG1hdHJpeFNldFsndGlsZU1hdHJpeCddWzBdWyd0b3BMZWZ0Q29ybmVyJ11bMF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdGlsZXNpemU6IG1hdHJpeFNldFsndGlsZU1hdHJpeCddWzBdWyd0aWxlSGVpZ2h0J11cclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICByZXR1cm4gb3dzTWF0cml4U2V0O1xyXG4gICAgICAgIH0pXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldFdtc09wdGlvbnMob2ZmZXJpbmc6IElPd3NPZmZlcmluZywgcmVzb3VyY2U6IElPd3NSZXNvdXJjZSwgY29udGV4dDogSU93c0NvbnRleHQpOiBJV21zT3B0aW9ucyB7XHJcbiAgICBjb25zdCByYXN0ZXJPcHRpb25zOiBJUmFzdGVyTGF5ZXJPcHRpb25zID0gdGhpcy5nZXRSYXN0ZXJMYXllck9wdGlvbnMob2ZmZXJpbmcsIHJlc291cmNlLCBjb250ZXh0KTtcclxuICAgIGlmIChyYXN0ZXJPcHRpb25zLnR5cGUgPT09IFdtc0xheWVydHlwZSkge1xyXG5cclxuICAgICAgY29uc3QgdXJsUGFyYW1zID0gdGhpcy5nZXRKc29uRnJvbVVyaShvZmZlcmluZy5vcGVyYXRpb25zWzBdLmhyZWYpO1xyXG4gICAgICBsZXQgZGVmYXVsdFN0eWxlO1xyXG4gICAgICBpZiAob2ZmZXJpbmcuc3R5bGVzKSB7XHJcbiAgICAgICAgZGVmYXVsdFN0eWxlID0gb2ZmZXJpbmcuc3R5bGVzLmZpbmQocyA9PiBzLmRlZmF1bHQpLm5hbWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHBhcmFtczogSVdtc1BhcmFtcyA9IHtcclxuICAgICAgICBMQVlFUlM6IHVybFBhcmFtc1snTEFZRVJTJ10sXHJcbiAgICAgICAgRk9STUFUOiB1cmxQYXJhbXNbJ0ZPUk1BVCddLFxyXG4gICAgICAgIFRJTUU6IHVybFBhcmFtc1snVElNRSddLFxyXG4gICAgICAgIFZFUlNJT046IHVybFBhcmFtc1snVkVSU0lPTiddLFxyXG4gICAgICAgIFRJTEVEOiB1cmxQYXJhbXNbJ1RJTEVEJ10sXHJcbiAgICAgICAgVFJBTlNQQVJFTlQ6IHRydWUsXHJcbiAgICAgICAgU1RZTEVTOiBkZWZhdWx0U3R5bGVcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGNvbnN0IHdtc09wdGlvbnM6IElXbXNPcHRpb25zID0ge1xyXG4gICAgICAgIC4uLnJhc3Rlck9wdGlvbnMsXHJcbiAgICAgICAgdHlwZTogJ3dtcycsXHJcbiAgICAgICAgcGFyYW1zOiBwYXJhbXNcclxuICAgICAgfTtcclxuICAgICAgcmV0dXJuIHdtc09wdGlvbnM7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zb2xlLmVycm9yKGByZXNvdXJjZSAke3Jlc291cmNlLmlkfSBjYW5ub3QgYmUgY29udmVydGVkIGludG8gYSBXTVMtTGF5ZXJgLCBvZmZlcmluZyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldFJhc3RlckxheWVyT3B0aW9ucyhvZmZlcmluZzogSU93c09mZmVyaW5nLCByZXNvdXJjZTogSU93c1Jlc291cmNlLCBjb250ZXh0OiBJT3dzQ29udGV4dCk6IElSYXN0ZXJMYXllck9wdGlvbnMge1xyXG4gICAgY29uc3QgbGF5ZXJPcHRpb25zOiBJTGF5ZXJPcHRpb25zID0gdGhpcy5nZXRMYXllck9wdGlvbnMob2ZmZXJpbmcsIHJlc291cmNlLCBjb250ZXh0KTtcclxuICAgIGlmIChpc1Jhc3RlckxheWVydHlwZShsYXllck9wdGlvbnMudHlwZSkpIHtcclxuICAgICAgY29uc3QgcmFzdGVyTGF5ZXJPcHRpb25zOiBJUmFzdGVyTGF5ZXJPcHRpb25zID0ge1xyXG4gICAgICAgIC4uLmxheWVyT3B0aW9ucyxcclxuICAgICAgICB0eXBlOiBsYXllck9wdGlvbnMudHlwZSBhcyBUUmFzdGVyTGF5ZXJ0eXBlLFxyXG4gICAgICAgIHVybDogdGhpcy5nZXRVcmxGcm9tVXJpKG9mZmVyaW5nLm9wZXJhdGlvbnNbMF0uaHJlZiksXHJcbiAgICAgICAgc3ViZG9tYWluczogc2hhcmRzRXhwYW5kKHRoaXMuZ2V0UmVzb3VyY2VTaGFyZHMocmVzb3VyY2UpKVxyXG4gICAgICB9O1xyXG4gICAgICByZXR1cm4gcmFzdGVyTGF5ZXJPcHRpb25zO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc29sZS5lcnJvcihgVGhlIGxheWVyICR7bGF5ZXJPcHRpb25zLmlkfSBpcyBub3QgYSByYXN0ZXJsYXllcmAsIGxheWVyT3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldExheWVyT3B0aW9ucyhvZmZlcmluZzogSU93c09mZmVyaW5nLCByZXNvdXJjZTogSU93c1Jlc291cmNlLCBjb250ZXh0OiBJT3dzQ29udGV4dCk6IElMYXllck9wdGlvbnMge1xyXG4gICAgY29uc3QgbGF5ZXJPcHRpb25zOiBJTGF5ZXJPcHRpb25zID0ge1xyXG4gICAgICBpZDogcmVzb3VyY2UuaWQgYXMgc3RyaW5nLFxyXG4gICAgICB0eXBlOiB0aGlzLmdldExheWVydHlwZUZyb21PZmZlcmluZ0NvZGUob2ZmZXJpbmcpLFxyXG4gICAgICBuYW1lOiB0aGlzLmdldFJlc291cmNlVGl0bGUocmVzb3VyY2UpLFxyXG4gICAgICByZW1vdmFibGU6IHRydWUsXHJcbiAgICAgIGNvbnRpbnVvdXNXb3JsZDogZmFsc2UsXHJcbiAgICAgIG9wYWNpdHk6IHRoaXMuZ2V0UmVzb3VyY2VPcGFjaXR5KHJlc291cmNlKSxcclxuICAgICAgZGlzcGxheU5hbWU6IHRoaXMuZ2V0RGlzcGxheU5hbWUob2ZmZXJpbmcsIHJlc291cmNlKSxcclxuICAgICAgdmlzaWJsZTogdGhpcy5pc0FjdGl2ZShyZXNvdXJjZSksXHJcbiAgICAgIGF0dHJpYnV0aW9uOiB0aGlzLmdldFJlc291cmNlQXR0cmlidXRpb24ocmVzb3VyY2UpLFxyXG4gICAgICBkaW1lbnNpb25zOiB0aGlzLmdldFJlc291cmNlRGltZW5zaW9ucyhyZXNvdXJjZSksXHJcbiAgICAgIGxlZ2VuZEltZzogdGhpcy5nZXRMZWdlbmRVcmwob2ZmZXJpbmcpLFxyXG4gICAgICBzdHlsZXM6IG9mZmVyaW5nLnN0eWxlc1xyXG4gICAgfTtcclxuXHJcbiAgICBpZiAocmVzb3VyY2UuYmJveCkge1xyXG4gICAgICBsYXllck9wdGlvbnMuYmJveCA9IHJlc291cmNlLmJib3g7XHJcbiAgICB9IGVsc2UgaWYgKGNvbnRleHQgJiYgY29udGV4dC5iYm94KSB7XHJcbiAgICAgIGxheWVyT3B0aW9ucy5iYm94ID0gY29udGV4dC5iYm94O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBsYXllck9wdGlvbnM7XHJcbiAgfVxyXG5cclxuICAvKiogTWlzYyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcbiAgcHJpdmF0ZSBnZXRVcmxGcm9tVXJpKHVyaTogc3RyaW5nKSB7XHJcbiAgICByZXR1cm4gdXJpLnN1YnN0cmluZygwLCB1cmkuaW5kZXhPZignPycpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGhlbHBlciB0byBwYWNrIHF1ZXJ5LXBhcmFtZXRlcnMgb2YgYSB1cmkgaW50byBhIEpTT05cclxuICAgKiBAcGFyYW0gdXJpIGFueSB1cmkgd2l0aCBxdWVyeS1wYXJhbWV0ZXJzXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBnZXRKc29uRnJvbVVyaSh1cmk6IHN0cmluZyk6IG9iamVjdCB7XHJcbiAgICBjb25zdCBxdWVyeSA9IHVyaS5zdWJzdHIodXJpLmxhc3RJbmRleE9mKCc/JykgKyAxKTtcclxuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xyXG4gICAgcXVlcnkuc3BsaXQoJyYnKS5mb3JFYWNoKGZ1bmN0aW9uIChwYXJ0KSB7XHJcbiAgICAgIGNvbnN0IGl0ZW0gPSBwYXJ0LnNwbGl0KCc9Jyk7XHJcbiAgICAgIHJlc3VsdFtpdGVtWzBdLnRvVXBwZXJDYXNlKCldID0gZGVjb2RlVVJJQ29tcG9uZW50KGl0ZW1bMV0pO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIHJldHJpZXZlIGRpc3BsYXkgbmFtZSBvZiBsYXllciwgYmFzZWQgb24gSU93c1Jlc291cmNlIGFuZCBJT3dzT2ZmZXJpbmdcclxuICAgKiBAcGFyYW0gb2ZmZXJpbmdcclxuICAgKiBAcGFyYW0gcmVzb3VyY2VcclxuICAgKi9cclxuICBwcml2YXRlIGdldERpc3BsYXlOYW1lKG9mZmVyaW5nOiBJT3dzT2ZmZXJpbmcsIHJlc291cmNlOiBJT3dzUmVzb3VyY2UpIHtcclxuICAgIGxldCBkaXNwbGF5TmFtZSA9ICcnO1xyXG4gICAgaWYgKG9mZmVyaW5nLmhhc093blByb3BlcnR5KCd0aXRsZScpKSB7XHJcbiAgICAgIGlmIChvZmZlcmluZy50aXRsZSkge1xyXG4gICAgICAgIGRpc3BsYXlOYW1lID0gb2ZmZXJpbmcudGl0bGU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZGlzcGxheU5hbWUgPSB0aGlzLmdldFJlc291cmNlVGl0bGUocmVzb3VyY2UpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGlzcGxheU5hbWU7XHJcbiAgfVxyXG5cclxuXHJcbiAgLyoqLS0tLS0tLS0tLS0tIERBVEEgVE8gRklMRSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcblxyXG5cclxuICAvKipcclxuICAgKiBAVE9ETzpcclxuICAgKiAgIC0gcHJvcGVydGllc1xyXG4gICAqL1xyXG4gIGdlbmVyYXRlT3dzQ29udGV4dEZyb20oaWQ6IHN0cmluZywgbGF5ZXJzOiBMYXllcltdLCBleHRlbnQ/OiBUR2VvRXh0ZW50LCBwcm9wZXJ0aWVzPyk6IElFb2NPd3NDb250ZXh0IHtcclxuXHJcbiAgICBpZiAoIXByb3BlcnRpZXMpIHtcclxuICAgICAgcHJvcGVydGllcyA9IHtcclxuICAgICAgICBsYW5nOiAnJyxcclxuICAgICAgICBsaW5rczogW10sXHJcbiAgICAgICAgdGl0bGU6ICcnLFxyXG4gICAgICAgIHVwZGF0ZWQ6ICcnXHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IG93YzogSUVvY093c0NvbnRleHQgPSB7XHJcbiAgICAgICdpZCc6IGlkLFxyXG4gICAgICAndHlwZSc6ICdGZWF0dXJlQ29sbGVjdGlvbicsXHJcbiAgICAgICdwcm9wZXJ0aWVzJzogcHJvcGVydGllcyxcclxuICAgICAgJ2ZlYXR1cmVzJzogW11cclxuICAgIH07XHJcblxyXG4gICAgaWYgKGV4dGVudCkge1xyXG4gICAgICBvd2NbJ2Jib3gnXSA9IGV4dGVudDtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGxldCBsYXllciBvZiBsYXllcnMpIHtcclxuICAgICAgbGV0IHJlc291cmNlOiBJRW9jT3dzUmVzb3VyY2UgPSB0aGlzLmdlbmVyYXRlUmVzb3VyY2VGcm9tTGF5ZXIobGF5ZXIpO1xyXG4gICAgICAvLyBUT0RPIGNoZWNrIGZvciBsYXllciB0eXBlc1xyXG4gICAgICBvd2MuZmVhdHVyZXMucHVzaChyZXNvdXJjZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG93YztcclxuICB9XHJcblxyXG4gIGdlbmVyYXRlUmVzb3VyY2VGcm9tTGF5ZXIobGF5ZXI6IExheWVyKTogSUVvY093c1Jlc291cmNlIHtcclxuICAgIGxldCByZXNvdXJjZTogSUVvY093c1Jlc291cmNlID0ge1xyXG4gICAgICAnaWQnOiBsYXllci5pZCxcclxuICAgICAgJ3Byb3BlcnRpZXMnOiB7XHJcbiAgICAgICAgdGl0bGU6IGxheWVyLm5hbWUsXHJcbiAgICAgICAgdXBkYXRlZDogbnVsbCxcclxuICAgICAgICBvZmZlcmluZ3M6IFt0aGlzLmdlbmVyYXRlT2ZmZXJpbmdGcm9tTGF5ZXIobGF5ZXIpXSxcclxuICAgICAgICBvcGFjaXR5OiBsYXllci5vcGFjaXR5LFxyXG4gICAgICAgIGF0dHJpYnV0aW9uOiBsYXllci5hdHRyaWJ1dGlvbixcclxuICAgICAgfSxcclxuICAgICAgJ3R5cGUnOiAnRmVhdHVyZScsXHJcbiAgICAgICdnZW9tZXRyeSc6IG51bGxcclxuICAgIH1cclxuICAgIHJldHVybiByZXNvdXJjZTtcclxuICB9XHJcblxyXG4gIGdlbmVyYXRlT2ZmZXJpbmdGcm9tTGF5ZXIobGF5ZXI6IExheWVyLCBsZWdlbmRVcmw/OiBzdHJpbmcsIGljb25Vcmw/OiBzdHJpbmcpOiBJRW9jT3dzT2ZmZXJpbmcge1xyXG4gICAgbGV0IG9mZmVyaW5nOiBJRW9jT3dzT2ZmZXJpbmcgPSB7XHJcbiAgICAgICdjb2RlJzogdGhpcy5nZXRPZmZlcmluZ0NvZGVGcm9tTGF5ZXIobGF5ZXIpLFxyXG4gICAgICAndGl0bGUnOiBsYXllci5uYW1lXHJcbiAgICB9O1xyXG5cclxuICAgIGlmIChsYXllci50eXBlID09IEdlb2pzb25MYXllcnR5cGUpIHtcclxuICAgICAgb2ZmZXJpbmcuY29udGVudHMgPSB0aGlzLmdldENvbnRlbnRzRnJvbUxheWVyKGxheWVyIGFzIFZlY3RvckxheWVyKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG9mZmVyaW5nLm9wZXJhdGlvbnMgPSB0aGlzLmdldE9wZXJhdGlvbnNGcm9tTGF5ZXIobGF5ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChsZWdlbmRVcmwpIG9mZmVyaW5nLmxlZ2VuZFVybCA9IGxlZ2VuZFVybDtcclxuICAgIGlmIChpY29uVXJsKSBvZmZlcmluZy5pY29uVXJsID0gaWNvblVybDtcclxuXHJcbiAgICByZXR1cm4gb2ZmZXJpbmc7XHJcbiAgfVxyXG5cclxuICBnZXRPZmZlcmluZ0NvZGVGcm9tTGF5ZXIobGF5ZXI6IExheWVyKTogc3RyaW5nIHtcclxuICAgIHN3aXRjaCAobGF5ZXIudHlwZSkge1xyXG4gICAgICBjYXNlIFdtc0xheWVydHlwZTpcclxuICAgICAgICByZXR1cm4gJ2h0dHA6Ly93d3cub3Blbmdpcy5uZXQvc3BlYy9vd2MtZ2VvanNvbi8xLjAvcmVxL3dtcyc7XHJcbiAgICAgIGNhc2UgV210c0xheWVydHlwZTpcclxuICAgICAgICByZXR1cm4gJ2h0dHA6Ly93d3cub3Blbmdpcy5uZXQvc3BlYy9vd2MtZ2VvanNvbi8xLjAvcmVxL3dtdHMnO1xyXG4gICAgICBjYXNlIEdlb2pzb25MYXllcnR5cGU6XHJcbiAgICAgICAgcmV0dXJuICdodHRwOi8vd3d3Lm9wZW5naXMubmV0L3NwZWMvb3djLWdlb2pzb24vMS4wL3JlcS9nZW9qc29uJztcclxuICAgICAgY2FzZSBYeXpMYXllcnR5cGU6XHJcbiAgICAgICAgcmV0dXJuICdodHRwOi8vd3d3Lm9wZW5naXMubmV0L3NwZWMvb3djLWdlb2pzb24vMS4wL3JlcS94eXonO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYFRoaXMgdHlwZSBvZiBsYXllciAoJHtsYXllci50eXBlfSkgaGFzIG5vdCBiZWVuIGltcGxlbWVudGVkIHlldC5gKTtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldENvbnRlbnRzRnJvbUxheWVyKGxheWVyOiBWZWN0b3JMYXllcik6IElPd3NDb250ZW50W10ge1xyXG4gICAgbGV0IGNvbnRlbnRzID0gW107XHJcbiAgICBzd2l0Y2ggKGxheWVyLnR5cGUpIHtcclxuICAgICAgY2FzZSBHZW9qc29uTGF5ZXJ0eXBlOlxyXG4gICAgICAgIGxldCBjb250ZW50ID0ge1xyXG4gICAgICAgICAgdHlwZTogJ0ZlYXR1cmVDb2xsZWN0aW9uJyxcclxuICAgICAgICAgIGNvbnRlbnQ6IEpTT04uc3RyaW5naWZ5KGxheWVyLmRhdGEpXHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb250ZW50cy5wdXNoKGNvbnRlbnQpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYENhbm5vdCBnZXQgY29udGVudHMgZm9yIHRoaXMgdHlwZSBvZiB2ZWN0b3JsYXllcjogKCR7bGF5ZXIudHlwZX0pYCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY29udGVudHM7XHJcbiAgfVxyXG5cclxuICBnZXRPcGVyYXRpb25zRnJvbUxheWVyKGxheWVyOiBMYXllcik6IElPd3NPcGVyYXRpb25bXSB7XHJcbiAgICBpZiAobGF5ZXIgaW5zdGFuY2VvZiBSYXN0ZXJMYXllcikge1xyXG4gICAgICBzd2l0Y2ggKGxheWVyLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFdtc0xheWVydHlwZTpcclxuICAgICAgICAgIHJldHVybiB0aGlzLmdldFdtc09wZXJhdGlvbnNGcm9tTGF5ZXIobGF5ZXIpO1xyXG4gICAgICAgIGNhc2UgV210c0xheWVydHlwZTpcclxuICAgICAgICAgIHJldHVybiB0aGlzLmdldFdtdHNPcGVyYXRpb25zRnJvbUxheWVyKGxheWVyKTtcclxuICAgICAgICBjYXNlIFh5ekxheWVydHlwZTpcclxuICAgICAgICAgIHJldHVybiB0aGlzLmdldFh5ek9wZXJhdGlvbnNGcm9tTGF5ZXIobGF5ZXIpO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGBDYW5ub3QgZ2V0IG9wZXJhdGlvbnMgZm9yIHRoaXMgdHlwZSBvZiBsYXllcjogKCR7bGF5ZXIudHlwZX0pYCk7XHJcbiAgICAgICAgICByZXR1cm4gW107XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBlbHNlIGlmIChsYXllciBpbnN0YW5jZW9mIFZlY3RvckxheWVyKSB7XHJcbiAgICAgIHN3aXRjaCAobGF5ZXIudHlwZSkge1xyXG4gICAgICAgIC8vIGNhc2UgJ3dmcyc6IDwtLS0gdGhpcyB0eXBlIG9mIGxheWVyIGhhcyBub3QgYmVlbiBpbXBsZW1lbnRlZCB5ZXQgaW4gZGF0YXR5cGVzLWxheWVycy9MYXllcnMudHMgXHJcbiAgICAgICAgLy8gICByZXR1cm4gdGhpcy5nZXRXZnNPcGVyYXRpb25zRnJvbUxheWVyKGxheWVyKTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgY29uc29sZS5lcnJvcihgVGhpcyB0eXBlIG9mIHNlcnZpY2UgKCR7bGF5ZXIudHlwZX0pIGhhcyBub3QgYmVlbiBpbXBsZW1lbnRlZCB5ZXQuYCk7XHJcbiAgICAgICAgICByZXR1cm4gW107XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuXHJcbiAgZ2V0WHl6T3BlcmF0aW9uc0Zyb21MYXllcihsYXllcjogUmFzdGVyTGF5ZXIpOiBJT3dzT3BlcmF0aW9uW10ge1xyXG4gICAgbGV0IHJlc3RDYWxsOiBJT3dzT3BlcmF0aW9uID0ge1xyXG4gICAgICAnY29kZSc6ICdSRVNUJyxcclxuICAgICAgJ21ldGhvZCc6ICdHRVQnLFxyXG4gICAgICAndHlwZSc6ICd0ZXh0L2h0bWwnLFxyXG4gICAgICAnaHJlZic6IGAke2xheWVyLnVybH1gXHJcbiAgICB9XHJcblxyXG4gICAgbGV0IG9wZXJhdGlvbnM6IElPd3NPcGVyYXRpb25bXSA9IFtcclxuICAgICAgcmVzdENhbGxcclxuICAgIF07XHJcblxyXG4gICAgcmV0dXJuIG9wZXJhdGlvbnM7XHJcbiAgfVxyXG5cclxuICBnZXRUbXNPcGVyYXRpb25zRnJvbUxheWVyKGxheWVyOiBSYXN0ZXJMYXllcik6IElPd3NPcGVyYXRpb25bXSB7XHJcbiAgICAvLyBAVE9ETzogd2hhdCBvcGVyYXRpb25zIGFyZSBkZWZpbmVkIG9uIFRNUz8gaHR0cHM6Ly93aWtpLm9zZ2VvLm9yZy93aWtpL1RpbGVfTWFwX1NlcnZpY2VfU3BlY2lmaWNhdGlvblxyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH1cclxuXHJcblxyXG4gIGdldFdmc09wZXJhdGlvbnNGcm9tTGF5ZXIobGF5ZXI6IFZlY3RvckxheWVyKTogSU93c09wZXJhdGlvbltdIHtcclxuXHJcbiAgICBsZXQgdXJsID0gbGF5ZXIudXJsO1xyXG4gICAgbGV0IGxheWVyTmFtZSA9IGxheWVyLm5hbWU7XHJcbiAgICBsZXQgdmVyc2lvbiA9IGxheWVyLm9wdGlvbnMudmVyc2lvbiA/IGxheWVyLm9wdGlvbnMudmVyc2lvbiA6ICcxLjEuMCc7XHJcblxyXG5cclxuICAgIGxldCBHZXRGZWF0dXJlOiBJT3dzT3BlcmF0aW9uID0ge1xyXG4gICAgICAnY29kZSc6ICdHZXRGZWF0dXJlJyxcclxuICAgICAgJ21ldGhvZCc6ICdHRVQnLFxyXG4gICAgICAndHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuICAgICAgJ2hyZWYnOiBgJHt1cmx9P3NlcnZpY2U9V0ZTJnZlcnNpb249JHt2ZXJzaW9ufSZyZXF1ZXN0PUdldEZlYXR1cmVgXHJcbiAgICB9O1xyXG5cclxuICAgIC8vIGxldCBEZXNjcmliZUZlYXR1cmVUeXBlOiBJT3dzT3BlcmF0aW9uID0gbnVsbDtcclxuICAgIC8vIGxldCBHZXRDYXBhYmlsaXRpZXM6IElPd3NPcGVyYXRpb24gPSBudWxsO1xyXG4gICAgLy8gbGV0IEdldFByb3BlcnR5VmFsdWU6IElPd3NPcGVyYXRpb24gPSBudWxsO1xyXG4gICAgLy8gbGV0IEdldEZlYXR1cmVXaXRoTG9jazogSU93c09wZXJhdGlvbiA9IG51bGw7XHJcbiAgICAvLyBsZXQgTG9ja0ZlYXR1cmU6IElPd3NPcGVyYXRpb24gPSBudWxsO1xyXG4gICAgLy8gbGV0IFRyYW5zYWN0aW9uOiBJT3dzT3BlcmF0aW9uID0gbnVsbDtcclxuICAgIC8vIGxldCBDcmVhdGVTdG9yZWRRdWVyeTogSU93c09wZXJhdGlvbiA9IG51bGw7XHJcbiAgICAvLyBsZXQgRHJvcFN0b3JlZFF1ZXJ5OiBJT3dzT3BlcmF0aW9uID0gbnVsbDtcclxuICAgIC8vIGxldCBMaXN0U3RvcmVkUXVlcmllczogSU93c09wZXJhdGlvbiA9IG51bGw7XHJcbiAgICAvLyBsZXQgRGVzY3JpYmVTdG9yZWRRdWVyaWVzOiBJT3dzT3BlcmF0aW9uID0gbnVsbDtcclxuXHJcbiAgICBsZXQgb3BlcmF0aW9ucyA9IFtcclxuICAgICAgR2V0RmVhdHVyZSxcclxuICAgICAgLy8gR2V0Q2FwYWJpbGl0aWVzLFxyXG4gICAgICAvLyBEZXNjcmliZUZlYXR1cmVUeXBlLFxyXG4gICAgICAvLyBHZXRQcm9wZXJ0eVZhbHVlLFxyXG4gICAgICAvLyBHZXRGZWF0dXJlV2l0aExvY2ssXHJcbiAgICAgIC8vIExvY2tGZWF0dXJlLFxyXG4gICAgICAvLyBUcmFuc2FjdGlvbixcclxuICAgICAgLy8gQ3JlYXRlU3RvcmVkUXVlcnksXHJcbiAgICAgIC8vIERyb3BTdG9yZWRRdWVyeSxcclxuICAgICAgLy8gTGlzdFN0b3JlZFF1ZXJpZXMsXHJcbiAgICAgIC8vIERlc2NyaWJlU3RvcmVkUXVlcmllc1xyXG4gICAgXTtcclxuXHJcbiAgICByZXR1cm4gb3BlcmF0aW9ucztcclxuICB9XHJcblxyXG5cclxuICBnZXRXbXNPcGVyYXRpb25zRnJvbUxheWVyKGxheWVyOiBSYXN0ZXJMYXllcik6IElPd3NPcGVyYXRpb25bXSB7XHJcblxyXG4gICAgbGV0IHVybCA9IGxheWVyLnVybDtcclxuICAgIGxldCB3bXNWZXJzaW9uID0gbGF5ZXIucGFyYW1zLlZFUlNJT047XHJcbiAgICBsZXQgbGF5ZXJOYW1lID0gbGF5ZXIubmFtZTtcclxuICAgIGxldCBsYXllcklkID0gbGF5ZXIuaWQ7XHJcbiAgICBsZXQgZm9ybWF0ID0gJ2ltYWdlL3ZuZC5qcGVnLXBuZyc7XHJcbiAgICBpZiAobGF5ZXIucGFyYW1zICYmIGxheWVyLnBhcmFtcy5GT1JNQVQpIGZvcm1hdCA9IGxheWVyLnBhcmFtcy5GT1JNQVQ7XHJcblxyXG4gICAgbGV0IGdldE1hcDogSU93c09wZXJhdGlvbiA9IHtcclxuICAgICAgJ2NvZGUnOiAnR2V0TWFwJyxcclxuICAgICAgJ21ldGhvZCc6ICdHRVQnLFxyXG4gICAgICAndHlwZSc6IGZvcm1hdCxcclxuICAgICAgJ2hyZWYnOiBgJHt1cmx9P3NlcnZpY2U9V01TJnZlcnNpb249JHt3bXNWZXJzaW9ufSZyZXF1ZXN0PUdldE1hcCZUUkFOU1BBUkVOVD1UUlVFJkxBWUVSUz0ke2xheWVySWR9JkZPUk1BVD0ke2Zvcm1hdH0mVElMRUQ9dHJ1ZWBcclxuICAgIH07XHJcblxyXG4gICAgbGV0IGdldENhcGFiaWxpdGllczogSU93c09wZXJhdGlvbiA9IHtcclxuICAgICAgJ2NvZGUnOiAnR2V0Q2FwYWJpbGl0aWVzJyxcclxuICAgICAgJ21ldGhvZCc6ICdHRVQnLFxyXG4gICAgICAndHlwZSc6ICdhcHBsaWNhdGlvbi94bWwnLFxyXG4gICAgICAnaHJlZic6IGAke3VybH0/c2VydmljZT1XTVMmdmVyc2lvbj0ke3dtc1ZlcnNpb259JnJlcXVlc3Q9R2V0Q2FwYWJpbGl0aWVzYFxyXG4gICAgfVxyXG5cclxuICAgIGxldCBnZXRGZWF0dXJlSW5mbzogSU93c09wZXJhdGlvbiA9IHtcclxuICAgICAgJ2NvZGUnOiAnR2V0RmVhdHVyZUluZm8nLFxyXG4gICAgICAnbWV0aG9kJzogJ0dFVCcsXHJcbiAgICAgICd0eXBlJzogJ3RleHQvaHRtbCcsXHJcbiAgICAgICdocmVmJzogYCR7dXJsfT9zZXJ2aWNlPVdNUyZ2ZXJzaW9uPSR7d21zVmVyc2lvbn0mcmVxdWVzdD1HZXRGZWF0dXJlSW5mbyZUUkFOU1BBUkVOVD1UUlVFJkxBWUVSUz0ke2xheWVySWR9JkZPUk1BVD0ke2Zvcm1hdH1gXHJcbiAgICB9XHJcblxyXG4gICAgbGV0IG9wZXJhdGlvbnM6IElPd3NPcGVyYXRpb25bXSA9IFtcclxuICAgICAgZ2V0TWFwLFxyXG4gICAgICBnZXRDYXBhYmlsaXRpZXMsXHJcbiAgICAgIGdldEZlYXR1cmVJbmZvXHJcbiAgICBdO1xyXG5cclxuICAgIHJldHVybiBvcGVyYXRpb25zO1xyXG4gIH1cclxuXHJcbiAgZ2V0V210c09wZXJhdGlvbnNGcm9tTGF5ZXIobGF5ZXI6IFJhc3RlckxheWVyKTogSU93c09wZXJhdGlvbltdIHtcclxuXHJcbiAgICBsZXQgdXJsID0gbGF5ZXIudXJsO1xyXG4gICAgbGV0IHdtdHNWZXJzaW9uID0gbGF5ZXIucGFyYW1zLnZlcnNpb247XHJcbiAgICBsZXQgbGF5ZXJOYW1lID0gbGF5ZXIubmFtZTtcclxuICAgIGxldCBsYXllcklkID0gbGF5ZXIuaWQ7XHJcbiAgICBsZXQgZm9ybWF0ID0gJ2ltYWdlL3ZuZC5qcGVnLXBuZyc7XHJcbiAgICBpZiAobGF5ZXIucGFyYW1zICYmIGxheWVyLnBhcmFtcy5GT1JNQVQpIGZvcm1hdCA9IGxheWVyLnBhcmFtcy5GT1JNQVQ7XHJcblxyXG4gICAgbGV0IGdldFRpbGU6IElPd3NPcGVyYXRpb24gPSB7XHJcbiAgICAgICdjb2RlJzogJ0dldFRpbGUnLFxyXG4gICAgICAnaHJlZic6IGAke3VybH0/U0VSVklDRT1XTVRTJlJFUVVFU1Q9R2V0VGlsZSZGT1JNQVQ9JHtmb3JtYXR9JkxBWUVSPSR7bGF5ZXJJZH0mVkVSU0lPTj0ke3dtdHNWZXJzaW9ufWAsXHJcbiAgICAgICdtZXRob2QnOiAnR0VUJyxcclxuICAgICAgJ3R5cGUnOiBmb3JtYXRcclxuICAgIH07XHJcblxyXG4gICAgbGV0IGdldENhcGFiaWxpdGllczogSU93c09wZXJhdGlvbiA9IHtcclxuICAgICAgJ2NvZGUnOiAnR2V0Q2FwYWJpbGl0aWVzJyxcclxuICAgICAgJ2hyZWYnOiBgJHt1cmx9P1NFUlZJQ0U9V01UUyZSRVFVRVNUPUdldENhcGFiaWxpdGllcyZWRVJTSU9OPSR7d210c1ZlcnNpb259YCxcclxuICAgICAgJ21ldGhvZCc6ICdHRVQnLFxyXG4gICAgICAndHlwZSc6ICdhcHBsaWNhdGlvbi94bWwnXHJcbiAgICB9XHJcblxyXG4gICAgLy8gTm90ZTogd2UgZGVsaWJlcmF0ZWx5IHVzZSB0aGUgV01TIHByb3RvY29sIGhlcmUgaW5zdGVhZCBvZiBXTVRTLlxyXG4gICAgLy8gUmVhc29uOiBXTVRTIGRlbGl2ZXJzIFJHQi12YWx1ZXMsIHdoZXJhcyBXTVMgZGVsaXZlcnMgdGhlIGFjdHVhbCB2YWx1ZSB0aGF0IHdhcyB1c2VkIHRvIGNyZWF0ZSBhIHRpbGUuXHJcbiAgICBsZXQgZ2V0RmVhdHVyZUluZm86IElPd3NPcGVyYXRpb24gPSB7XHJcbiAgICAgICdjb2RlJzogJ0dldEZlYXR1cmVJbmZvJyxcclxuICAgICAgJ2hyZWYnOiBgJHt1cmx9P1NFUlZJQ0U9V01TJlJFUVVFU1Q9R2V0RmVhdHVyZUluZm8mVkVSU0lPTj0ke3dtdHNWZXJzaW9ufWAsXHJcbiAgICAgICdtZXRob2QnOiAnR0VUJyxcclxuICAgICAgJ3R5cGUnOiAndGV4dC9odG1sJ1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBvcGVyYXRpb25zOiBJT3dzT3BlcmF0aW9uW10gPSBbXHJcbiAgICAgIGdldFRpbGUsXHJcbiAgICAgIGdldENhcGFiaWxpdGllcyxcclxuICAgICAgZ2V0RmVhdHVyZUluZm9cclxuICAgIF07XHJcblxyXG4gICAgcmV0dXJuIG9wZXJhdGlvbnM7XHJcbiAgfVxyXG59XHJcbiJdfQ==