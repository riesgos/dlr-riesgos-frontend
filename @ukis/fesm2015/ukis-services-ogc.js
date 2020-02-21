import { Injectable, ɵɵdefineInjectable, ɵɵinject, Inject, NgModule } from '@angular/core';
import { WmsLayertype, WmtsLayertype, WfsLayertype, GeojsonLayertype, XyzLayertype, isRasterLayertype, isVectorLayertype, VectorLayer, CustomLayertype, WmtsLayer, WmsLayer, RasterLayer } from '@ukis/services-layers';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Jsonix } from '@boundlessgeo/jsonix';
import { map, tap, mergeMap, retryWhen, delay, switchMap, share } from 'rxjs/operators';
import { XLink_1_0 as XLink_1_0$2 } from 'w3c-schemas/lib/XLink_1_0';
import { OWS_1_1_0 as OWS_1_1_0$2 } from 'ogc-schemas/lib/OWS_1_1_0';
import { SMIL_2_0 as SMIL_2_0$1 } from 'ogc-schemas/lib/SMIL_2_0';
import { SMIL_2_0_Language as SMIL_2_0_Language$1 } from 'ogc-schemas/lib/SMIL_2_0_Language';
import { GML_3_1_1 as GML_3_1_1$1 } from 'ogc-schemas/lib/GML_3_1_1';
import { WMTS_1_0 as WMTS_1_0$1 } from 'ogc-schemas/lib/WMTS_1_0';
import { forkJoin, of, timer } from 'rxjs';
import { OWS_2_0 as OWS_2_0$1 } from 'ogc-schemas/lib/OWS_2_0';
import { WPS_1_0_0 as WPS_1_0_0$1 } from 'ogc-schemas/lib/WPS_1_0_0';
import { WPS_2_0 as WPS_2_0$1 } from 'ogc-schemas/lib/WPS_2_0';

/**
 * @fileoverview added by tsickle
 * Generated from: lib/wmts/wmtsclient.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const XLink_1_0 = XLink_1_0$2;
/** @type {?} */
const OWS_1_1_0 = OWS_1_1_0$2;
/** @type {?} */
const SMIL_2_0 = SMIL_2_0$1;
/** @type {?} */
const SMIL_2_0_Language = SMIL_2_0_Language$1;
/** @type {?} */
const GML_3_1_1 = GML_3_1_1$1;
/** @type {?} */
const WMTS_1_0 = WMTS_1_0$1;
class WmtsClientService {
    /**
     * @param {?} http
     */
    constructor(http) {
        this.http = http;
        /** @type {?} */
        const context = new Jsonix.Context([SMIL_2_0, SMIL_2_0_Language, GML_3_1_1, XLink_1_0, OWS_1_1_0, WMTS_1_0]);
        this.xmlunmarshaller = context.createUnmarshaller();
        this.xmlmarshaller = context.createMarshaller();
    }
    /**
     * @param {?} url
     * @param {?=} version
     * @return {?}
     */
    getCapabilities(url, version = '1.1.0') {
        // example: https://tiles.geoservice.dlr.de/service/wmts?SERVICE=WMTS&REQUEST=GetCapabilities&VERSION=1.1.0
        /** @type {?} */
        const getCapabilitiesUrl = `${url}?SERVICE=WMTS&REQUEST=GetCapabilities&VERSION=${version}`;
        /** @type {?} */
        const headers = new HttpHeaders({
            'Content-Type': 'text/xml',
            'Accept': 'text/xml, application/xml'
        });
        return this.http.get(getCapabilitiesUrl, { headers, responseType: 'text' }).pipe(map((/**
         * @param {?} response
         * @return {?}
         */
        response => {
            return this.xmlunmarshaller.unmarshalString(response);
        })));
    }
}
WmtsClientService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
WmtsClientService.ctorParameters = () => [
    { type: HttpClient }
];
/** @nocollapse */ WmtsClientService.ngInjectableDef = ɵɵdefineInjectable({ factory: function WmtsClientService_Factory() { return new WmtsClientService(ɵɵinject(HttpClient)); }, token: WmtsClientService, providedIn: "root" });
if (false) {
    /**
     * @type {?}
     * @private
     */
    WmtsClientService.prototype.xmlmarshaller;
    /**
     * @type {?}
     * @private
     */
    WmtsClientService.prototype.xmlunmarshaller;
    /**
     * @type {?}
     * @private
     */
    WmtsClientService.prototype.http;
}

/**
 * @fileoverview added by tsickle
 * Generated from: lib/owc/owc-json.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @param {?} str
 * @return {?}
 */
function isWmsOffering(str) {
    return str === 'http://www.opengis.net/spec/owc-geojson/1.0/req/wms'
        || str === 'http://schemas.opengis.net/wms/1.1.1'
        || str === 'http://schemas.opengis.net/wms/1.1.0';
}
/**
 * @param {?} str
 * @return {?}
 */
function isWfsOffering(str) {
    return str === 'http://www.opengis.net/spec/owc-geojson/1.0/req/wfs';
}
/**
 * @param {?} str
 * @return {?}
 */
function isWpsOffering(str) {
    return str === 'http://www.opengis.net/spec/owc-geojson/1.0/req/wcs';
}
/**
 * @param {?} str
 * @return {?}
 */
function isCswOffering(str) {
    return str === 'http://www.opengis.net/spec/owc-geojson/1.0/req/csw';
}
/**
 * @param {?} str
 * @return {?}
 */
function isWmtsOffering(str) {
    return str === 'http://www.opengis.net/spec/owc-geojson/1.0/req/wmts'
        || str === 'http://schemas.opengis.net/wmts/1.0.0'
        || str === 'http://schemas.opengis.net/wmts/1.1.0';
}
/**
 * @param {?} str
 * @return {?}
 */
function isGmlOffering(str) {
    return str === 'http://www.opengis.net/spec/owc-geojson/1.0/req/gml';
}
/**
 * @param {?} str
 * @return {?}
 */
function isKmlOffering(str) {
    return str === 'http://www.opengis.net/spec/owc-geojson/1.0/req/kml';
}
/**
 * @param {?} str
 * @return {?}
 */
function isGeoTIFFOffering(str) {
    return str === 'http://www.opengis.net/spec/owc-geojson/1.0/req/geotiff';
}
/**
 * @param {?} str
 * @return {?}
 */
function isGMLJP2Offering(str) {
    return str === 'http://www.opengis.net/spec/owc-geojson/1.0/req/gmljp2';
}
/**
 * @param {?} str
 * @return {?}
 */
function isGMLCOVOffering(str) {
    return str === 'http://www.opengis.net/spec/owc-geojson/1.0/req/gmlcov';
}
/**
 * @param {?} str
 * @return {?}
 */
function isXyzOffering(str) {
    return str === 'http://www.opengis.net/spec/owc-geojson/1.0/req/xyz';
}
/**
 * @param {?} str
 * @return {?}
 */
function isGeoJsonOffering(str) {
    return str === 'http://www.opengis.net/spec/owc-geojson/1.0/req/geojson';
}
/**
 * @param {?} v
 * @return {?}
 */
function shardsExpand(v) {
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
class OwcJsonService {
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
/** @nocollapse */ OwcJsonService.ngInjectableDef = ɵɵdefineInjectable({ factory: function OwcJsonService_Factory() { return new OwcJsonService(ɵɵinject(WmtsClientService)); }, token: OwcJsonService, providedIn: "root" });
if (false) {
    /**
     * @type {?}
     * @private
     */
    OwcJsonService.prototype.wmtsClient;
}

/**
 * @fileoverview added by tsickle
 * Generated from: lib/wps/wps100/wps_marshaller_1.0.0.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class WpsMarshaller100 {
    constructor() { }
    /**
     * @param {?} baseurl
     * @return {?}
     */
    getCapabilitiesUrl(baseurl) {
        return `${baseurl}?service=WPS&request=GetCapabilities&version=1.0.0`;
    }
    /**
     * @param {?} baseurl
     * @param {?} processId
     * @return {?}
     */
    executeUrl(baseurl, processId) {
        return `${baseurl}?service=WPS&request=Execute&version=1.0.0&identifier=${processId}`;
    }
    /**
     * @param {?} capabilities
     * @return {?}
     */
    unmarshalCapabilities(capabilities) {
        /** @type {?} */
        const out = [];
        capabilities.processOfferings.process.forEach((/**
         * @param {?} process
         * @return {?}
         */
        process => {
            out.push({
                id: process.identifier.value
            });
        }));
        return out;
    }
    /**
     * @param {?} responseJson
     * @param {?} url
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputDescriptions
     * @return {?}
     */
    unmarshalSyncExecuteResponse(responseJson, url, processId, inputs, outputDescriptions) {
        /** @type {?} */
        const out = [];
        if (responseJson.value.status.processFailed) { // Failure?
            out.push({
                description: {
                    id: responseJson.value.process.identifier.value,
                    reference: true,
                    type: 'error'
                },
                value: responseJson.value.statusLocation
            });
        }
        else if (responseJson.value.processOutputs) { // synchronous request?
            for (const output of responseJson.value.processOutputs.output) {
                /** @type {?} */
                const isReference = output.reference ? true : false;
                /** @type {?} */
                let datatype;
                /** @type {?} */
                let data;
                /** @type {?} */
                let format;
                if (output.reference) {
                    datatype = 'complex';
                    data = output.reference.href || null;
                    format = (/** @type {?} */ (output.reference.mimeType));
                }
                else {
                    if (output.data && output.data.literalData) {
                        datatype = 'literal';
                        format = (/** @type {?} */ (output.data.literalData.dataType));
                    }
                    else if (output.data && output.data.complexData) {
                        datatype = 'complex';
                        format = (/** @type {?} */ (output.data.complexData.mimeType));
                    }
                    else {
                        datatype = 'bbox';
                        format = undefined;
                    }
                    // @ts-ignore
                    data = this.unmarshalOutputData(output.data);
                }
                out.push({
                    description: {
                        id: output.identifier.value,
                        format: format,
                        reference: isReference,
                        type: datatype
                    },
                    value: data,
                });
            }
        }
        else if (responseJson.value.statusLocation) { // asynchronous request?
            out.push({
                description: {
                    id: responseJson.value.process.identifier.value,
                    reference: true,
                    type: 'status'
                },
                value: this.unmarshalGetStateResponse(responseJson, url, processId, inputs, outputDescriptions)
            });
        }
        return out;
    }
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    unmarshalOutputData(data) {
        if (data.complexData) {
            switch (data.complexData.mimeType) {
                case 'application/vnd.geo+json':
                case 'application/json':
                    return data.complexData.content.map((/**
                     * @param {?} cont
                     * @return {?}
                     */
                    cont => JSON.parse(cont)));
                case 'application/WMS':
                    return data.complexData.content;
                case 'text/xml':
                    return new XMLSerializer().serializeToString(data.complexData.content[0]); // @TODO: better: handle actual xml-data
                default:
                    throw new Error(`Cannot unmarshal data of format ${data.complexData.mimeType}`);
            }
        }
        else if (data.literalData) {
            switch (data.literalData.dataType) {
                case 'string':
                default:
                    return data.literalData.value;
            }
        }
        throw new Error(`Not yet implemented: ${data}`);
    }
    /**
     * @param {?} responseJson
     * @param {?} url
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputDescriptions
     * @return {?}
     */
    unmarshalAsyncExecuteResponse(responseJson, url, processId, inputs, outputDescriptions) {
        return this.unmarshalGetStateResponse(responseJson, url, processId, inputs, outputDescriptions);
    }
    /**
     * @param {?} responseJson
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputDescriptions
     * @return {?}
     */
    unmarshalGetStateResponse(responseJson, serverUrl, processId, inputs, outputDescriptions) {
        /** @type {?} */
        const response = responseJson.value;
        /** @type {?} */
        const status = response.status.processSucceeded ? 'Succeeded' :
            response.status.processAccepted ? 'Accepted' :
                response.status.processStarted ? 'Running' :
                    response.status.processFailed ? 'Failed' :
                        'Failed';
        /** @type {?} */
        const state = {
            status: status,
            statusLocation: response.statusLocation,
        };
        if (response.processOutputs && response.processOutputs.output) {
            state.results = this.unmarshalSyncExecuteResponse(responseJson, serverUrl, processId, inputs, outputDescriptions);
        }
        return state;
    }
    /**
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputs
     * @param {?} async
     * @return {?}
     */
    marshalExecBody(processId, inputs, outputs, async) {
        /** @type {?} */
        const wps1Inputs = this.marshalInputs(inputs);
        /** @type {?} */
        const wps1ResponseForm = this.marshalResponseForm(outputs, async);
        /** @type {?} */
        const bodyValue = {
            dataInputs: wps1Inputs,
            identifier: processId,
            responseForm: wps1ResponseForm,
            service: 'WPS',
            version: '1.0.0'
        };
        /** @type {?} */
        const body = {
            name: {
                key: '{http://www.opengis.net/wps/1.0.0}Execute',
                localPart: 'Execute',
                namespaceURI: 'http://www.opengis.net/wps/1.0.0',
                prefix: 'wps',
                string: '{http://www.opengis.net/wps/1.0.0}wps:Execute'
            },
            value: bodyValue
        };
        return body;
    }
    /**
     * @protected
     * @param {?} outputs
     * @param {?=} async
     * @return {?}
     */
    marshalResponseForm(outputs, async = false) {
        /** @type {?} */
        const outputDefinitions = [];
        for (const output of outputs) {
            /** @type {?} */
            let defType;
            switch (output.type) {
                case 'literal':
                    defType = {
                        identifier: { value: output.id },
                        asReference: output.reference,
                        mimeType: output.format
                    };
                    break;
                case 'complex':
                    defType = {
                        identifier: { value: output.id },
                        asReference: output.reference,
                        mimeType: output.format
                    };
                    break;
                default:
                    throw new Error(`This Wps-outputtype has not been implemented yet! ${output} `);
            }
            outputDefinitions.push(defType);
        }
        /** @type {?} */
        const responseDocument = {
            output: outputDefinitions,
            status: async ? true : false,
            storeExecuteResponse: async ? true : false
        };
        /** @type {?} */
        const form = {
            responseDocument
        };
        return form;
    }
    /**
     * @protected
     * @param {?} inputArr
     * @return {?}
     */
    marshalInputs(inputArr) {
        /** @type {?} */
        const theInputs = [];
        for (const inp of inputArr) {
            if (inp.value === null || inp.value === undefined) {
                throw new Error(`Value for input ${inp.description.id} is not set`);
            }
            /** @type {?} */
            const marshalledInput = this.marshalInput(inp);
            theInputs.push(marshalledInput);
        }
        /** @type {?} */
        const inputs = {
            input: theInputs
        };
        return inputs;
    }
    /**
     * @protected
     * @param {?} input
     * @return {?}
     */
    marshalInput(input) {
        /** @type {?} */
        const id = input.description.id;
        /** @type {?} */
        const title = input.description.id;
        /** @type {?} */
        const abstract = '';
        /** @type {?} */
        const inputType = {
            identifier: { value: id },
            title: { value: title },
            _abstract: { value: abstract }
        };
        if (input.description.reference) {
            inputType.reference = this.marshalReferenceInput(input);
        }
        else {
            inputType.data = this.marshalDataInput(input);
        }
        return inputType;
    }
    /**
     * @protected
     * @param {?} input
     * @return {?}
     */
    marshalDataInput(input) {
        /** @type {?} */
        let data;
        switch (input.description.type) {
            case 'literal':
                data = {
                    literalData: { value: String(input.value) }
                };
                break;
            case 'bbox':
                /** @type {?} */
                const values = input.value;
                data = {
                    boundingBoxData: {
                        lowerCorner: [values.lllat, values.lllon],
                        upperCorner: [values.urlat, values.urlon]
                    }
                };
                break;
            case 'complex':
                switch (input.description.format) {
                    case 'text/xml':
                        data = {
                            complexData: {
                                content: [input.value],
                                // @TODO: we assume here that text/xml-data is already stringified
                                mimeType: input.description.format
                            }
                        };
                        break;
                    default:
                        data = {
                            complexData: {
                                content: [JSON.stringify(input.value)],
                                mimeType: input.description.format
                            }
                        };
                }
                break;
            default:
                throw Error(`This input is of type ${input.description.type}. We can only marshal input of type literal, bbox or complex.`);
        }
        return data;
    }
    /**
     * @protected
     * @param {?} input
     * @return {?}
     */
    marshalReferenceInput(input) {
        /** @type {?} */
        const ref = {
            href: input.value,
            method: 'GET',
            mimeType: input.description.format
        };
        return ref;
    }
    /**
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} statusId
     * @return {?}
     */
    marshallGetStatusBody(serverUrl, processId, statusId) {
        // WPS-1.0 does not send a body with a GetStatus request.
        return {};
    }
    /**
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} jobID
     * @return {?}
     */
    marshallGetResultBody(serverUrl, processId, jobID) {
        // WPS-1.0 does not send a body with a GetStatus request.
        return {};
    }
    /**
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} jobId
     * @return {?}
     */
    dismissUrl(serverUrl, processId, jobId) {
        /** this does only work in geoserver:
        return `${serverUrl}?service=WPS&version=1.0.0&request=Dismiss&executionId=${jobId}`; */
        throw new Error('Wps 1.0 does not support Dismiss-operations.');
    }
    /**
     * @param {?} processId
     * @return {?}
     */
    marshalDismissBody(processId) {
        throw new Error('Wps 1.0 does not support Dismiss-operations.');
    }
    /**
     * @param {?} jsonResponse
     * @param {?} serverUrl
     * @param {?} processId
     * @return {?}
     */
    unmarshalDismissResponse(jsonResponse, serverUrl, processId) {
        throw new Error('Wps 1.0 does not support Dismiss-operations.');
    }
}

/**
 * @fileoverview added by tsickle
 * Generated from: lib/wps/wps200/helpers.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const isStatusInfo = (/**
 * @param {?} obj
 * @return {?}
 */
(obj) => {
    return obj.hasOwnProperty('jobID')
        && obj.hasOwnProperty('status');
});
/** @type {?} */
const isDataOutputType = (/**
 * @param {?} obj
 * @return {?}
 */
(obj) => {
    return obj.hasOwnProperty('id') &&
        (obj.hasOwnProperty('data') || obj.hasOwnProperty('reference') || obj.hasOwnProperty('output'));
});
/** @type {?} */
const isResult = (/**
 * @param {?} obj
 * @return {?}
 */
(obj) => {
    return (obj.hasOwnProperty('output') && typeof obj['output'] === 'object');
});

/**
 * @fileoverview added by tsickle
 * Generated from: lib/wps/wps200/wps_marshaller_2.0.0.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class WpsMarshaller200 {
    constructor() { }
    /**
     * @param {?} baseurl
     * @return {?}
     */
    getCapabilitiesUrl(baseurl) {
        return `${baseurl}?service=WPS&request=GetCapabilities&version=2.0.0`;
    }
    /**
     * @param {?} baseurl
     * @param {?} processId
     * @return {?}
     */
    executeUrl(baseurl, processId) {
        return `${baseurl}?service=WPS&request=Execute&version=2.0.0&identifier=${processId}`;
    }
    /**
     * @param {?} capabilities
     * @return {?}
     */
    unmarshalCapabilities(capabilities) {
        /** @type {?} */
        const out = [];
        capabilities.contents.processSummary.forEach((/**
         * @param {?} summary
         * @return {?}
         */
        summary => {
            out.push({
                id: summary.identifier.value
            });
        }));
        return out;
    }
    /**
     * @param {?} responseJson
     * @param {?} url
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputDescriptions
     * @return {?}
     */
    unmarshalSyncExecuteResponse(responseJson, url, processId, inputs, outputDescriptions) {
        /** @type {?} */
        const out = [];
        if (isResult(responseJson.value)) {
            for (const output of responseJson.value.output) {
                /** @type {?} */
                const outputDescription = outputDescriptions.find((/**
                 * @param {?} od
                 * @return {?}
                 */
                od => od.id === output.id));
                if (!outputDescription) {
                    throw new Error(`Could not find an output-description for the parameter ${output.id}.`);
                }
                /** @type {?} */
                const isReference = outputDescription.reference;
                /** @type {?} */
                const datatype = outputDescription.type;
                /** @type {?} */
                const format = outputDescription.format;
                /** @type {?} */
                let data;
                if (output.reference) {
                    data = output.reference.href || null;
                }
                else if (output.data) {
                    data = this.unmarshalOutputData(output.data, outputDescription);
                }
                else {
                    throw new Error(`Output has neither reference nor data field.`);
                }
                out.push({
                    description: {
                        id: output.id,
                        format: format,
                        reference: isReference,
                        type: datatype
                    },
                    value: data,
                });
            }
        }
        else if (isStatusInfo(responseJson.value)) {
            /** @type {?} */
            const state = {
                status: responseJson.value.status,
                jobID: responseJson.value.jobID,
                percentCompleted: responseJson.value.percentCompleted
            };
            out.push({
                description: {
                    id: processId,
                    reference: true,
                    type: 'status'
                },
                value: state
            });
        }
        return out;
    }
    /**
     * @protected
     * @param {?} data
     * @param {?} description
     * @return {?}
     */
    unmarshalOutputData(data, description) {
        if (description.type === 'complex') {
            switch (data.mimeType) {
                case 'application/vnd.geo+json':
                case 'application/json':
                    return data.content.map((/**
                     * @param {?} cont
                     * @return {?}
                     */
                    (cont) => JSON.parse(cont)));
                case 'application/WMS':
                    return data.content;
                case 'text/xml':
                    return new XMLSerializer().serializeToString(data.content[0]); // @TODO: better: handle actual xml-data
                default:
                    throw new Error(`Cannot unmarshal complex data of format ${data.mimeType}`);
            }
        }
        else if (description.type === 'literal') {
            return data.content;
        }
        throw new Error(`Not yet implemented: ${data}`);
    }
    /**
     * @param {?} responseJson
     * @param {?} url
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputDescriptions
     * @return {?}
     */
    unmarshalAsyncExecuteResponse(responseJson, url, processId, inputs, outputDescriptions) {
        return this.unmarshalGetStateResponse(responseJson, url, processId, inputs, outputDescriptions);
    }
    /**
     * @param {?} responseJson
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputDescriptions
     * @return {?}
     */
    unmarshalGetStateResponse(responseJson, serverUrl, processId, inputs, outputDescriptions) {
        if (isStatusInfo(responseJson.value)) {
            /** @type {?} */
            const state = {
                status: responseJson.value.status,
                jobID: responseJson.value.jobID,
                percentCompleted: responseJson.value.percentCompleted
            };
            return state;
        }
        else {
            throw new Error(`Not a status-info: ${responseJson}`);
        }
    }
    /**
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputs
     * @param {?} async
     * @return {?}
     */
    marshalExecBody(processId, inputs, outputs, async) {
        /** @type {?} */
        const inputsMarshalled = this.marshalInputs(inputs);
        /** @type {?} */
        const outputsMarshalled = this.marshalOutputs(outputs);
        /** @type {?} */
        const bodyValue = {
            TYPE_NAME: 'WPS_2_0.ExecuteRequestType',
            service: 'WPS',
            version: '2.0.0',
            identifier: { value: processId },
            input: inputsMarshalled,
            output: outputsMarshalled,
            mode: async ? 'async' : 'sync',
            response: 'document'
        };
        /** @type {?} */
        const body = {
            name: {
                key: '{http://www.opengis.net/wps/2.0}Execute',
                localPart: 'Execute',
                namespaceURI: 'http://www.opengis.net/wps/2.0',
                prefix: 'wps',
                string: '{http://www.opengis.net/wps/2.0}wps:Execute'
            },
            value: bodyValue
        };
        return body;
    }
    /**
     * @private
     * @param {?} inputs
     * @return {?}
     */
    marshalInputs(inputs) {
        return inputs.map((/**
         * @param {?} i
         * @return {?}
         */
        i => {
            if (i.description.reference) {
                return {
                    id: i.description.id,
                    reference: {
                        href: i.value,
                        mimeType: i.description.format,
                    }
                };
            }
            else {
                return {
                    id: i.description.id,
                    data: {
                        content: [JSON.stringify(i.value)],
                        mimeType: i.description.format
                    }
                };
            }
        }));
    }
    /**
     * @private
     * @param {?} outputs
     * @return {?}
     */
    marshalOutputs(outputs) {
        return outputs.map((/**
         * @param {?} o
         * @return {?}
         */
        o => {
            return {
                id: o.id,
                mimeType: o.format,
                transmission: o.reference ? 'reference' : 'value' // @TODO: maybe just comment out this line?
            };
        }));
    }
    /**
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} statusId
     * @return {?}
     */
    marshallGetStatusBody(serverUrl, processId, statusId) {
        /** @type {?} */
        const request = {
            name: {
                key: '{http://www.opengis.net/wps/2.0}GetStatus',
                localPart: 'GetStatus',
                namespaceURI: 'http://www.opengis.net/wps/2.0',
                prefix: 'wps',
                string: '{http://www.opengis.net/wps/2.0}wps:GetStatus'
            },
            value: {
                jobID: statusId,
                service: 'WPS',
                version: '2.0.0'
            }
        };
        return request;
    }
    /**
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} jobID
     * @return {?}
     */
    marshallGetResultBody(serverUrl, processId, jobID) {
        /** @type {?} */
        const request = {
            name: {
                key: '{http://www.opengis.net/wps/2.0}GetResult',
                localPart: 'GetResult',
                namespaceURI: 'http://www.opengis.net/wps/2.0',
                prefix: 'wps',
                string: '{http://www.opengis.net/wps/2.0}wps:GetResult'
            },
            value: {
                service: 'WPS',
                version: '2.0.0',
                jobID: jobID
            }
        };
        return request;
    }
    /**
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} jobId
     * @return {?}
     */
    dismissUrl(serverUrl, processId, jobId) {
        return serverUrl;
    }
    /**
     * @param {?} jobId
     * @return {?}
     */
    marshalDismissBody(jobId) {
        /** @type {?} */
        const body = {
            name: {
                key: '{http://www.opengis.net/wps/2.0}Dismiss',
                localPart: 'Dismiss',
                namespaceURI: 'http://www.opengis.net/wps/2.0',
                prefix: 'wps',
                string: '{http://www.opengis.net/wps/2.0}wps:Dismiss'
            },
            value: {
                jobID: jobId,
                service: 'WPS',
                version: '2.0.0'
            }
        };
        return body;
    }
    /**
     * @param {?} jsonResponse
     * @param {?} serverUrl
     * @param {?} processId
     * @return {?}
     */
    unmarshalDismissResponse(jsonResponse, serverUrl, processId) {
        /** @type {?} */
        const state = {
            status: jsonResponse.value.status,
            jobID: jsonResponse.value.jobID
        };
        return state;
    }
}

/**
 * @fileoverview added by tsickle
 * Generated from: lib/wps/utils/polling.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @template T
 * @param {?} task$
 * @param {?} predicate
 * @param {?=} doWhile
 * @param {?=} minWaitTime
 * @return {?}
 */
function pollUntil(task$, predicate, doWhile, minWaitTime = 1000) {
    if (doWhile) {
        doWhile(null);
    }
    /** @type {?} */
    const tappedTask$ = task$.pipe(tap((/**
     * @param {?} r
     * @return {?}
     */
    (r) => {
        if (doWhile) {
            doWhile(r);
        }
    })));
    /** @type {?} */
    const requestTakesAtLeast$ = forkJoin(tappedTask$, timer(minWaitTime)).pipe(map((/**
     * @param {?} r
     * @return {?}
     */
    r => r[0])));
    /** @type {?} */
    const polledRequest$ = requestTakesAtLeast$.pipe(mergeMap((/**
     * @param {?} response
     * @return {?}
     */
    (response) => {
        if (predicate(response)) {
            // console.log(`obtained correct answer ${response}`);
            return of(response);
        }
        else {
            // console.log(`obtained false answer ${response}. trying again...`);
            return polledRequest$;
        }
    })));
    return polledRequest$;
}
/**
 * @param {?} delayMs
 * @param {?=} maxRetries
 * @return {?}
 */
function delayedRetry(delayMs, maxRetries = 3) {
    /** @type {?} */
    let attempts = 1;
    return (/**
     * @param {?} src$
     * @return {?}
     */
    (src$) => {
        return src$.pipe(
        // If an error occurs ...
        retryWhen((/**
         * @param {?} error$
         * @return {?}
         */
        (error$) => {
            return error$.pipe(delay(delayMs), // <- in any case, first wait a little while ...
            mergeMap((/**
             * @param {?} error
             * @return {?}
             */
            (error) => {
                if (error.status && error.status === 400) {
                    // In case of a server error, repeating won't help.
                    throw error;
                }
                else if (attempts <= maxRetries) {
                    console.log('http-error. Retrying ...');
                    attempts += 1;
                    return of(error); // <- an observable causes request to be retried
                }
                else {
                    console.log(`Persistent http-errors after ${attempts} attempts. Giving up.`);
                    throw error; // an error causes request to be given up on.
                }
            })));
        })));
    });
}

/**
 * @fileoverview added by tsickle
 * Generated from: lib/wps/cache.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @record
 */
function Cache() { }
if (false) {
    /**
     * @param {?} input
     * @param {?} output
     * @return {?}
     */
    Cache.prototype.set = function (input, output) { };
    /**
     * @param {?} input
     * @return {?}
     */
    Cache.prototype.get = function (input) { };
}
class FakeCache {
    /**
     * @param {?} input
     * @param {?} output
     * @return {?}
     */
    set(input, output) {
    }
    /**
     * @param {?} input
     * @return {?}
     */
    get(input) {
        return of(null);
    }
}

/**
 * @fileoverview added by tsickle
 * Generated from: lib/wps/wpsclient.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const XLink_1_0$1 = XLink_1_0$2;
/** @type {?} */
const OWS_1_1_0$1 = OWS_1_1_0$2;
/** @type {?} */
const OWS_2_0 = OWS_2_0$1;
/** @type {?} */
const WPS_1_0_0 = WPS_1_0_0$1;
/** @type {?} */
const WPS_2_0 = WPS_2_0$1;
/**
 * The Wps-client abstracts away the differences between Wps1.0.0 and Wps2.0.0
 * There are two layers of marshalling:
 *  - the Wps-marshaller marshals user-facing data to wps-specific types
 *  - Jsonix marshals wps-specific data to xml.
 * user-facing data -> wpsmarshaller -> Wps-type-specific data -> Jsonix-marhsaller -> XML ->
 * -> webclient -> WPS -> XML -> Jsonix-unmarshaller -> Wps-type-specific data -> wpsmarshaller -> user-facing data
 */
class WpsClient {
    /**
     * @param {?=} version
     * @param {?=} webclient
     * @param {?=} cache
     */
    constructor(version = '1.0.0', webclient, cache) {
        this.webclient = webclient;
        this.cache = new FakeCache();
        this.version = version;
        if (cache)
            this.cache = cache;
        /** @type {?} */
        let context;
        if (this.version === '1.0.0') {
            this.wpsmarshaller = new WpsMarshaller100();
            context = new Jsonix.Context([XLink_1_0$1, OWS_1_1_0$1, WPS_1_0_0]);
        }
        else if (this.version === '2.0.0') {
            this.wpsmarshaller = new WpsMarshaller200();
            context = new Jsonix.Context([XLink_1_0$1, OWS_2_0, WPS_2_0]);
        }
        else {
            throw new Error('You entered a WPS version other than 1.0.0 or 2.0.0.');
        }
        this.xmlunmarshaller = context.createUnmarshaller();
        this.xmlmarshaller = context.createMarshaller();
    }
    /**
     * @param {?} url
     * @return {?}
     */
    getCapabilities(url) {
        /** @type {?} */
        const getCapabilitiesUrl = this.wpsmarshaller.getCapabilitiesUrl(url);
        return this.getRaw(getCapabilitiesUrl).pipe(map((/**
         * @param {?} response
         * @return {?}
         */
        (response) => {
            /** @type {?} */
            const responseJson = this.xmlunmarshaller.unmarshalString(response);
            return this.wpsmarshaller.unmarshalCapabilities(responseJson.value);
        })) // @TODO: handle case when instead of WpsCapabilites an ExceptionReport is returned
        );
    }
    /**
     * @param {?} processId
     * @return {?}
     */
    describeProcess(processId) {
        throw new Error('Not implemented yet');
    }
    /**
     * @param {?} url
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputs
     * @param {?=} pollingRate
     * @param {?=} tapFunction
     * @return {?}
     */
    executeAsync(url, processId, inputs, outputs, pollingRate = 1000, tapFunction) {
        /** @type {?} */
        const executeRequest$ = this.executeAsyncS(url, processId, inputs, outputs);
        /** @type {?} */
        const query$ = executeRequest$.pipe(
        // poll until suceeded
        mergeMap((/**
         * @param {?} currentState
         * @return {?}
         */
        (currentState) => {
            /** @type {?} */
            const nextState$ = this.getNextState(currentState, url, processId, inputs, outputs);
            /** @type {?} */
            const poll$ = pollUntil(nextState$, (/**
             * @param {?} response
             * @return {?}
             */
            (response) => {
                return response.status === 'Succeeded';
            }), tapFunction, pollingRate);
            return poll$;
        })), 
        // fetch results
        mergeMap((/**
         * @param {?} lastState
         * @return {?}
         */
        (lastState) => {
            return this.fetchResults(lastState, url, processId, inputs, outputs);
        })), 
        // In case of errors:
        tap((/**
         * @param {?} response
         * @return {?}
         */
        (response) => {
            for (const result of response) {
                if (result.description.type === 'error') {
                    console.log('server responded with 200, but body contained an error-result: ', result);
                    throw new Error(result.value);
                }
            }
        })));
        return this.cachedQuery(url, processId, inputs, outputs, query$);
    }
    /**
     * @private
     * @param {?} url
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputs
     * @param {?} query$
     * @return {?}
     */
    cachedQuery(url, processId, inputs, outputs, query$) {
        /** @type {?} */
        const cachedResponse$ = this.cache.get({ url, processId, inputs, outputs });
        return cachedResponse$.pipe(switchMap((/**
         * @param {?} results
         * @return {?}
         */
        (results) => {
            if (results) {
                return of(results);
            }
            else {
                return query$.pipe(tap((/**
                 * @param {?} response
                 * @return {?}
                 */
                (response) => {
                    this.cache.set({ url, processId, inputs, outputs }, response);
                })));
            }
        })));
    }
    /**
     * @private
     * @param {?} currentState
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputDescriptions
     * @return {?}
     */
    getNextState(currentState, serverUrl, processId, inputs, outputDescriptions) {
        /** @type {?} */
        let request$;
        if (this.version === '1.0.0') {
            if (!currentState.statusLocation) {
                throw Error('No status location');
            }
            request$ = this.getRaw(currentState.statusLocation);
        }
        else if (this.version === '2.0.0') {
            if (!currentState.jobID) {
                throw Error('No job-Id');
            }
            /** @type {?} */
            const execbody = this.wpsmarshaller.marshallGetStatusBody(serverUrl, processId, currentState.jobID);
            /** @type {?} */
            const xmlExecbody = this.xmlmarshaller.marshalString(execbody);
            request$ = this.postRaw(serverUrl, xmlExecbody);
        }
        else {
            throw new Error(`'GetStatus' has not yet been implemented for this WPS-Version (${this.version}).`);
        }
        /** @type {?} */
        const request1$ = request$.pipe(delayedRetry(2000, 2), map((/**
         * @param {?} xmlResponse
         * @return {?}
         */
        (xmlResponse) => {
            /** @type {?} */
            const jsonResponse = this.xmlunmarshaller.unmarshalString(xmlResponse);
            /** @type {?} */
            const output = this.wpsmarshaller.unmarshalGetStateResponse(jsonResponse, serverUrl, processId, inputs, outputDescriptions);
            return output;
        })));
        return request1$;
    }
    /**
     * @private
     * @param {?} lastState
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputDescriptions
     * @return {?}
     */
    fetchResults(lastState, serverUrl, processId, inputs, outputDescriptions) {
        if (lastState.results) { // WPS 1.0: results should already be in last state
            return of(lastState.results);
        }
        else { // WPS 2.0: get results with post request
            if (!lastState.jobID) {
                throw new Error(`You want me to get a result, but I can't find a jobId. I don't know what to do now!`);
            }
            /** @type {?} */
            const execBody = this.wpsmarshaller.marshallGetResultBody(serverUrl, processId, lastState.jobID);
            /** @type {?} */
            const xmlExecBody = this.xmlmarshaller.marshalString(execBody);
            return this.postRaw(serverUrl, xmlExecBody).pipe(map((/**
             * @param {?} xmlResponse
             * @return {?}
             */
            (xmlResponse) => {
                /** @type {?} */
                const jsonResponse = this.xmlunmarshaller.unmarshalString(xmlResponse);
                /** @type {?} */
                const output = this.wpsmarshaller.unmarshalSyncExecuteResponse(jsonResponse, serverUrl, processId, inputs, outputDescriptions);
                return output;
            })));
        }
    }
    /**
     * @private
     * @param {?} url
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputDescriptions
     * @return {?}
     */
    executeAsyncS(url, processId, inputs, outputDescriptions) {
        /** @type {?} */
        const executeUrl = this.wpsmarshaller.executeUrl(url, processId);
        /** @type {?} */
        const execbody = this.wpsmarshaller.marshalExecBody(processId, inputs, outputDescriptions, true);
        /** @type {?} */
        const xmlExecbody = this.xmlmarshaller.marshalString(execbody);
        return this.postRaw(executeUrl, xmlExecbody).pipe(map((/**
         * @param {?} xmlResponse
         * @return {?}
         */
        (xmlResponse) => {
            /** @type {?} */
            const jsonResponse = this.xmlunmarshaller.unmarshalString(xmlResponse);
            /** @type {?} */
            const output = this.wpsmarshaller.unmarshalAsyncExecuteResponse(jsonResponse, url, processId, inputs, outputDescriptions);
            return output;
        })));
    }
    /**
     * @param {?} url
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputDescriptions
     * @return {?}
     */
    execute(url, processId, inputs, outputDescriptions) {
        /** @type {?} */
        const executeUrl = this.wpsmarshaller.executeUrl(url, processId);
        /** @type {?} */
        const execbody = this.wpsmarshaller.marshalExecBody(processId, inputs, outputDescriptions, false);
        /** @type {?} */
        const xmlExecbody = this.xmlmarshaller.marshalString(execbody);
        return this.postRaw(executeUrl, xmlExecbody).pipe(map((/**
         * @param {?} xmlResponse
         * @return {?}
         */
        (xmlResponse) => {
            /** @type {?} */
            const jsonResponse = this.xmlunmarshaller.unmarshalString(xmlResponse);
            /** @type {?} */
            const output = this.wpsmarshaller.unmarshalSyncExecuteResponse(jsonResponse, url, processId, inputs, outputDescriptions);
            return output;
        })));
    }
    /**
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} jobId
     * @return {?}
     */
    dismiss(serverUrl, processId, jobId) {
        /** @type {?} */
        const dismissUrl = this.wpsmarshaller.dismissUrl(serverUrl, processId, jobId);
        /** @type {?} */
        const dismissBody = this.wpsmarshaller.marshalDismissBody(jobId);
        /** @type {?} */
        const xmlDismissBody = this.xmlmarshaller.marshalString(dismissBody);
        return this.postRaw(dismissUrl, xmlDismissBody).pipe(map((/**
         * @param {?} xmlResponse
         * @return {?}
         */
        (xmlResponse) => {
            /** @type {?} */
            const jsonResponse = this.xmlunmarshaller.unmarshalString(xmlResponse);
            /** @type {?} */
            const output = this.wpsmarshaller.unmarshalDismissResponse(jsonResponse, serverUrl, processId);
            return output;
        })));
    }
    /**
     * @param {?} url
     * @param {?} xmlBody
     * @return {?}
     */
    postRaw(url, xmlBody) {
        /** @type {?} */
        const headers = {
            'Content-Type': 'text/xml',
            'Accept': 'text/xml, application/xml'
        };
        return this.webclient.post(url, xmlBody, { headers, responseType: 'text' }).pipe(delayedRetry(2000, 2), share() // turning hot: to make sure that multiple subscribers dont cause multiple requests
        );
    }
    /**
     * @param {?} url
     * @return {?}
     */
    getRaw(url) {
        /** @type {?} */
        const headers = {
            'Accept': 'text/xml, application/xml'
        };
        return this.webclient.get(url, { headers, responseType: 'text' }).pipe(delayedRetry(2000, 2));
    }
}
WpsClient.decorators = [
    { type: Injectable }
];
/** @nocollapse */
WpsClient.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: ['WpsVersion',] }] },
    { type: HttpClient },
    { type: undefined, decorators: [{ type: Inject, args: ['WpsCache',] }] }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    WpsClient.prototype.version;
    /**
     * @type {?}
     * @private
     */
    WpsClient.prototype.xmlmarshaller;
    /**
     * @type {?}
     * @private
     */
    WpsClient.prototype.xmlunmarshaller;
    /**
     * @type {?}
     * @private
     */
    WpsClient.prototype.wpsmarshaller;
    /**
     * @type {?}
     * @private
     */
    WpsClient.prototype.cache;
    /**
     * @type {?}
     * @private
     */
    WpsClient.prototype.webclient;
}

/**
 * @fileoverview added by tsickle
 * Generated from: lib/services-ogc.module.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class ServicesOgcModule {
}
ServicesOgcModule.decorators = [
    { type: NgModule, args: [{
                declarations: [],
                imports: [],
                exports: [],
                providers: [OwcJsonService, WmtsClientService, WpsClient]
            },] }
];

/**
 * @fileoverview added by tsickle
 * Generated from: lib/owc/types/owc-json.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * The OWS Context describes Metadata, API, Time Range
 * http://www.owscontext.org/owc_user_guide/C0_userGuide.html#truethe-ows-context-document-structure
 * If no bounding box is specified, do not change the current view when the context document is loaded.
 * @record
 */
function IOwsContext() { }
if (false) {
    /**
     * The id element defines a mandatory reference to the identification of the Context document.
     * The content for the id element SHALL be an IRI, as defined by IETF [RFC3987]
     * @type {?}
     */
    IOwsContext.prototype.id;
    /** @type {?} */
    IOwsContext.prototype.properties;
    /**
     * Ordered List of Resources available on the Context document
     * @type {?}
     */
    IOwsContext.prototype.features;
    /* Skipping unhandled member: [k: string]: any;*/
}
/**
 * Each layer (a.k.a. feature) in a context document is known as a ‘Resource’
 * A Resource reference a set of geospatial information to be treated as a logical element.
 * The resources are ordered such that the first item in the document is to be displayed at the front.
 * This defines the order in which layers are drawn.
 * A resource (which in GIS terms is a layer) can have a number of offerings, and each offering
 * is focussed on a particular representation of information.
 * These can be one of a number of OGC Web Services, specifically WMS, WMTS, WFS, WCS, WPS and CSW,
 * or one of a number of inline or referenced formats, specifically GML, KML, GeoTIFF, GMLJP2, GMLCOV,
 * or a custom offering type defined in a profile or by an organisation.
 * http://www.owscontext.org/owc_user_guide/C0_userGuide.html#truethe-ows-context-document-structure
 * @record
 */
function IOwsResource() { }
if (false) {
    /**
     * Unambiguous reference to the identification of the Context resource (IRI)
     * String type that SHALL contain a URI value
     * @type {?}
     */
    IOwsResource.prototype.id;
    /** @type {?} */
    IOwsResource.prototype.properties;
    /* Skipping unhandled member: [k: string]: any;*/
}
/**
 * @record
 */
function IOwsResourceProperties() { }
if (false) {
    /**
     * Title given to the Context resource
     * @type {?}
     */
    IOwsResourceProperties.prototype.title;
    /**
     * Date of the last update of the Context resource
     * @type {?}
     */
    IOwsResourceProperties.prototype.updated;
    /**
     * The purpose is to provide a generic description of the content in a format understandable by generic readers
     * @type {?|undefined}
     */
    IOwsResourceProperties.prototype.abstract;
    /**
     * This element is optional and indicates the authors array of the Context resource
     * @type {?|undefined}
     */
    IOwsResourceProperties.prototype.authors;
    /**
     * Entity responsible for making the Context resource available
     * @type {?|undefined}
     */
    IOwsResourceProperties.prototype.publisher;
    /**
     * Information about rights held in and over the Context resource
     * @type {?|undefined}
     */
    IOwsResourceProperties.prototype.rights;
    /**
     * Date or range of dates relevant to the Context resource
     * @type {?|undefined}
     */
    IOwsResourceProperties.prototype.date;
    /**
     * This element is optional and can contain a number of offerings defined by the class OWC:Offering
     * @type {?|undefined}
     */
    IOwsResourceProperties.prototype.offerings;
    /**
     * Flag value indicating to the client if the Context resource should be displayed by default
     * @type {?|undefined}
     */
    IOwsResourceProperties.prototype.active;
    /**
     * This array is optional and expresses a category related to the Context resource
     * @type {?|undefined}
     */
    IOwsResourceProperties.prototype.categories;
    /**
     * Minimum scale for the display of the Context resource Double
     * @type {?|undefined}
     */
    IOwsResourceProperties.prototype.minscaledenominator;
    /**
     * Maximum scale for the display of the Context resource Double
     * @type {?|undefined}
     */
    IOwsResourceProperties.prototype.maxscaledenominator;
    /**
     * Definition of the folder in which the resource is placed
     * The folder attribute is intended to support the concept present in many clients or organising layers into folders.
     * @type {?|undefined}
     */
    IOwsResourceProperties.prototype.folder;
    /**
     * TODO!!! links is defined as Object but in the examples as Array
     * @type {?|undefined}
     */
    IOwsResourceProperties.prototype.links;
    /* Skipping unhandled member: [k: string]: any;*/
}
/**
 * In reality a resource can be realised in a number of different ways, and so an OWC document allows various options to be specified.
 * These are known as offerings.
 * The intention is that these are, as far as is possible by the format used,
 * equivalent and no priority is assigned to their order in the standard.
 * They are intended to be alternatives that the client can use to allow it to visualise or use the resource.
 *
 * So for example four offerings, a WMS, a WFS with portrayal as SLD, and an inline GML Offering again with portrayal as SLD.
 * Different clients could use these offerings as appropriate:
 * - a simple browser based client could use the WMS offering provided, using the standard portrayal
 * - a more sophisticated client, could use the WFS offering and the associated SLD Document.
 *
 * There are two types of offering, service offerings and data offerings.
 * A service offering has a service request (in the form of a capabilities request and a data request)
 * and optional content and styling elements.
 * A data offering has a content element and optional styling elements.
 *
 *
 * http://www.owscontext.org/owc_user_guide/C0_userGuide.html#truemultiple-offerings-and-priority
 * @record
 */
function IOwsOffering() { }
if (false) {
    /**
     * Extension Offerings with type - string
     * @type {?}
     */
    IOwsOffering.prototype.code;
    /**
     * Web Service Offerings provide their operations
     * @type {?|undefined}
     */
    IOwsOffering.prototype.operations;
    /**
     * Content Offerings allow content to be embedded in an OWS Context document.
     * @type {?|undefined}
     */
    IOwsOffering.prototype.contents;
    /** @type {?|undefined} */
    IOwsOffering.prototype.styles;
    /* Skipping unhandled member: [k: string]: any;*/
}
/**
 * @record
 */
function IOwsCreator() { }
if (false) {
    /** @type {?|undefined} */
    IOwsCreator.prototype.title;
    /** @type {?|undefined} */
    IOwsCreator.prototype.uri;
    /** @type {?|undefined} */
    IOwsCreator.prototype.version;
}
/**
 * @record
 */
function IOwsAuthor() { }
if (false) {
    /**
     * Entity primarily responsible for making the Context document
     * @type {?|undefined}
     */
    IOwsAuthor.prototype.name;
    /** @type {?|undefined} */
    IOwsAuthor.prototype.email;
    /** @type {?|undefined} */
    IOwsAuthor.prototype.uri;
    /* Skipping unhandled member: [k: string]: any;*/
}
/**
 * @record
 */
function IOwsCategorie() { }
if (false) {
    /** @type {?|undefined} */
    IOwsCategorie.prototype.scheme;
    /**
     * Category related to this context document. It MAY have a related code-list that is identified by the scheme attribute
     * @type {?|undefined}
     */
    IOwsCategorie.prototype.term;
    /** @type {?|undefined} */
    IOwsCategorie.prototype.label;
}
/**
 * @record
 */
function IOwsLinks() { }
if (false) {
    /** @type {?} */
    IOwsLinks.prototype.rel;
    /** @type {?|undefined} */
    IOwsLinks.prototype.href;
    /** @type {?|undefined} */
    IOwsLinks.prototype.type;
    /** @type {?|undefined} */
    IOwsLinks.prototype.title;
    /**
     * Reference to a description of the Context resource in alternative format
     * @type {?|undefined}
     */
    IOwsLinks.prototype.alternates;
    /** @type {?|undefined} */
    IOwsLinks.prototype.lang;
    /* Skipping unhandled member: [k: string]: any;*/
}
/**
 * @record
 */
function IOwsCreatorApplication() { }
if (false) {
    /** @type {?|undefined} */
    IOwsCreatorApplication.prototype.title;
    /** @type {?|undefined} */
    IOwsCreatorApplication.prototype.uri;
    /** @type {?|undefined} */
    IOwsCreatorApplication.prototype.version;
}
/**
 * @record
 */
function IOwsCreatorDisplay() { }
if (false) {
    /**
     * Width measured in pixels of the display showing the Area of Interest
     * @type {?|undefined}
     */
    IOwsCreatorDisplay.prototype.pixelWidth;
    /**
     * Width measured in pixels of the display showing by the Area of Interest
     * @type {?|undefined}
     */
    IOwsCreatorDisplay.prototype.pixelHeight;
    /**
     * The size of a pixel of the display in milimeters
     * (combined with the previous ones allows for the real display size to be calculated)
     * @type {?|undefined}
     */
    IOwsCreatorDisplay.prototype.mmPerPixel;
    /* Skipping unhandled member: [k: string]: any;*/
}
/**
 * Most service offerings have two operations, a ‘GetCapabilities’ operation and a data operation such as ‘GetMap’ for WMS
 * @record
 */
function IOwsOperation() { }
if (false) {
    /**
     * The code identifies the type of operation.
     * Valid types are defined within each specific extension within the OWS Context conceptual model [OGC 12-080].
     * @type {?}
     */
    IOwsOperation.prototype.code;
    /**
     * method defines the access method, for example GET or POST.
     * @type {?}
     */
    IOwsOperation.prototype.method;
    /** @type {?|undefined} */
    IOwsOperation.prototype.type;
    /**
     * href is the URI containing the definition of the request
     * @type {?|undefined}
     */
    IOwsOperation.prototype.href;
    /** @type {?|undefined} */
    IOwsOperation.prototype.request;
    /** @type {?|undefined} */
    IOwsOperation.prototype.result;
    /* Skipping unhandled member: [k: string]: any;*/
}
/**
 * @record
 */
function IOwsContent() { }
if (false) {
    /**
     * MIME type of the Content
     * @type {?}
     */
    IOwsContent.prototype.type;
    /** @type {?|undefined} */
    IOwsContent.prototype.href;
    /** @type {?|undefined} */
    IOwsContent.prototype.title;
    /**
     * String type, not empty that can contain any text encoded media type
     * @type {?|undefined}
     */
    IOwsContent.prototype.content;
    /* Skipping unhandled member: [k: string]: any;*/
}
/**
 * @record
 */
function IOwsStyleSet() { }
if (false) {
    /** @type {?} */
    IOwsStyleSet.prototype.name;
    /** @type {?} */
    IOwsStyleSet.prototype.title;
    /** @type {?|undefined} */
    IOwsStyleSet.prototype.abstract;
    /** @type {?|undefined} */
    IOwsStyleSet.prototype.default;
    /** @type {?|undefined} */
    IOwsStyleSet.prototype.legendURL;
    /** @type {?|undefined} */
    IOwsStyleSet.prototype.content;
    /* Skipping unhandled member: [k: string]: any;*/
}

/**
 * @fileoverview added by tsickle
 * Generated from: lib/owc/types/eoc-owc-json.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @record
 */
function IEocOwsContext() { }
if (false) {
    /** @type {?} */
    IEocOwsContext.prototype.features;
    /** @type {?|undefined} */
    IEocOwsContext.prototype.projections;
}
/**
 * @record
 */
function IEocOwsResource() { }
if (false) {
    /** @type {?} */
    IEocOwsResource.prototype.properties;
}
/**
 * @record
 */
function IEocOwsResourceProperties() { }
if (false) {
    /** @type {?|undefined} */
    IEocOwsResourceProperties.prototype.opacity;
    /** @type {?|undefined} */
    IEocOwsResourceProperties.prototype.attribution;
    /** @type {?|undefined} */
    IEocOwsResourceProperties.prototype.shards;
    /** @type {?|undefined} */
    IEocOwsResourceProperties.prototype.dimensions;
}
/**
 * @record
 */
function IEocOwsResourceDimensions() { }
if (false) {
    /** @type {?|undefined} */
    IEocOwsResourceDimensions.prototype.time;
    /** @type {?|undefined} */
    IEocOwsResourceDimensions.prototype.elevation;
    /* Skipping unhandled member: [k: string]: any;*/
}
/**
 * @record
 */
function IEocOwsResourceDimension() { }
if (false) {
    /**
     * Default step display of time slider
     * @type {?|undefined}
     */
    IEocOwsResourceDimension.prototype.display;
    /** @type {?} */
    IEocOwsResourceDimension.prototype.units;
    /** @type {?|undefined} */
    IEocOwsResourceDimension.prototype.value;
}
/**
 * @record
 */
function IEocOwsOffering() { }
if (false) {
    /** @type {?} */
    IEocOwsOffering.prototype.code;
    /** @type {?|undefined} */
    IEocOwsOffering.prototype.legendUrl;
    /** @type {?|undefined} */
    IEocOwsOffering.prototype.iconUrl;
    /** @type {?|undefined} */
    IEocOwsOffering.prototype.title;
}
/**
 * @record
 */
function IEocWmsOffering() { }
if (false) {
    /** @type {?} */
    IEocWmsOffering.prototype.code;
}
/**
 * @record
 */
function IEocOwsWmtsOffering() { }
if (false) {
    /** @type {?} */
    IEocOwsWmtsOffering.prototype.code;
    /** @type {?|undefined} */
    IEocOwsWmtsOffering.prototype.matrixSets;
}
/**
 * @record
 */
function IEocOwsWmtsMatrixSet() { }
if (false) {
    /**
     * EPSG-Code
     * @type {?}
     */
    IEocOwsWmtsMatrixSet.prototype.srs;
    /** @type {?} */
    IEocOwsWmtsMatrixSet.prototype.matrixSet;
    /** @type {?} */
    IEocOwsWmtsMatrixSet.prototype.matrixIds;
    /** @type {?} */
    IEocOwsWmtsMatrixSet.prototype.origin;
    /** @type {?} */
    IEocOwsWmtsMatrixSet.prototype.resolutions;
    /** @type {?} */
    IEocOwsWmtsMatrixSet.prototype.tilesize;
}
/**
 * @record
 */
function IEocOwsProjection() { }
if (false) {
    /** @type {?} */
    IEocOwsProjection.prototype.bbox;
    /** @type {?} */
    IEocOwsProjection.prototype.code;
    /** @type {?|undefined} */
    IEocOwsProjection.prototype.default;
    /** @type {?|undefined} */
    IEocOwsProjection.prototype.unit;
}

/**
 * @fileoverview added by tsickle
 * Generated from: lib/wps/wps_datatypes.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @record
 */
function WpsDataDescription() { }
if (false) {
    /** @type {?} */
    WpsDataDescription.prototype.id;
    /** @type {?} */
    WpsDataDescription.prototype.type;
    /** @type {?} */
    WpsDataDescription.prototype.reference;
    /** @type {?|undefined} */
    WpsDataDescription.prototype.format;
    /** @type {?|undefined} */
    WpsDataDescription.prototype.description;
    /** @type {?|undefined} */
    WpsDataDescription.prototype.defaultValue;
}
/**
 * @record
 */
function WpsData() { }
if (false) {
    /** @type {?} */
    WpsData.prototype.description;
    /** @type {?} */
    WpsData.prototype.value;
}
/**
 * @record
 */
function WpsBboxDescription() { }
if (false) {
    /** @type {?} */
    WpsBboxDescription.prototype.id;
    /** @type {?} */
    WpsBboxDescription.prototype.type;
    /** @type {?} */
    WpsBboxDescription.prototype.reference;
    /** @type {?|undefined} */
    WpsBboxDescription.prototype.format;
    /** @type {?|undefined} */
    WpsBboxDescription.prototype.description;
    /** @type {?|undefined} */
    WpsBboxDescription.prototype.defaultValue;
}
/**
 * @record
 */
function WpsBboxValue() { }
if (false) {
    /** @type {?} */
    WpsBboxValue.prototype.crs;
    /** @type {?} */
    WpsBboxValue.prototype.lllon;
    /** @type {?} */
    WpsBboxValue.prototype.lllat;
    /** @type {?} */
    WpsBboxValue.prototype.urlon;
    /** @type {?} */
    WpsBboxValue.prototype.urlat;
}
/** @type {?} */
const isBbox = (/**
 * @param {?} obj
 * @return {?}
 */
(obj) => {
    return (obj.hasOwnProperty('crs') &&
        obj.hasOwnProperty('lllon') &&
        obj.hasOwnProperty('lllat') &&
        obj.hasOwnProperty('urlon') &&
        obj.hasOwnProperty('urlat'));
});
/**
 * @record
 */
function WpsState() { }
if (false) {
    /** @type {?} */
    WpsState.prototype.status;
    /** @type {?|undefined} */
    WpsState.prototype.percentCompleted;
    /**
     * WPS 2.0 only
     * @type {?|undefined}
     */
    WpsState.prototype.jobID;
    /**
     * WPS 1.0 only
     * @type {?|undefined}
     */
    WpsState.prototype.statusLocation;
    /**
     * WPS 1.0 only: a success-state already contains the results
     * @type {?|undefined}
     */
    WpsState.prototype.results;
}
/**
 * @param {?} obj
 * @return {?}
 */
function isWpsState(obj) {
    return obj && obj.hasOwnProperty('status') && (obj.hasOwnProperty('jobID') || obj.hasOwnProperty('statusLocation'));
}
/**
 * @record
 */
function WpsBboxData() { }
if (false) {
    /** @type {?} */
    WpsBboxData.prototype.description;
    /** @type {?} */
    WpsBboxData.prototype.value;
}
/**
 * @record
 */
function WpsCapability() { }
if (false) {
    /** @type {?} */
    WpsCapability.prototype.id;
}
/**
 * @record
 */
function WpsMarshaller() { }
if (false) {
    /**
     * @param {?} url
     * @param {?} processId
     * @return {?}
     */
    WpsMarshaller.prototype.executeUrl = function (url, processId) { };
    /**
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} jobId
     * @return {?}
     */
    WpsMarshaller.prototype.dismissUrl = function (serverUrl, processId, jobId) { };
    /**
     * @param {?} baseurl
     * @return {?}
     */
    WpsMarshaller.prototype.getCapabilitiesUrl = function (baseurl) { };
    /**
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputs
     * @param {?} async
     * @return {?}
     */
    WpsMarshaller.prototype.marshalExecBody = function (processId, inputs, outputs, async) { };
    /**
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} statusId
     * @return {?}
     */
    WpsMarshaller.prototype.marshallGetStatusBody = function (serverUrl, processId, statusId) { };
    /**
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} jobID
     * @return {?}
     */
    WpsMarshaller.prototype.marshallGetResultBody = function (serverUrl, processId, jobID) { };
    /**
     * @param {?} jobId
     * @return {?}
     */
    WpsMarshaller.prototype.marshalDismissBody = function (jobId) { };
    /**
     * @param {?} capabilitiesJson
     * @return {?}
     */
    WpsMarshaller.prototype.unmarshalCapabilities = function (capabilitiesJson) { };
    /**
     * @param {?} responseJson
     * @param {?} url
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputDescriptions
     * @return {?}
     */
    WpsMarshaller.prototype.unmarshalSyncExecuteResponse = function (responseJson, url, processId, inputs, outputDescriptions) { };
    /**
     * @param {?} responseJson
     * @param {?} url
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputDescriptions
     * @return {?}
     */
    WpsMarshaller.prototype.unmarshalAsyncExecuteResponse = function (responseJson, url, processId, inputs, outputDescriptions) { };
    /**
     * @param {?} jsonResponse
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputDescriptions
     * @return {?}
     */
    WpsMarshaller.prototype.unmarshalGetStateResponse = function (jsonResponse, serverUrl, processId, inputs, outputDescriptions) { };
    /**
     * @param {?} jsonResponse
     * @param {?} serverUrl
     * @param {?} processId
     * @return {?}
     */
    WpsMarshaller.prototype.unmarshalDismissResponse = function (jsonResponse, serverUrl, processId) { };
}

/**
 * @fileoverview added by tsickle
 * Generated from: public_api.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: ukis-services-ogc.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { FakeCache, OwcJsonService, ServicesOgcModule, WmtsClientService, WpsClient, isBbox, isCswOffering, isGMLCOVOffering, isGMLJP2Offering, isGeoJsonOffering, isGeoTIFFOffering, isGmlOffering, isKmlOffering, isWfsOffering, isWmsOffering, isWmtsOffering, isWpsOffering, isWpsState, isXyzOffering, shardsExpand };
//# sourceMappingURL=ukis-services-ogc.js.map
