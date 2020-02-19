(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@ukis/services-layers'), require('@angular/common/http'), require('@boundlessgeo/jsonix'), require('rxjs/operators'), require('w3c-schemas/lib/XLink_1_0'), require('ogc-schemas/lib/OWS_1_1_0'), require('ogc-schemas/lib/SMIL_2_0'), require('ogc-schemas/lib/SMIL_2_0_Language'), require('ogc-schemas/lib/GML_3_1_1'), require('ogc-schemas/lib/WMTS_1_0'), require('rxjs'), require('ogc-schemas/lib/OWS_2_0'), require('ogc-schemas/lib/WPS_1_0_0'), require('ogc-schemas/lib/WPS_2_0')) :
    typeof define === 'function' && define.amd ? define('@ukis/services-ogc', ['exports', '@angular/core', '@ukis/services-layers', '@angular/common/http', '@boundlessgeo/jsonix', 'rxjs/operators', 'w3c-schemas/lib/XLink_1_0', 'ogc-schemas/lib/OWS_1_1_0', 'ogc-schemas/lib/SMIL_2_0', 'ogc-schemas/lib/SMIL_2_0_Language', 'ogc-schemas/lib/GML_3_1_1', 'ogc-schemas/lib/WMTS_1_0', 'rxjs', 'ogc-schemas/lib/OWS_2_0', 'ogc-schemas/lib/WPS_1_0_0', 'ogc-schemas/lib/WPS_2_0'], factory) :
    (global = global || self, factory((global.ukis = global.ukis || {}, global.ukis['services-ogc'] = {}), global.ng.core, global.servicesLayers, global.ng.common.http, global.jsonix, global.rxjs.operators, global.XLink_1_0$2, global.OWS_1_1_0$2, global.SMIL_2_0$1, global.SMIL_2_0_Language$1, global.GML_3_1_1$1, global.WMTS_1_0$1, global.rxjs, global.OWS_2_0$1, global.WPS_1_0_0$1, global.WPS_2_0$1));
}(this, (function (exports, core, servicesLayers, http, jsonix, operators, XLink_1_0$2, OWS_1_1_0$2, SMIL_2_0$1, SMIL_2_0_Language$1, GML_3_1_1$1, WMTS_1_0$1, rxjs, OWS_2_0$1, WPS_1_0_0$1, WPS_2_0$1) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __exportStar(m, exports) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }

    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m) return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    }

    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }

    function __asyncValues(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    }

    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    function __importStar(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result.default = mod;
        return result;
    }

    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: lib/wmts/wmtsclient.service.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @type {?} */
    var XLink_1_0 = XLink_1_0$2.XLink_1_0;
    /** @type {?} */
    var OWS_1_1_0 = OWS_1_1_0$2.OWS_1_1_0;
    /** @type {?} */
    var SMIL_2_0 = SMIL_2_0$1.SMIL_2_0;
    /** @type {?} */
    var SMIL_2_0_Language = SMIL_2_0_Language$1.SMIL_2_0_Language;
    /** @type {?} */
    var GML_3_1_1 = GML_3_1_1$1.GML_3_1_1;
    /** @type {?} */
    var WMTS_1_0 = WMTS_1_0$1.WMTS_1_0;
    var WmtsClientService = /** @class */ (function () {
        function WmtsClientService(http) {
            this.http = http;
            /** @type {?} */
            var context = new jsonix.Jsonix.Context([SMIL_2_0, SMIL_2_0_Language, GML_3_1_1, XLink_1_0, OWS_1_1_0, WMTS_1_0]);
            this.xmlunmarshaller = context.createUnmarshaller();
            this.xmlmarshaller = context.createMarshaller();
        }
        /**
         * @param {?} url
         * @param {?=} version
         * @return {?}
         */
        WmtsClientService.prototype.getCapabilities = /**
         * @param {?} url
         * @param {?=} version
         * @return {?}
         */
        function (url, version) {
            var _this = this;
            if (version === void 0) { version = '1.1.0'; }
            // example: https://tiles.geoservice.dlr.de/service/wmts?SERVICE=WMTS&REQUEST=GetCapabilities&VERSION=1.1.0
            /** @type {?} */
            var getCapabilitiesUrl = url + "?SERVICE=WMTS&REQUEST=GetCapabilities&VERSION=" + version;
            /** @type {?} */
            var headers = new http.HttpHeaders({
                'Content-Type': 'text/xml',
                'Accept': 'text/xml, application/xml'
            });
            return this.http.get(getCapabilitiesUrl, { headers: headers, responseType: 'text' }).pipe(operators.map((/**
             * @param {?} response
             * @return {?}
             */
            function (response) {
                return _this.xmlunmarshaller.unmarshalString(response);
            })));
        };
        WmtsClientService.decorators = [
            { type: core.Injectable, args: [{
                        providedIn: 'root'
                    },] }
        ];
        /** @nocollapse */
        WmtsClientService.ctorParameters = function () { return [
            { type: http.HttpClient }
        ]; };
        /** @nocollapse */ WmtsClientService.ngInjectableDef = core.ɵɵdefineInjectable({ factory: function WmtsClientService_Factory() { return new WmtsClientService(core.ɵɵinject(http.HttpClient)); }, token: WmtsClientService, providedIn: "root" });
        return WmtsClientService;
    }());
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
        var o = [];
        for (var i in v.split(',')) {
            /** @type {?} */
            var j = v.split(',')[i].split("-");
            if (j.length == 1) {
                o.push(v.split(',')[i]);
            }
            else if (j.length == 2) {
                /** @type {?} */
                var start = j[0].charCodeAt(0);
                /** @type {?} */
                var end = j[1].charCodeAt(0);
                if (start <= end) {
                    for (var k = start; k <= end; k++) {
                        o.push(String.fromCharCode(k).toLowerCase());
                    }
                }
                else {
                    for (var k = start; k >= end; k--) {
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
    var OwcJsonService = /** @class */ (function () {
        function OwcJsonService(wmtsClient) {
            this.wmtsClient = wmtsClient;
            //http://www.owscontext.org/owc_user_guide/C0_userGuide.html#truegeojson-encoding-2
        }
        /**
         * @param {?} context
         * @return {?}
         */
        OwcJsonService.prototype.checkContext = /**
         * @param {?} context
         * @return {?}
         */
        function (context) {
            /** @type {?} */
            var isContext_1_0;
            if (!Array.isArray(context.properties.links)) {
                isContext_1_0 = context.properties.links.profiles.find((/**
                 * @param {?} item
                 * @return {?}
                 */
                function (item) { return item === 'http://www.opengis.net/spec/owc-geojson/1.0/req/core'; }));
            }
            else {
                isContext_1_0 = context.properties.links.find((/**
                 * @param {?} item
                 * @return {?}
                 */
                function (item) { return item.href === 'http://www.opengis.net/spec/owc-geojson/1.0/req/core'; }));
            }
            if (!isContext_1_0) {
                console.error('this is not a valid OWS Context v1.0!');
            }
            return isContext_1_0;
        };
        /**
         * @param {?} context
         * @return {?}
         */
        OwcJsonService.prototype.getContextTitle = /**
         * @param {?} context
         * @return {?}
         */
        function (context) {
            return context.properties.title;
        };
        /**
         * @param {?} context
         * @return {?}
         */
        OwcJsonService.prototype.getContextPublisher = /**
         * @param {?} context
         * @return {?}
         */
        function (context) {
            return (context.properties.publisher) ? context.properties.publisher : null;
        };
        /**
         * @param {?} context
         * @return {?}
         */
        OwcJsonService.prototype.getContextExtent = /**
         * @param {?} context
         * @return {?}
         */
        function (context) {
            return (context.bbox) ? context.bbox : null; // or [-180, -90, 180, 90];
        };
        /**
         * @param {?} context
         * @return {?}
         */
        OwcJsonService.prototype.getResources = /**
         * @param {?} context
         * @return {?}
         */
        function (context) {
            return context.features;
        };
        /** Resource --------------------------------------------------- */
        /**
         * Resource ---------------------------------------------------
         * @param {?} resource
         * @return {?}
         */
        OwcJsonService.prototype.getResourceTitle = /**
         * Resource ---------------------------------------------------
         * @param {?} resource
         * @return {?}
         */
        function (resource) {
            return resource.properties.title;
        };
        /**
         * @param {?} resource
         * @return {?}
         */
        OwcJsonService.prototype.getResourceUpdated = /**
         * @param {?} resource
         * @return {?}
         */
        function (resource) {
            return resource.properties.updated;
        };
        /**
         * @param {?} resource
         * @return {?}
         */
        OwcJsonService.prototype.getResourceDate = /**
         * @param {?} resource
         * @return {?}
         */
        function (resource) {
            return (resource.properties.date) ? resource.properties.date : null;
        };
        /**
         * @param {?} resource
         * @return {?}
         */
        OwcJsonService.prototype.getResourceOfferings = /**
         * @param {?} resource
         * @return {?}
         */
        function (resource) {
            return (resource.properties.offerings) ? resource.properties.offerings : null;
        };
        /**
         * retrieve layer status active / inactive based on IOwsResource
         * @param resource: IOwsResource
         */
        /**
         * retrieve layer status active / inactive based on IOwsResource
         * @param {?} resource
         * @return {?}
         */
        OwcJsonService.prototype.isActive = /**
         * retrieve layer status active / inactive based on IOwsResource
         * @param {?} resource
         * @return {?}
         */
        function (resource) {
            /** @type {?} */
            var active = true;
            if (resource.properties.hasOwnProperty('active')) {
                active = resource.properties.active;
            }
            return active;
        };
        /**
         * @param {?} resource
         * @return {?}
         */
        OwcJsonService.prototype.getResourceOpacity = /**
         * @param {?} resource
         * @return {?}
         */
        function (resource) {
            /** @type {?} */
            var opacity = 1;
            if (resource.properties.hasOwnProperty('opacity')) {
                opacity = resource.properties.opacity;
            }
            return opacity;
        };
        /**
         * @param {?} resource
         * @return {?}
         */
        OwcJsonService.prototype.getResourceAttribution = /**
         * @param {?} resource
         * @return {?}
         */
        function (resource) {
            /** @type {?} */
            var attribution = '';
            if (resource.properties.hasOwnProperty('attribution')) {
                attribution = resource.properties.attribution;
            }
            return attribution;
        };
        /**
         * @param {?} resource
         * @return {?}
         */
        OwcJsonService.prototype.getResourceShards = /**
         * @param {?} resource
         * @return {?}
         */
        function (resource) {
            if (resource.properties.hasOwnProperty('shards')) {
                return resource.properties.shards;
            }
        };
        /**
         * @param {?} owctime
         * @return {?}
         */
        OwcJsonService.prototype.convertOwcTimeToIsoTimeAndPeriodicity = /**
         * @param {?} owctime
         * @return {?}
         */
        function (owctime) {
            /**
             * Convert from
             * @type {?}
             */
            var arr = owctime.split('/');
            /** @type {?} */
            var t = (arr.length == 3) ? arr[0] + '/' + arr[1] : owctime;
            /** @type {?} */
            var p = (arr.length == 3) ? arr[2] : null;
            if (p) {
                return { "interval": t, "periodicity": p };
            }
            else {
                return t;
            }
        };
        /**
         * @param {?} resource
         * @return {?}
         */
        OwcJsonService.prototype.getResourceDimensions = /**
         * @param {?} resource
         * @return {?}
         */
        function (resource) {
            var e_1, _a;
            var _this = this;
            if (!resource.properties.hasOwnProperty('dimensions')) {
                return undefined;
            }
            /** @type {?} */
            var dims = {};
            /** @type {?} */
            var dimensions = {};
            if (Array.isArray(resource.properties.dimensions)) {
                try {
                    for (var _b = __values(resource.properties.dimensions), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var d = _c.value;
                        dimensions[d.name] = d;
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            else {
                dimensions = resource.properties.dimensions;
            }
            for (var name_1 in dimensions) {
                /** @type {?} */
                var dim = {};
                console.log(name_1);
                if (name_1 === "time" || dimensions[name_1].units == "ISO8601") {
                    /** @type {?} */
                    var value = dimensions[name_1].value;
                    /** @type {?} */
                    var values = (value) ? value.split(',').map((/**
                     * @param {?} v
                     * @return {?}
                     */
                    function (v) { return _this.convertOwcTimeToIsoTimeAndPeriodicity(v); })) : null;
                    dim = {
                        "values": ((!values) || values.length > 1) ? values : values[0],
                        "units": dimensions[name_1].units,
                        "display": {
                            "format": "YYYMMDD",
                            "period": dimensions[name_1].display,
                            "default": "end"
                        }
                    };
                }
                else if (name_1 === "elevation") {
                    dim = dimensions[name_1];
                }
                else {
                    dim = dimensions[name_1];
                }
                dims[name_1] = dim;
            }
            return dims;
        };
        /** Offering --------------------------------------------------- */
        /**
         * Offering ---------------------------------------------------
         * @param {?} offering
         * @return {?}
         */
        OwcJsonService.prototype.getLayertypeFromOfferingCode = /**
         * Offering ---------------------------------------------------
         * @param {?} offering
         * @return {?}
         */
        function (offering) {
            if (isWmsOffering(offering.code)) {
                return servicesLayers.WmsLayertype;
            }
            else if (isWmtsOffering(offering.code)) {
                return servicesLayers.WmtsLayertype;
            }
            else if (isWfsOffering(offering.code)) {
                return servicesLayers.WfsLayertype;
            }
            else if (isGeoJsonOffering(offering.code)) {
                return servicesLayers.GeojsonLayertype;
            }
            else if (isXyzOffering(offering.code)) {
                return servicesLayers.XyzLayertype;
            }
            else {
                return offering.code; // an offering can also be any other string.
            }
        };
        /**
         * @param {?} offering
         * @return {?}
         */
        OwcJsonService.prototype.checkIfServiceOffering = /**
         * @param {?} offering
         * @return {?}
         */
        function (offering) {
            return (!offering.contents && offering.operations) ? true : false;
        };
        /**
         * @param {?} offering
         * @return {?}
         */
        OwcJsonService.prototype.checkIfDataOffering = /**
         * @param {?} offering
         * @return {?}
         */
        function (offering) {
            return (offering.contents && !offering.operations) ? true : false;
        };
        /**
         * @param {?} offering
         * @return {?}
         */
        OwcJsonService.prototype.getOfferingContents = /**
         * @param {?} offering
         * @return {?}
         */
        function (offering) {
            if (this.checkIfServiceOffering(offering)) {
                return offering.operations;
            }
            else if (this.checkIfDataOffering(offering)) {
                return offering.contents;
            }
        };
        /**
         * Helper function to extract legendURL from project specific ows Context
         * @param offering layer offering
         */
        /**
         * Helper function to extract legendURL from project specific ows Context
         * @param {?} offering layer offering
         * @return {?}
         */
        OwcJsonService.prototype.getLegendUrl = /**
         * Helper function to extract legendURL from project specific ows Context
         * @param {?} offering layer offering
         * @return {?}
         */
        function (offering) {
            /** @type {?} */
            var legendUrl = '';
            if (offering.hasOwnProperty('styles')) {
                /** @type {?} */
                var defaultStyle = offering.styles.filter((/**
                 * @param {?} style
                 * @return {?}
                 */
                function (style) { return style.default; }));
                if (defaultStyle.length > 0) {
                    return defaultStyle[0].legendURL;
                }
            }
            else if (offering.hasOwnProperty('legendUrl')) {
                legendUrl = offering.legendUrl;
            }
            return legendUrl;
        };
        /**
         * retrieve iconUrl based on IOwsOffering
         * @param offering
         */
        /**
         * retrieve iconUrl based on IOwsOffering
         * @param {?} offering
         * @return {?}
         */
        OwcJsonService.prototype.getIconUrl = /**
         * retrieve iconUrl based on IOwsOffering
         * @param {?} offering
         * @return {?}
         */
        function (offering) {
            /** @type {?} */
            var iconUrl = '';
            if (offering.hasOwnProperty('iconUrl')) {
                iconUrl = offering.iconUrl;
            }
            return iconUrl;
        };
        /**
         * layer priority: first wms, then wmts, then wfs, then others.
         */
        /**
         * layer priority: first wms, then wmts, then wfs, then others.
         * @param {?} owc
         * @param {?} targetProjection
         * @return {?}
         */
        OwcJsonService.prototype.getLayers = /**
         * layer priority: first wms, then wmts, then wfs, then others.
         * @param {?} owc
         * @param {?} targetProjection
         * @return {?}
         */
        function (owc, targetProjection) {
            var e_2, _a;
            /** @type {?} */
            var resources = owc.features;
            /** @type {?} */
            var layers$ = [];
            try {
                for (var resources_1 = __values(resources), resources_1_1 = resources_1.next(); !resources_1_1.done; resources_1_1 = resources_1.next()) {
                    var resource = resources_1_1.value;
                    /** @type {?} */
                    var offerings = resource.properties.offerings;
                    if (offerings.length > 0) {
                        /** @type {?} */
                        var offering = offerings.find((/**
                         * @param {?} o
                         * @return {?}
                         */
                        function (o) { return isWmsOffering(o.code); }))
                            || offerings.find((/**
                             * @param {?} o
                             * @return {?}
                             */
                            function (o) { return isWmtsOffering(o.code); }))
                            || offerings.find((/**
                             * @param {?} o
                             * @return {?}
                             */
                            function (o) { return isWfsOffering(o.code); }))
                            || offerings[0];
                        layers$.push(this.createLayerFromOffering(offering, resource, owc, targetProjection));
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (resources_1_1 && !resources_1_1.done && (_a = resources_1.return)) _a.call(resources_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return rxjs.forkJoin(layers$);
        };
        /**
         * @param {?} offering
         * @param {?} resource
         * @param {?} context
         * @param {?} targetProjection
         * @return {?}
         */
        OwcJsonService.prototype.createLayerFromOffering = /**
         * @param {?} offering
         * @param {?} resource
         * @param {?} context
         * @param {?} targetProjection
         * @return {?}
         */
        function (offering, resource, context, targetProjection) {
            /** @type {?} */
            var layerType = this.getLayertypeFromOfferingCode(offering);
            if (servicesLayers.isRasterLayertype(layerType)) {
                return this.createRasterLayerFromOffering(offering, resource, context, targetProjection);
            }
            else if (servicesLayers.isVectorLayertype(layerType)) {
                return this.createVectorLayerFromOffering(offering, resource, context);
            }
            else {
                console.error("This type of service (" + layerType + ") has not been implemented yet.");
            }
        };
        /**
         * @param {?} offering
         * @param {?} resource
         * @param {?=} context
         * @return {?}
         */
        OwcJsonService.prototype.createVectorLayerFromOffering = /**
         * @param {?} offering
         * @param {?} resource
         * @param {?=} context
         * @return {?}
         */
        function (offering, resource, context) {
            /** @type {?} */
            var layerType = this.getLayertypeFromOfferingCode(offering);
            if (!servicesLayers.isVectorLayertype(layerType)) {
                console.error("This type of layer '" + layerType + "' / offering '" + offering.code + "' cannot be converted into a Vectorlayer");
                return null;
            }
            /** @type {?} */
            var iconUrl = this.getIconUrl(offering);
            /** @type {?} */
            var layerUrl;
            /** @type {?} */
            var params;
            // if we have a operations-offering (vs. a data-offering):
            if (offering.operations)
                layerUrl = this.getUrlFromUri(offering.operations[0].href);
            if (offering.operations)
                params = this.getJsonFromUri(offering.operations[0].href);
            /** @type {?} */
            var data;
            // if we have a data-offering: 
            if (offering.contents) {
                data = offering.contents[0].content;
            }
            /** @type {?} */
            var legendUrl = this.getLegendUrl(offering);
            /** @type {?} */
            var layerOptions = {
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
            var layer = new servicesLayers.VectorLayer(layerOptions);
            if (resource.bbox) {
                layer.bbox = resource.bbox;
            }
            else if (context && context.bbox) {
                layer.bbox = context.bbox;
            }
            return rxjs.of(layer);
        };
        /**
         * @param {?} offering
         * @param {?} resource
         * @param {?} context
         * @param {?} targetProjection
         * @return {?}
         */
        OwcJsonService.prototype.createRasterLayerFromOffering = /**
         * @param {?} offering
         * @param {?} resource
         * @param {?} context
         * @param {?} targetProjection
         * @return {?}
         */
        function (offering, resource, context, targetProjection) {
            /** @type {?} */
            var layerType = this.getLayertypeFromOfferingCode(offering);
            if (!servicesLayers.isRasterLayertype(layerType)) {
                console.error("This type of offering '" + offering.code + "' cannot be converted into a rasterlayer.");
                return null;
            }
            /** @type {?} */
            var rasterLayer$;
            switch (layerType) {
                case servicesLayers.WmsLayertype:
                    rasterLayer$ = this.createWmsLayerFromOffering(offering, resource, context);
                    break;
                case servicesLayers.WmtsLayertype:
                    rasterLayer$ = this.createWmtsLayerFromOffering(offering, resource, context, targetProjection);
                    break;
                case servicesLayers.XyzLayertype:
                    // @TODO
                    break;
                case servicesLayers.CustomLayertype:
                    // custom layers are meant to be userdefined and not easily encoded in a OWC.
                    break;
            }
            return rasterLayer$;
        };
        /**
         * @private
         * @param {?} offering
         * @param {?} resource
         * @param {?} context
         * @param {?} targetProjection
         * @return {?}
         */
        OwcJsonService.prototype.createWmtsLayerFromOffering = /**
         * @private
         * @param {?} offering
         * @param {?} resource
         * @param {?} context
         * @param {?} targetProjection
         * @return {?}
         */
        function (offering, resource, context, targetProjection) {
            return this.getWmtsOptions(offering, resource, context, targetProjection).pipe(operators.map((/**
             * @param {?} options
             * @return {?}
             */
            function (options) {
                /** @type {?} */
                var layer = new servicesLayers.WmtsLayer(options);
                return layer;
            })));
        };
        /**
         * @private
         * @param {?} offering
         * @param {?} resource
         * @param {?} context
         * @return {?}
         */
        OwcJsonService.prototype.createWmsLayerFromOffering = /**
         * @private
         * @param {?} offering
         * @param {?} resource
         * @param {?} context
         * @return {?}
         */
        function (offering, resource, context) {
            /** @type {?} */
            var options = this.getWmsOptions(offering, resource, context);
            /** @type {?} */
            var layer = new servicesLayers.WmsLayer(options);
            return rxjs.of(layer);
        };
        /**
         * @private
         * @param {?} offering
         * @param {?} resource
         * @param {?} context
         * @param {?} targetProjection
         * @return {?}
         */
        OwcJsonService.prototype.getWmtsOptions = /**
         * @private
         * @param {?} offering
         * @param {?} resource
         * @param {?} context
         * @param {?} targetProjection
         * @return {?}
         */
        function (offering, resource, context, targetProjection) {
            /** @type {?} */
            var rasterOptions = this.getRasterLayerOptions(offering, resource, context);
            /** @type {?} */
            var layer = this.getLayerForWMTS(offering, resource);
            /** @type {?} */
            var style;
            if (offering.styles) {
                /** @type {?} */
                var styleInfo = offering.styles.find((/**
                 * @param {?} s
                 * @return {?}
                 */
                function (s) { return s.default; }));
                if (styleInfo) {
                    style = styleInfo.name;
                }
            }
            return this.getMatrixSetForWMTS(offering, resource, targetProjection).pipe(operators.map(((/**
             * @param {?} matrixSet
             * @return {?}
             */
            function (matrixSet) {
                /** @type {?} */
                var matrixSetOptions = {
                    matrixSet: matrixSet.matrixSet,
                    matrixIds: matrixSet.matrixIds,
                    resolutions: matrixSet.resolutions
                };
                /** @type {?} */
                var wmtsOptions = __assign({}, rasterOptions, { type: 'wmts', params: {
                        layer: layer,
                        matrixSetOptions: matrixSetOptions,
                        projection: targetProjection,
                        style: style,
                        format: 'image/png'
                    } });
                return wmtsOptions;
            }))));
        };
        /**
         * @private
         * @param {?} offering
         * @param {?} resource
         * @return {?}
         */
        OwcJsonService.prototype.getLayerForWMTS = /**
         * @private
         * @param {?} offering
         * @param {?} resource
         * @return {?}
         */
        function (offering, resource) {
            var _a = __read(this.parseOperationUrl(offering, 'GetTile'), 2), url = _a[0], urlParams = _a[1];
            if (urlParams['LAYER']) {
                return urlParams['LAYER'];
            }
            else {
                console.error("There is no layer-parameter in the offering " + offering.code + " for resource " + resource.id + ".\n      Cannot infer layer.", offering);
            }
        };
        /**
         * @private
         * @param {?} offering
         * @param {?} opCode
         * @return {?}
         */
        OwcJsonService.prototype.parseOperationUrl = /**
         * @private
         * @param {?} offering
         * @param {?} opCode
         * @return {?}
         */
        function (offering, opCode) {
            if (offering.operations) {
                /** @type {?} */
                var operation = offering.operations.find((/**
                 * @param {?} op
                 * @return {?}
                 */
                function (op) { return op.code === opCode; }));
                if (operation) {
                    /** @type {?} */
                    var url = this.getUrlFromUri(operation.href);
                    /** @type {?} */
                    var urlParams = this.getJsonFromUri(operation.href);
                    return [url, urlParams];
                }
                else {
                    console.error("There is no " + opCode + "-operation in the offering " + offering.code + ".", offering);
                }
            }
            else {
                console.error("The offering " + offering.code + " has no operations.", offering);
            }
        };
        /**
         * @private
         * @param {?} offering
         * @param {?} resource
         * @param {?} targetProjection
         * @return {?}
         */
        OwcJsonService.prototype.getMatrixSetForWMTS = /**
         * @private
         * @param {?} offering
         * @param {?} resource
         * @param {?} targetProjection
         * @return {?}
         */
        function (offering, resource, targetProjection) {
            if (offering.matrixSets) {
                /** @type {?} */
                var matrixSet = offering.matrixSets.find((/**
                 * @param {?} m
                 * @return {?}
                 */
                function (m) { return m.srs === targetProjection; }));
                return rxjs.of(matrixSet);
            }
            else {
                var _a = __read(this.parseOperationUrl(offering, 'GetCapabilities'), 2), url = _a[0], urlParams = _a[1];
                return this.wmtsClient.getCapabilities(url).pipe(operators.map((/**
                 * @param {?} capabilities
                 * @return {?}
                 */
                function (capabilities) {
                    /** @type {?} */
                    var matrixSets = capabilities['value']['contents']['tileMatrixSet'];
                    /** @type {?} */
                    var matrixSet = matrixSets.find((/**
                     * @param {?} ms
                     * @return {?}
                     */
                    function (ms) { return ms['identifier']['value'] === targetProjection; }));
                    /** @type {?} */
                    var owsMatrixSet = {
                        srs: targetProjection,
                        matrixSet: matrixSet['identifier']['value'],
                        matrixIds: matrixSet['tileMatrix'].map((/**
                         * @param {?} tm
                         * @return {?}
                         */
                        function (tm) { return tm['identifier']['value']; })),
                        resolutions: matrixSet['tileMatrix'].map((/**
                         * @param {?} tm
                         * @return {?}
                         */
                        function (tm) { return tm['scaleDenominator']; })),
                        origin: {
                            x: matrixSet['tileMatrix'][0]['topLeftCorner'][1],
                            y: matrixSet['tileMatrix'][0]['topLeftCorner'][0]
                        },
                        tilesize: matrixSet['tileMatrix'][0]['tileHeight']
                    };
                    return owsMatrixSet;
                })));
            }
        };
        /**
         * @private
         * @param {?} offering
         * @param {?} resource
         * @param {?} context
         * @return {?}
         */
        OwcJsonService.prototype.getWmsOptions = /**
         * @private
         * @param {?} offering
         * @param {?} resource
         * @param {?} context
         * @return {?}
         */
        function (offering, resource, context) {
            /** @type {?} */
            var rasterOptions = this.getRasterLayerOptions(offering, resource, context);
            if (rasterOptions.type === servicesLayers.WmsLayertype) {
                /** @type {?} */
                var urlParams = this.getJsonFromUri(offering.operations[0].href);
                /** @type {?} */
                var defaultStyle = void 0;
                if (offering.styles) {
                    defaultStyle = offering.styles.find((/**
                     * @param {?} s
                     * @return {?}
                     */
                    function (s) { return s.default; })).name;
                }
                /** @type {?} */
                var params = {
                    LAYERS: urlParams['LAYERS'],
                    FORMAT: urlParams['FORMAT'],
                    TIME: urlParams['TIME'],
                    VERSION: urlParams['VERSION'],
                    TILED: urlParams['TILED'],
                    TRANSPARENT: true,
                    STYLES: defaultStyle
                };
                /** @type {?} */
                var wmsOptions = __assign({}, rasterOptions, { type: 'wms', params: params });
                return wmsOptions;
            }
            else {
                console.error("resource " + resource.id + " cannot be converted into a WMS-Layer", offering);
            }
        };
        /**
         * @private
         * @param {?} offering
         * @param {?} resource
         * @param {?} context
         * @return {?}
         */
        OwcJsonService.prototype.getRasterLayerOptions = /**
         * @private
         * @param {?} offering
         * @param {?} resource
         * @param {?} context
         * @return {?}
         */
        function (offering, resource, context) {
            /** @type {?} */
            var layerOptions = this.getLayerOptions(offering, resource, context);
            if (servicesLayers.isRasterLayertype(layerOptions.type)) {
                /** @type {?} */
                var rasterLayerOptions = __assign({}, layerOptions, { type: (/** @type {?} */ (layerOptions.type)), url: this.getUrlFromUri(offering.operations[0].href), subdomains: shardsExpand(this.getResourceShards(resource)) });
                return rasterLayerOptions;
            }
            else {
                console.error("The layer " + layerOptions.id + " is not a rasterlayer", layerOptions);
            }
        };
        /**
         * @private
         * @param {?} offering
         * @param {?} resource
         * @param {?} context
         * @return {?}
         */
        OwcJsonService.prototype.getLayerOptions = /**
         * @private
         * @param {?} offering
         * @param {?} resource
         * @param {?} context
         * @return {?}
         */
        function (offering, resource, context) {
            /** @type {?} */
            var layerOptions = {
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
        };
        /** Misc --------------------------------------------------- */
        /**
         * Misc ---------------------------------------------------
         * @private
         * @param {?} uri
         * @return {?}
         */
        OwcJsonService.prototype.getUrlFromUri = /**
         * Misc ---------------------------------------------------
         * @private
         * @param {?} uri
         * @return {?}
         */
        function (uri) {
            return uri.substring(0, uri.indexOf('?'));
        };
        /**
         * helper to pack query-parameters of a uri into a JSON
         * @param uri any uri with query-parameters
         */
        /**
         * helper to pack query-parameters of a uri into a JSON
         * @private
         * @param {?} uri any uri with query-parameters
         * @return {?}
         */
        OwcJsonService.prototype.getJsonFromUri = /**
         * helper to pack query-parameters of a uri into a JSON
         * @private
         * @param {?} uri any uri with query-parameters
         * @return {?}
         */
        function (uri) {
            /** @type {?} */
            var query = uri.substr(uri.lastIndexOf('?') + 1);
            /** @type {?} */
            var result = {};
            query.split('&').forEach((/**
             * @param {?} part
             * @return {?}
             */
            function (part) {
                /** @type {?} */
                var item = part.split('=');
                result[item[0].toUpperCase()] = decodeURIComponent(item[1]);
            }));
            return result;
        };
        /**
         * retrieve display name of layer, based on IOwsResource and IOwsOffering
         * @param offering
         * @param resource
         */
        /**
         * retrieve display name of layer, based on IOwsResource and IOwsOffering
         * @private
         * @param {?} offering
         * @param {?} resource
         * @return {?}
         */
        OwcJsonService.prototype.getDisplayName = /**
         * retrieve display name of layer, based on IOwsResource and IOwsOffering
         * @private
         * @param {?} offering
         * @param {?} resource
         * @return {?}
         */
        function (offering, resource) {
            /** @type {?} */
            var displayName = '';
            if (offering.hasOwnProperty('title')) {
                if (offering.title) {
                    displayName = offering.title;
                }
                else {
                    displayName = this.getResourceTitle(resource);
                }
            }
            return displayName;
        };
        /**------------ DATA TO FILE -----------------------------------------*/
        /**
         * @TODO:
         *   - properties
         */
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
        OwcJsonService.prototype.generateOwsContextFrom = /**------------ DATA TO FILE -----------------------------------------*/
        /**
         * \@TODO:
         *   - properties
         * @param {?} id
         * @param {?} layers
         * @param {?=} extent
         * @param {?=} properties
         * @return {?}
         */
        function (id, layers, extent, properties) {
            var e_3, _a;
            if (!properties) {
                properties = {
                    lang: '',
                    links: [],
                    title: '',
                    updated: ''
                };
            }
            /** @type {?} */
            var owc = {
                'id': id,
                'type': 'FeatureCollection',
                'properties': properties,
                'features': []
            };
            if (extent) {
                owc['bbox'] = extent;
            }
            try {
                for (var layers_1 = __values(layers), layers_1_1 = layers_1.next(); !layers_1_1.done; layers_1_1 = layers_1.next()) {
                    var layer = layers_1_1.value;
                    /** @type {?} */
                    var resource = this.generateResourceFromLayer(layer);
                    // TODO check for layer types
                    owc.features.push(resource);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (layers_1_1 && !layers_1_1.done && (_a = layers_1.return)) _a.call(layers_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return owc;
        };
        /**
         * @param {?} layer
         * @return {?}
         */
        OwcJsonService.prototype.generateResourceFromLayer = /**
         * @param {?} layer
         * @return {?}
         */
        function (layer) {
            /** @type {?} */
            var resource = {
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
        };
        /**
         * @param {?} layer
         * @param {?=} legendUrl
         * @param {?=} iconUrl
         * @return {?}
         */
        OwcJsonService.prototype.generateOfferingFromLayer = /**
         * @param {?} layer
         * @param {?=} legendUrl
         * @param {?=} iconUrl
         * @return {?}
         */
        function (layer, legendUrl, iconUrl) {
            /** @type {?} */
            var offering = {
                'code': this.getOfferingCodeFromLayer(layer),
                'title': layer.name
            };
            if (layer.type == servicesLayers.GeojsonLayertype) {
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
        };
        /**
         * @param {?} layer
         * @return {?}
         */
        OwcJsonService.prototype.getOfferingCodeFromLayer = /**
         * @param {?} layer
         * @return {?}
         */
        function (layer) {
            switch (layer.type) {
                case servicesLayers.WmsLayertype:
                    return 'http://www.opengis.net/spec/owc-geojson/1.0/req/wms';
                case servicesLayers.WmtsLayertype:
                    return 'http://www.opengis.net/spec/owc-geojson/1.0/req/wmts';
                case servicesLayers.GeojsonLayertype:
                    return 'http://www.opengis.net/spec/owc-geojson/1.0/req/geojson';
                case servicesLayers.XyzLayertype:
                    return 'http://www.opengis.net/spec/owc-geojson/1.0/req/xyz';
                default:
                    console.error("This type of layer (" + layer.type + ") has not been implemented yet.");
                    return null;
            }
        };
        /**
         * @param {?} layer
         * @return {?}
         */
        OwcJsonService.prototype.getContentsFromLayer = /**
         * @param {?} layer
         * @return {?}
         */
        function (layer) {
            /** @type {?} */
            var contents = [];
            switch (layer.type) {
                case servicesLayers.GeojsonLayertype:
                    /** @type {?} */
                    var content = {
                        type: 'FeatureCollection',
                        content: JSON.stringify(layer.data)
                    };
                    contents.push(content);
                    break;
                default:
                    console.error("Cannot get contents for this type of vectorlayer: (" + layer.type + ")");
            }
            return contents;
        };
        /**
         * @param {?} layer
         * @return {?}
         */
        OwcJsonService.prototype.getOperationsFromLayer = /**
         * @param {?} layer
         * @return {?}
         */
        function (layer) {
            if (layer instanceof servicesLayers.RasterLayer) {
                switch (layer.type) {
                    case servicesLayers.WmsLayertype:
                        return this.getWmsOperationsFromLayer(layer);
                    case servicesLayers.WmtsLayertype:
                        return this.getWmtsOperationsFromLayer(layer);
                    case servicesLayers.XyzLayertype:
                        return this.getXyzOperationsFromLayer(layer);
                    default:
                        console.error("Cannot get operations for this type of layer: (" + layer.type + ")");
                        return [];
                }
            }
            else if (layer instanceof servicesLayers.VectorLayer) {
                switch (layer.type) {
                    // case 'wfs': <--- this type of layer has not been implemented yet in datatypes-layers/Layers.ts 
                    //   return this.getWfsOperationsFromLayer(layer);
                    default:
                        console.error("This type of service (" + layer.type + ") has not been implemented yet.");
                        return [];
                }
            }
        };
        /**
         * @param {?} layer
         * @return {?}
         */
        OwcJsonService.prototype.getXyzOperationsFromLayer = /**
         * @param {?} layer
         * @return {?}
         */
        function (layer) {
            /** @type {?} */
            var restCall = {
                'code': 'REST',
                'method': 'GET',
                'type': 'text/html',
                'href': "" + layer.url
            };
            /** @type {?} */
            var operations = [
                restCall
            ];
            return operations;
        };
        /**
         * @param {?} layer
         * @return {?}
         */
        OwcJsonService.prototype.getTmsOperationsFromLayer = /**
         * @param {?} layer
         * @return {?}
         */
        function (layer) {
            // @TODO: what operations are defined on TMS? https://wiki.osgeo.org/wiki/Tile_Map_Service_Specification
            return [];
        };
        /**
         * @param {?} layer
         * @return {?}
         */
        OwcJsonService.prototype.getWfsOperationsFromLayer = /**
         * @param {?} layer
         * @return {?}
         */
        function (layer) {
            /** @type {?} */
            var url = layer.url;
            /** @type {?} */
            var layerName = layer.name;
            /** @type {?} */
            var version = layer.options.version ? layer.options.version : '1.1.0';
            /** @type {?} */
            var GetFeature = {
                'code': 'GetFeature',
                'method': 'GET',
                'type': 'application/json',
                'href': url + "?service=WFS&version=" + version + "&request=GetFeature"
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
            var operations = [
                GetFeature,
            ];
            return operations;
        };
        /**
         * @param {?} layer
         * @return {?}
         */
        OwcJsonService.prototype.getWmsOperationsFromLayer = /**
         * @param {?} layer
         * @return {?}
         */
        function (layer) {
            /** @type {?} */
            var url = layer.url;
            /** @type {?} */
            var wmsVersion = layer.params.VERSION;
            /** @type {?} */
            var layerName = layer.name;
            /** @type {?} */
            var layerId = layer.id;
            /** @type {?} */
            var format = 'image/vnd.jpeg-png';
            if (layer.params && layer.params.FORMAT)
                format = layer.params.FORMAT;
            /** @type {?} */
            var getMap = {
                'code': 'GetMap',
                'method': 'GET',
                'type': format,
                'href': url + "?service=WMS&version=" + wmsVersion + "&request=GetMap&TRANSPARENT=TRUE&LAYERS=" + layerId + "&FORMAT=" + format + "&TILED=true"
            };
            /** @type {?} */
            var getCapabilities = {
                'code': 'GetCapabilities',
                'method': 'GET',
                'type': 'application/xml',
                'href': url + "?service=WMS&version=" + wmsVersion + "&request=GetCapabilities"
            };
            /** @type {?} */
            var getFeatureInfo = {
                'code': 'GetFeatureInfo',
                'method': 'GET',
                'type': 'text/html',
                'href': url + "?service=WMS&version=" + wmsVersion + "&request=GetFeatureInfo&TRANSPARENT=TRUE&LAYERS=" + layerId + "&FORMAT=" + format
            };
            /** @type {?} */
            var operations = [
                getMap,
                getCapabilities,
                getFeatureInfo
            ];
            return operations;
        };
        /**
         * @param {?} layer
         * @return {?}
         */
        OwcJsonService.prototype.getWmtsOperationsFromLayer = /**
         * @param {?} layer
         * @return {?}
         */
        function (layer) {
            /** @type {?} */
            var url = layer.url;
            /** @type {?} */
            var wmtsVersion = layer.params.version;
            /** @type {?} */
            var layerName = layer.name;
            /** @type {?} */
            var layerId = layer.id;
            /** @type {?} */
            var format = 'image/vnd.jpeg-png';
            if (layer.params && layer.params.FORMAT)
                format = layer.params.FORMAT;
            /** @type {?} */
            var getTile = {
                'code': 'GetTile',
                'href': url + "?SERVICE=WMTS&REQUEST=GetTile&FORMAT=" + format + "&LAYER=" + layerId + "&VERSION=" + wmtsVersion,
                'method': 'GET',
                'type': format
            };
            /** @type {?} */
            var getCapabilities = {
                'code': 'GetCapabilities',
                'href': url + "?SERVICE=WMTS&REQUEST=GetCapabilities&VERSION=" + wmtsVersion,
                'method': 'GET',
                'type': 'application/xml'
            }
            // Note: we deliberately use the WMS protocol here instead of WMTS.
            // Reason: WMTS delivers RGB-values, wheras WMS delivers the actual value that was used to create a tile.
            ;
            // Note: we deliberately use the WMS protocol here instead of WMTS.
            // Reason: WMTS delivers RGB-values, wheras WMS delivers the actual value that was used to create a tile.
            /** @type {?} */
            var getFeatureInfo = {
                'code': 'GetFeatureInfo',
                'href': url + "?SERVICE=WMS&REQUEST=GetFeatureInfo&VERSION=" + wmtsVersion,
                'method': 'GET',
                'type': 'text/html'
            };
            /** @type {?} */
            var operations = [
                getTile,
                getCapabilities,
                getFeatureInfo
            ];
            return operations;
        };
        OwcJsonService.decorators = [
            { type: core.Injectable, args: [{
                        providedIn: 'root'
                    },] }
        ];
        /** @nocollapse */
        OwcJsonService.ctorParameters = function () { return [
            { type: WmtsClientService }
        ]; };
        /** @nocollapse */ OwcJsonService.ngInjectableDef = core.ɵɵdefineInjectable({ factory: function OwcJsonService_Factory() { return new OwcJsonService(core.ɵɵinject(WmtsClientService)); }, token: OwcJsonService, providedIn: "root" });
        return OwcJsonService;
    }());
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
    var WpsMarshaller100 = /** @class */ (function () {
        function WpsMarshaller100() {
        }
        /**
         * @param {?} baseurl
         * @return {?}
         */
        WpsMarshaller100.prototype.getCapabilitiesUrl = /**
         * @param {?} baseurl
         * @return {?}
         */
        function (baseurl) {
            return baseurl + "?service=WPS&request=GetCapabilities&version=1.0.0";
        };
        /**
         * @param {?} baseurl
         * @param {?} processId
         * @return {?}
         */
        WpsMarshaller100.prototype.executeUrl = /**
         * @param {?} baseurl
         * @param {?} processId
         * @return {?}
         */
        function (baseurl, processId) {
            return baseurl + "?service=WPS&request=Execute&version=1.0.0&identifier=" + processId;
        };
        /**
         * @param {?} capabilities
         * @return {?}
         */
        WpsMarshaller100.prototype.unmarshalCapabilities = /**
         * @param {?} capabilities
         * @return {?}
         */
        function (capabilities) {
            /** @type {?} */
            var out = [];
            capabilities.processOfferings.process.forEach((/**
             * @param {?} process
             * @return {?}
             */
            function (process) {
                out.push({
                    id: process.identifier.value
                });
            }));
            return out;
        };
        /**
         * @param {?} responseJson
         * @param {?} url
         * @param {?} processId
         * @param {?} inputs
         * @param {?} outputDescriptions
         * @return {?}
         */
        WpsMarshaller100.prototype.unmarshalSyncExecuteResponse = /**
         * @param {?} responseJson
         * @param {?} url
         * @param {?} processId
         * @param {?} inputs
         * @param {?} outputDescriptions
         * @return {?}
         */
        function (responseJson, url, processId, inputs, outputDescriptions) {
            var e_1, _a;
            /** @type {?} */
            var out = [];
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
                try {
                    for (var _b = __values(responseJson.value.processOutputs.output), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var output = _c.value;
                        /** @type {?} */
                        var isReference = output.reference ? true : false;
                        /** @type {?} */
                        var datatype = void 0;
                        /** @type {?} */
                        var data = void 0;
                        /** @type {?} */
                        var format = void 0;
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
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
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
        };
        /**
         * @protected
         * @param {?} data
         * @return {?}
         */
        WpsMarshaller100.prototype.unmarshalOutputData = /**
         * @protected
         * @param {?} data
         * @return {?}
         */
        function (data) {
            if (data.complexData) {
                switch (data.complexData.mimeType) {
                    case 'application/vnd.geo+json':
                    case 'application/json':
                        return data.complexData.content.map((/**
                         * @param {?} cont
                         * @return {?}
                         */
                        function (cont) { return JSON.parse(cont); }));
                    case 'application/WMS':
                        return data.complexData.content;
                    case 'text/xml':
                        return new XMLSerializer().serializeToString(data.complexData.content[0]); // @TODO: better: handle actual xml-data
                    default:
                        throw new Error("Cannot unmarshal data of format " + data.complexData.mimeType);
                }
            }
            else if (data.literalData) {
                switch (data.literalData.dataType) {
                    case 'string':
                    default:
                        return data.literalData.value;
                }
            }
            throw new Error("Not yet implemented: " + data);
        };
        /**
         * @param {?} responseJson
         * @param {?} url
         * @param {?} processId
         * @param {?} inputs
         * @param {?} outputDescriptions
         * @return {?}
         */
        WpsMarshaller100.prototype.unmarshalAsyncExecuteResponse = /**
         * @param {?} responseJson
         * @param {?} url
         * @param {?} processId
         * @param {?} inputs
         * @param {?} outputDescriptions
         * @return {?}
         */
        function (responseJson, url, processId, inputs, outputDescriptions) {
            return this.unmarshalGetStateResponse(responseJson, url, processId, inputs, outputDescriptions);
        };
        /**
         * @param {?} responseJson
         * @param {?} serverUrl
         * @param {?} processId
         * @param {?} inputs
         * @param {?} outputDescriptions
         * @return {?}
         */
        WpsMarshaller100.prototype.unmarshalGetStateResponse = /**
         * @param {?} responseJson
         * @param {?} serverUrl
         * @param {?} processId
         * @param {?} inputs
         * @param {?} outputDescriptions
         * @return {?}
         */
        function (responseJson, serverUrl, processId, inputs, outputDescriptions) {
            /** @type {?} */
            var response = responseJson.value;
            /** @type {?} */
            var status = response.status.processSucceeded ? 'Succeeded' :
                response.status.processAccepted ? 'Accepted' :
                    response.status.processStarted ? 'Running' :
                        response.status.processFailed ? 'Failed' :
                            'Failed';
            /** @type {?} */
            var state = {
                status: status,
                statusLocation: response.statusLocation,
            };
            if (response.processOutputs && response.processOutputs.output) {
                state.results = this.unmarshalSyncExecuteResponse(responseJson, serverUrl, processId, inputs, outputDescriptions);
            }
            return state;
        };
        /**
         * @param {?} processId
         * @param {?} inputs
         * @param {?} outputs
         * @param {?} async
         * @return {?}
         */
        WpsMarshaller100.prototype.marshalExecBody = /**
         * @param {?} processId
         * @param {?} inputs
         * @param {?} outputs
         * @param {?} async
         * @return {?}
         */
        function (processId, inputs, outputs, async) {
            /** @type {?} */
            var wps1Inputs = this.marshalInputs(inputs);
            /** @type {?} */
            var wps1ResponseForm = this.marshalResponseForm(outputs, async);
            /** @type {?} */
            var bodyValue = {
                dataInputs: wps1Inputs,
                identifier: processId,
                responseForm: wps1ResponseForm,
                service: 'WPS',
                version: '1.0.0'
            };
            /** @type {?} */
            var body = {
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
        };
        /**
         * @protected
         * @param {?} outputs
         * @param {?=} async
         * @return {?}
         */
        WpsMarshaller100.prototype.marshalResponseForm = /**
         * @protected
         * @param {?} outputs
         * @param {?=} async
         * @return {?}
         */
        function (outputs, async) {
            var e_2, _a;
            if (async === void 0) { async = false; }
            /** @type {?} */
            var outputDefinitions = [];
            try {
                for (var outputs_1 = __values(outputs), outputs_1_1 = outputs_1.next(); !outputs_1_1.done; outputs_1_1 = outputs_1.next()) {
                    var output = outputs_1_1.value;
                    /** @type {?} */
                    var defType = void 0;
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
                            throw new Error("This Wps-outputtype has not been implemented yet! " + output + " ");
                    }
                    outputDefinitions.push(defType);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (outputs_1_1 && !outputs_1_1.done && (_a = outputs_1.return)) _a.call(outputs_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            /** @type {?} */
            var responseDocument = {
                output: outputDefinitions,
                status: async ? true : false,
                storeExecuteResponse: async ? true : false
            };
            /** @type {?} */
            var form = {
                responseDocument: responseDocument
            };
            return form;
        };
        /**
         * @protected
         * @param {?} inputArr
         * @return {?}
         */
        WpsMarshaller100.prototype.marshalInputs = /**
         * @protected
         * @param {?} inputArr
         * @return {?}
         */
        function (inputArr) {
            var e_3, _a;
            /** @type {?} */
            var theInputs = [];
            try {
                for (var inputArr_1 = __values(inputArr), inputArr_1_1 = inputArr_1.next(); !inputArr_1_1.done; inputArr_1_1 = inputArr_1.next()) {
                    var inp = inputArr_1_1.value;
                    if (inp.value === null || inp.value === undefined) {
                        throw new Error("Value for input " + inp.description.id + " is not set");
                    }
                    /** @type {?} */
                    var marshalledInput = this.marshalInput(inp);
                    theInputs.push(marshalledInput);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (inputArr_1_1 && !inputArr_1_1.done && (_a = inputArr_1.return)) _a.call(inputArr_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
            /** @type {?} */
            var inputs = {
                input: theInputs
            };
            return inputs;
        };
        /**
         * @protected
         * @param {?} input
         * @return {?}
         */
        WpsMarshaller100.prototype.marshalInput = /**
         * @protected
         * @param {?} input
         * @return {?}
         */
        function (input) {
            /** @type {?} */
            var id = input.description.id;
            /** @type {?} */
            var title = input.description.id;
            /** @type {?} */
            var abstract = '';
            /** @type {?} */
            var inputType = {
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
        };
        /**
         * @protected
         * @param {?} input
         * @return {?}
         */
        WpsMarshaller100.prototype.marshalDataInput = /**
         * @protected
         * @param {?} input
         * @return {?}
         */
        function (input) {
            /** @type {?} */
            var data;
            switch (input.description.type) {
                case 'literal':
                    data = {
                        literalData: { value: String(input.value) }
                    };
                    break;
                case 'bbox':
                    /** @type {?} */
                    var values = input.value;
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
                    throw Error("This input is of type " + input.description.type + ". We can only marshal input of type literal, bbox or complex.");
            }
            return data;
        };
        /**
         * @protected
         * @param {?} input
         * @return {?}
         */
        WpsMarshaller100.prototype.marshalReferenceInput = /**
         * @protected
         * @param {?} input
         * @return {?}
         */
        function (input) {
            /** @type {?} */
            var ref = {
                href: input.value,
                method: 'GET',
                mimeType: input.description.format
            };
            return ref;
        };
        /**
         * @param {?} serverUrl
         * @param {?} processId
         * @param {?} statusId
         * @return {?}
         */
        WpsMarshaller100.prototype.marshallGetStatusBody = /**
         * @param {?} serverUrl
         * @param {?} processId
         * @param {?} statusId
         * @return {?}
         */
        function (serverUrl, processId, statusId) {
            // WPS-1.0 does not send a body with a GetStatus request.
            return {};
        };
        /**
         * @param {?} serverUrl
         * @param {?} processId
         * @param {?} jobID
         * @return {?}
         */
        WpsMarshaller100.prototype.marshallGetResultBody = /**
         * @param {?} serverUrl
         * @param {?} processId
         * @param {?} jobID
         * @return {?}
         */
        function (serverUrl, processId, jobID) {
            // WPS-1.0 does not send a body with a GetStatus request.
            return {};
        };
        /**
         * @param {?} serverUrl
         * @param {?} processId
         * @param {?} jobId
         * @return {?}
         */
        WpsMarshaller100.prototype.dismissUrl = /**
         * @param {?} serverUrl
         * @param {?} processId
         * @param {?} jobId
         * @return {?}
         */
        function (serverUrl, processId, jobId) {
            /** this does only work in geoserver:
            return `${serverUrl}?service=WPS&version=1.0.0&request=Dismiss&executionId=${jobId}`; */
            throw new Error('Wps 1.0 does not support Dismiss-operations.');
        };
        /**
         * @param {?} processId
         * @return {?}
         */
        WpsMarshaller100.prototype.marshalDismissBody = /**
         * @param {?} processId
         * @return {?}
         */
        function (processId) {
            throw new Error('Wps 1.0 does not support Dismiss-operations.');
        };
        /**
         * @param {?} jsonResponse
         * @param {?} serverUrl
         * @param {?} processId
         * @return {?}
         */
        WpsMarshaller100.prototype.unmarshalDismissResponse = /**
         * @param {?} jsonResponse
         * @param {?} serverUrl
         * @param {?} processId
         * @return {?}
         */
        function (jsonResponse, serverUrl, processId) {
            throw new Error('Wps 1.0 does not support Dismiss-operations.');
        };
        return WpsMarshaller100;
    }());

    /**
     * @fileoverview added by tsickle
     * Generated from: lib/wps/wps200/helpers.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @type {?} */
    var isStatusInfo = (/**
     * @param {?} obj
     * @return {?}
     */
    function (obj) {
        return obj.hasOwnProperty('jobID')
            && obj.hasOwnProperty('status');
    });
    /** @type {?} */
    var isDataOutputType = (/**
     * @param {?} obj
     * @return {?}
     */
    function (obj) {
        return obj.hasOwnProperty('id') &&
            (obj.hasOwnProperty('data') || obj.hasOwnProperty('reference') || obj.hasOwnProperty('output'));
    });
    /** @type {?} */
    var isResult = (/**
     * @param {?} obj
     * @return {?}
     */
    function (obj) {
        return (obj.hasOwnProperty('output') && typeof obj['output'] === 'object');
    });

    /**
     * @fileoverview added by tsickle
     * Generated from: lib/wps/wps200/wps_marshaller_2.0.0.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var WpsMarshaller200 = /** @class */ (function () {
        function WpsMarshaller200() {
        }
        /**
         * @param {?} baseurl
         * @return {?}
         */
        WpsMarshaller200.prototype.getCapabilitiesUrl = /**
         * @param {?} baseurl
         * @return {?}
         */
        function (baseurl) {
            return baseurl + "?service=WPS&request=GetCapabilities&version=2.0.0";
        };
        /**
         * @param {?} baseurl
         * @param {?} processId
         * @return {?}
         */
        WpsMarshaller200.prototype.executeUrl = /**
         * @param {?} baseurl
         * @param {?} processId
         * @return {?}
         */
        function (baseurl, processId) {
            return baseurl + "?service=WPS&request=Execute&version=2.0.0&identifier=" + processId;
        };
        /**
         * @param {?} capabilities
         * @return {?}
         */
        WpsMarshaller200.prototype.unmarshalCapabilities = /**
         * @param {?} capabilities
         * @return {?}
         */
        function (capabilities) {
            /** @type {?} */
            var out = [];
            capabilities.contents.processSummary.forEach((/**
             * @param {?} summary
             * @return {?}
             */
            function (summary) {
                out.push({
                    id: summary.identifier.value
                });
            }));
            return out;
        };
        /**
         * @param {?} responseJson
         * @param {?} url
         * @param {?} processId
         * @param {?} inputs
         * @param {?} outputDescriptions
         * @return {?}
         */
        WpsMarshaller200.prototype.unmarshalSyncExecuteResponse = /**
         * @param {?} responseJson
         * @param {?} url
         * @param {?} processId
         * @param {?} inputs
         * @param {?} outputDescriptions
         * @return {?}
         */
        function (responseJson, url, processId, inputs, outputDescriptions) {
            var e_1, _a;
            /** @type {?} */
            var out = [];
            if (isResult(responseJson.value)) {
                var _loop_1 = function (output) {
                    /** @type {?} */
                    var outputDescription = outputDescriptions.find((/**
                     * @param {?} od
                     * @return {?}
                     */
                    function (od) { return od.id === output.id; }));
                    if (!outputDescription) {
                        throw new Error("Could not find an output-description for the parameter " + output.id + ".");
                    }
                    /** @type {?} */
                    var isReference = outputDescription.reference;
                    /** @type {?} */
                    var datatype = outputDescription.type;
                    /** @type {?} */
                    var format = outputDescription.format;
                    /** @type {?} */
                    var data = void 0;
                    if (output.reference) {
                        data = output.reference.href || null;
                    }
                    else if (output.data) {
                        data = this_1.unmarshalOutputData(output.data, outputDescription);
                    }
                    else {
                        throw new Error("Output has neither reference nor data field.");
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
                };
                var this_1 = this;
                try {
                    for (var _b = __values(responseJson.value.output), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var output = _c.value;
                        _loop_1(output);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            else if (isStatusInfo(responseJson.value)) {
                /** @type {?} */
                var state = {
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
        };
        /**
         * @protected
         * @param {?} data
         * @param {?} description
         * @return {?}
         */
        WpsMarshaller200.prototype.unmarshalOutputData = /**
         * @protected
         * @param {?} data
         * @param {?} description
         * @return {?}
         */
        function (data, description) {
            if (description.type === 'complex') {
                switch (data.mimeType) {
                    case 'application/vnd.geo+json':
                    case 'application/json':
                        return data.content.map((/**
                         * @param {?} cont
                         * @return {?}
                         */
                        function (cont) { return JSON.parse(cont); }));
                    case 'application/WMS':
                        return data.content;
                    case 'text/xml':
                        return new XMLSerializer().serializeToString(data.content[0]); // @TODO: better: handle actual xml-data
                    default:
                        throw new Error("Cannot unmarshal complex data of format " + data.mimeType);
                }
            }
            else if (description.type === 'literal') {
                return data.content;
            }
            throw new Error("Not yet implemented: " + data);
        };
        /**
         * @param {?} responseJson
         * @param {?} url
         * @param {?} processId
         * @param {?} inputs
         * @param {?} outputDescriptions
         * @return {?}
         */
        WpsMarshaller200.prototype.unmarshalAsyncExecuteResponse = /**
         * @param {?} responseJson
         * @param {?} url
         * @param {?} processId
         * @param {?} inputs
         * @param {?} outputDescriptions
         * @return {?}
         */
        function (responseJson, url, processId, inputs, outputDescriptions) {
            return this.unmarshalGetStateResponse(responseJson, url, processId, inputs, outputDescriptions);
        };
        /**
         * @param {?} responseJson
         * @param {?} serverUrl
         * @param {?} processId
         * @param {?} inputs
         * @param {?} outputDescriptions
         * @return {?}
         */
        WpsMarshaller200.prototype.unmarshalGetStateResponse = /**
         * @param {?} responseJson
         * @param {?} serverUrl
         * @param {?} processId
         * @param {?} inputs
         * @param {?} outputDescriptions
         * @return {?}
         */
        function (responseJson, serverUrl, processId, inputs, outputDescriptions) {
            if (isStatusInfo(responseJson.value)) {
                /** @type {?} */
                var state = {
                    status: responseJson.value.status,
                    jobID: responseJson.value.jobID,
                    percentCompleted: responseJson.value.percentCompleted
                };
                return state;
            }
            else {
                throw new Error("Not a status-info: " + responseJson);
            }
        };
        /**
         * @param {?} processId
         * @param {?} inputs
         * @param {?} outputs
         * @param {?} async
         * @return {?}
         */
        WpsMarshaller200.prototype.marshalExecBody = /**
         * @param {?} processId
         * @param {?} inputs
         * @param {?} outputs
         * @param {?} async
         * @return {?}
         */
        function (processId, inputs, outputs, async) {
            /** @type {?} */
            var inputsMarshalled = this.marshalInputs(inputs);
            /** @type {?} */
            var outputsMarshalled = this.marshalOutputs(outputs);
            /** @type {?} */
            var bodyValue = {
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
            var body = {
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
        };
        /**
         * @private
         * @param {?} inputs
         * @return {?}
         */
        WpsMarshaller200.prototype.marshalInputs = /**
         * @private
         * @param {?} inputs
         * @return {?}
         */
        function (inputs) {
            return inputs.map((/**
             * @param {?} i
             * @return {?}
             */
            function (i) {
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
        };
        /**
         * @private
         * @param {?} outputs
         * @return {?}
         */
        WpsMarshaller200.prototype.marshalOutputs = /**
         * @private
         * @param {?} outputs
         * @return {?}
         */
        function (outputs) {
            return outputs.map((/**
             * @param {?} o
             * @return {?}
             */
            function (o) {
                return {
                    id: o.id,
                    mimeType: o.format,
                    transmission: o.reference ? 'reference' : 'value' // @TODO: maybe just comment out this line?
                };
            }));
        };
        /**
         * @param {?} serverUrl
         * @param {?} processId
         * @param {?} statusId
         * @return {?}
         */
        WpsMarshaller200.prototype.marshallGetStatusBody = /**
         * @param {?} serverUrl
         * @param {?} processId
         * @param {?} statusId
         * @return {?}
         */
        function (serverUrl, processId, statusId) {
            /** @type {?} */
            var request = {
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
        };
        /**
         * @param {?} serverUrl
         * @param {?} processId
         * @param {?} jobID
         * @return {?}
         */
        WpsMarshaller200.prototype.marshallGetResultBody = /**
         * @param {?} serverUrl
         * @param {?} processId
         * @param {?} jobID
         * @return {?}
         */
        function (serverUrl, processId, jobID) {
            /** @type {?} */
            var request = {
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
        };
        /**
         * @param {?} serverUrl
         * @param {?} processId
         * @param {?} jobId
         * @return {?}
         */
        WpsMarshaller200.prototype.dismissUrl = /**
         * @param {?} serverUrl
         * @param {?} processId
         * @param {?} jobId
         * @return {?}
         */
        function (serverUrl, processId, jobId) {
            return serverUrl;
        };
        /**
         * @param {?} jobId
         * @return {?}
         */
        WpsMarshaller200.prototype.marshalDismissBody = /**
         * @param {?} jobId
         * @return {?}
         */
        function (jobId) {
            /** @type {?} */
            var body = {
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
        };
        /**
         * @param {?} jsonResponse
         * @param {?} serverUrl
         * @param {?} processId
         * @return {?}
         */
        WpsMarshaller200.prototype.unmarshalDismissResponse = /**
         * @param {?} jsonResponse
         * @param {?} serverUrl
         * @param {?} processId
         * @return {?}
         */
        function (jsonResponse, serverUrl, processId) {
            /** @type {?} */
            var state = {
                status: jsonResponse.value.status,
                jobID: jsonResponse.value.jobID
            };
            return state;
        };
        return WpsMarshaller200;
    }());

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
    function pollUntil(task$, predicate, doWhile, minWaitTime) {
        if (minWaitTime === void 0) { minWaitTime = 1000; }
        if (doWhile) {
            doWhile(null);
        }
        /** @type {?} */
        var tappedTask$ = task$.pipe(operators.tap((/**
         * @param {?} r
         * @return {?}
         */
        function (r) {
            if (doWhile) {
                doWhile(r);
            }
        })));
        /** @type {?} */
        var requestTakesAtLeast$ = rxjs.forkJoin(tappedTask$, rxjs.timer(minWaitTime)).pipe(operators.map((/**
         * @param {?} r
         * @return {?}
         */
        function (r) { return r[0]; })));
        /** @type {?} */
        var polledRequest$ = requestTakesAtLeast$.pipe(operators.mergeMap((/**
         * @param {?} response
         * @return {?}
         */
        function (response) {
            if (predicate(response)) {
                // console.log(`obtained correct answer ${response}`);
                return rxjs.of(response);
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
    function delayedRetry(delayMs, maxRetries) {
        if (maxRetries === void 0) { maxRetries = 3; }
        /** @type {?} */
        var attempts = 1;
        return (/**
         * @param {?} src$
         * @return {?}
         */
        function (src$) {
            return src$.pipe(
            // If an error occurs ...
            operators.retryWhen((/**
             * @param {?} error$
             * @return {?}
             */
            function (error$) {
                return error$.pipe(operators.delay(delayMs), // <- in any case, first wait a little while ...
                operators.mergeMap((/**
                 * @param {?} error
                 * @return {?}
                 */
                function (error) {
                    if (error.status && error.status === 400) {
                        // In case of a server error, repeating won't help.
                        throw error;
                    }
                    else if (attempts <= maxRetries) {
                        console.log('http-error. Retrying ...');
                        attempts += 1;
                        return rxjs.of(error); // <- an observable causes request to be retried
                    }
                    else {
                        console.log("Persistent http-errors after " + attempts + " attempts. Giving up.");
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
    var FakeCache = /** @class */ (function () {
        function FakeCache() {
        }
        /**
         * @param {?} input
         * @param {?} output
         * @return {?}
         */
        FakeCache.prototype.set = /**
         * @param {?} input
         * @param {?} output
         * @return {?}
         */
        function (input, output) {
        };
        /**
         * @param {?} input
         * @return {?}
         */
        FakeCache.prototype.get = /**
         * @param {?} input
         * @return {?}
         */
        function (input) {
            return rxjs.of(null);
        };
        return FakeCache;
    }());

    /**
     * @fileoverview added by tsickle
     * Generated from: lib/wps/wpsclient.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @type {?} */
    var XLink_1_0$1 = XLink_1_0$2.XLink_1_0;
    /** @type {?} */
    var OWS_1_1_0$1 = OWS_1_1_0$2.OWS_1_1_0;
    /** @type {?} */
    var OWS_2_0 = OWS_2_0$1.OWS_2_0;
    /** @type {?} */
    var WPS_1_0_0 = WPS_1_0_0$1.WPS_1_0_0;
    /** @type {?} */
    var WPS_2_0 = WPS_2_0$1.WPS_2_0;
    /**
     * The Wps-client abstracts away the differences between Wps1.0.0 and Wps2.0.0
     * There are two layers of marshalling:
     *  - the Wps-marshaller marshals user-facing data to wps-specific types
     *  - Jsonix marshals wps-specific data to xml.
     * user-facing data -> wpsmarshaller -> Wps-type-specific data -> Jsonix-marhsaller -> XML ->
     * -> webclient -> WPS -> XML -> Jsonix-unmarshaller -> Wps-type-specific data -> wpsmarshaller -> user-facing data
     */
    var WpsClient = /** @class */ (function () {
        function WpsClient(version, webclient, cache) {
            if (version === void 0) { version = '1.0.0'; }
            this.webclient = webclient;
            this.cache = new FakeCache();
            this.version = version;
            if (cache)
                this.cache = cache;
            /** @type {?} */
            var context;
            if (this.version === '1.0.0') {
                this.wpsmarshaller = new WpsMarshaller100();
                context = new jsonix.Jsonix.Context([XLink_1_0$1, OWS_1_1_0$1, WPS_1_0_0]);
            }
            else if (this.version === '2.0.0') {
                this.wpsmarshaller = new WpsMarshaller200();
                context = new jsonix.Jsonix.Context([XLink_1_0$1, OWS_2_0, WPS_2_0]);
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
        WpsClient.prototype.getCapabilities = /**
         * @param {?} url
         * @return {?}
         */
        function (url) {
            var _this = this;
            /** @type {?} */
            var getCapabilitiesUrl = this.wpsmarshaller.getCapabilitiesUrl(url);
            return this.getRaw(getCapabilitiesUrl).pipe(operators.map((/**
             * @param {?} response
             * @return {?}
             */
            function (response) {
                /** @type {?} */
                var responseJson = _this.xmlunmarshaller.unmarshalString(response);
                return _this.wpsmarshaller.unmarshalCapabilities(responseJson.value);
            })) // @TODO: handle case when instead of WpsCapabilites an ExceptionReport is returned
            );
        };
        /**
         * @param {?} processId
         * @return {?}
         */
        WpsClient.prototype.describeProcess = /**
         * @param {?} processId
         * @return {?}
         */
        function (processId) {
            throw new Error('Not implemented yet');
        };
        /**
         * @param {?} url
         * @param {?} processId
         * @param {?} inputs
         * @param {?} outputs
         * @param {?=} pollingRate
         * @param {?=} tapFunction
         * @return {?}
         */
        WpsClient.prototype.executeAsync = /**
         * @param {?} url
         * @param {?} processId
         * @param {?} inputs
         * @param {?} outputs
         * @param {?=} pollingRate
         * @param {?=} tapFunction
         * @return {?}
         */
        function (url, processId, inputs, outputs, pollingRate, tapFunction) {
            var _this = this;
            if (pollingRate === void 0) { pollingRate = 1000; }
            /** @type {?} */
            var executeRequest$ = this.executeAsyncS(url, processId, inputs, outputs);
            /** @type {?} */
            var query$ = executeRequest$.pipe(
            // poll until suceeded
            operators.mergeMap((/**
             * @param {?} currentState
             * @return {?}
             */
            function (currentState) {
                /** @type {?} */
                var nextState$ = _this.getNextState(currentState, url, processId, inputs, outputs);
                /** @type {?} */
                var poll$ = pollUntil(nextState$, (/**
                 * @param {?} response
                 * @return {?}
                 */
                function (response) {
                    return response.status === 'Succeeded';
                }), tapFunction, pollingRate);
                return poll$;
            })), 
            // fetch results
            operators.mergeMap((/**
             * @param {?} lastState
             * @return {?}
             */
            function (lastState) {
                return _this.fetchResults(lastState, url, processId, inputs, outputs);
            })), 
            // In case of errors:
            operators.tap((/**
             * @param {?} response
             * @return {?}
             */
            function (response) {
                var e_1, _a;
                try {
                    for (var response_1 = __values(response), response_1_1 = response_1.next(); !response_1_1.done; response_1_1 = response_1.next()) {
                        var result = response_1_1.value;
                        if (result.description.type === 'error') {
                            console.log('server responded with 200, but body contained an error-result: ', result);
                            throw new Error(result.value);
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (response_1_1 && !response_1_1.done && (_a = response_1.return)) _a.call(response_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            })));
            return this.cachedQuery(url, processId, inputs, outputs, query$);
        };
        /**
         * @private
         * @param {?} url
         * @param {?} processId
         * @param {?} inputs
         * @param {?} outputs
         * @param {?} query$
         * @return {?}
         */
        WpsClient.prototype.cachedQuery = /**
         * @private
         * @param {?} url
         * @param {?} processId
         * @param {?} inputs
         * @param {?} outputs
         * @param {?} query$
         * @return {?}
         */
        function (url, processId, inputs, outputs, query$) {
            var _this = this;
            /** @type {?} */
            var cachedResponse$ = this.cache.get({ url: url, processId: processId, inputs: inputs, outputs: outputs });
            return cachedResponse$.pipe(operators.switchMap((/**
             * @param {?} results
             * @return {?}
             */
            function (results) {
                if (results) {
                    return rxjs.of(results);
                }
                else {
                    return query$.pipe(operators.tap((/**
                     * @param {?} response
                     * @return {?}
                     */
                    function (response) {
                        _this.cache.set({ url: url, processId: processId, inputs: inputs, outputs: outputs }, response);
                    })));
                }
            })));
        };
        /**
         * @private
         * @param {?} currentState
         * @param {?} serverUrl
         * @param {?} processId
         * @param {?} inputs
         * @param {?} outputDescriptions
         * @return {?}
         */
        WpsClient.prototype.getNextState = /**
         * @private
         * @param {?} currentState
         * @param {?} serverUrl
         * @param {?} processId
         * @param {?} inputs
         * @param {?} outputDescriptions
         * @return {?}
         */
        function (currentState, serverUrl, processId, inputs, outputDescriptions) {
            var _this = this;
            /** @type {?} */
            var request$;
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
                var execbody = this.wpsmarshaller.marshallGetStatusBody(serverUrl, processId, currentState.jobID);
                /** @type {?} */
                var xmlExecbody = this.xmlmarshaller.marshalString(execbody);
                request$ = this.postRaw(serverUrl, xmlExecbody);
            }
            else {
                throw new Error("'GetStatus' has not yet been implemented for this WPS-Version (" + this.version + ").");
            }
            /** @type {?} */
            var request1$ = request$.pipe(delayedRetry(2000, 2), operators.map((/**
             * @param {?} xmlResponse
             * @return {?}
             */
            function (xmlResponse) {
                /** @type {?} */
                var jsonResponse = _this.xmlunmarshaller.unmarshalString(xmlResponse);
                /** @type {?} */
                var output = _this.wpsmarshaller.unmarshalGetStateResponse(jsonResponse, serverUrl, processId, inputs, outputDescriptions);
                return output;
            })));
            return request1$;
        };
        /**
         * @private
         * @param {?} lastState
         * @param {?} serverUrl
         * @param {?} processId
         * @param {?} inputs
         * @param {?} outputDescriptions
         * @return {?}
         */
        WpsClient.prototype.fetchResults = /**
         * @private
         * @param {?} lastState
         * @param {?} serverUrl
         * @param {?} processId
         * @param {?} inputs
         * @param {?} outputDescriptions
         * @return {?}
         */
        function (lastState, serverUrl, processId, inputs, outputDescriptions) {
            var _this = this;
            if (lastState.results) { // WPS 1.0: results should already be in last state
                return rxjs.of(lastState.results);
            }
            else { // WPS 2.0: get results with post request
                if (!lastState.jobID) {
                    throw new Error("You want me to get a result, but I can't find a jobId. I don't know what to do now!");
                }
                /** @type {?} */
                var execBody = this.wpsmarshaller.marshallGetResultBody(serverUrl, processId, lastState.jobID);
                /** @type {?} */
                var xmlExecBody = this.xmlmarshaller.marshalString(execBody);
                return this.postRaw(serverUrl, xmlExecBody).pipe(operators.map((/**
                 * @param {?} xmlResponse
                 * @return {?}
                 */
                function (xmlResponse) {
                    /** @type {?} */
                    var jsonResponse = _this.xmlunmarshaller.unmarshalString(xmlResponse);
                    /** @type {?} */
                    var output = _this.wpsmarshaller.unmarshalSyncExecuteResponse(jsonResponse, serverUrl, processId, inputs, outputDescriptions);
                    return output;
                })));
            }
        };
        /**
         * @private
         * @param {?} url
         * @param {?} processId
         * @param {?} inputs
         * @param {?} outputDescriptions
         * @return {?}
         */
        WpsClient.prototype.executeAsyncS = /**
         * @private
         * @param {?} url
         * @param {?} processId
         * @param {?} inputs
         * @param {?} outputDescriptions
         * @return {?}
         */
        function (url, processId, inputs, outputDescriptions) {
            var _this = this;
            /** @type {?} */
            var executeUrl = this.wpsmarshaller.executeUrl(url, processId);
            /** @type {?} */
            var execbody = this.wpsmarshaller.marshalExecBody(processId, inputs, outputDescriptions, true);
            /** @type {?} */
            var xmlExecbody = this.xmlmarshaller.marshalString(execbody);
            return this.postRaw(executeUrl, xmlExecbody).pipe(operators.map((/**
             * @param {?} xmlResponse
             * @return {?}
             */
            function (xmlResponse) {
                /** @type {?} */
                var jsonResponse = _this.xmlunmarshaller.unmarshalString(xmlResponse);
                /** @type {?} */
                var output = _this.wpsmarshaller.unmarshalAsyncExecuteResponse(jsonResponse, url, processId, inputs, outputDescriptions);
                return output;
            })));
        };
        /**
         * @param {?} url
         * @param {?} processId
         * @param {?} inputs
         * @param {?} outputDescriptions
         * @return {?}
         */
        WpsClient.prototype.execute = /**
         * @param {?} url
         * @param {?} processId
         * @param {?} inputs
         * @param {?} outputDescriptions
         * @return {?}
         */
        function (url, processId, inputs, outputDescriptions) {
            var _this = this;
            /** @type {?} */
            var executeUrl = this.wpsmarshaller.executeUrl(url, processId);
            /** @type {?} */
            var execbody = this.wpsmarshaller.marshalExecBody(processId, inputs, outputDescriptions, false);
            /** @type {?} */
            var xmlExecbody = this.xmlmarshaller.marshalString(execbody);
            return this.postRaw(executeUrl, xmlExecbody).pipe(operators.map((/**
             * @param {?} xmlResponse
             * @return {?}
             */
            function (xmlResponse) {
                /** @type {?} */
                var jsonResponse = _this.xmlunmarshaller.unmarshalString(xmlResponse);
                /** @type {?} */
                var output = _this.wpsmarshaller.unmarshalSyncExecuteResponse(jsonResponse, url, processId, inputs, outputDescriptions);
                return output;
            })));
        };
        /**
         * @param {?} serverUrl
         * @param {?} processId
         * @param {?} jobId
         * @return {?}
         */
        WpsClient.prototype.dismiss = /**
         * @param {?} serverUrl
         * @param {?} processId
         * @param {?} jobId
         * @return {?}
         */
        function (serverUrl, processId, jobId) {
            var _this = this;
            /** @type {?} */
            var dismissUrl = this.wpsmarshaller.dismissUrl(serverUrl, processId, jobId);
            /** @type {?} */
            var dismissBody = this.wpsmarshaller.marshalDismissBody(jobId);
            /** @type {?} */
            var xmlDismissBody = this.xmlmarshaller.marshalString(dismissBody);
            return this.postRaw(dismissUrl, xmlDismissBody).pipe(operators.map((/**
             * @param {?} xmlResponse
             * @return {?}
             */
            function (xmlResponse) {
                /** @type {?} */
                var jsonResponse = _this.xmlunmarshaller.unmarshalString(xmlResponse);
                /** @type {?} */
                var output = _this.wpsmarshaller.unmarshalDismissResponse(jsonResponse, serverUrl, processId);
                return output;
            })));
        };
        /**
         * @param {?} url
         * @param {?} xmlBody
         * @return {?}
         */
        WpsClient.prototype.postRaw = /**
         * @param {?} url
         * @param {?} xmlBody
         * @return {?}
         */
        function (url, xmlBody) {
            /** @type {?} */
            var headers = {
                'Content-Type': 'text/xml',
                'Accept': 'text/xml, application/xml'
            };
            return this.webclient.post(url, xmlBody, { headers: headers, responseType: 'text' }).pipe(delayedRetry(2000, 2), operators.share() // turning hot: to make sure that multiple subscribers dont cause multiple requests
            );
        };
        /**
         * @param {?} url
         * @return {?}
         */
        WpsClient.prototype.getRaw = /**
         * @param {?} url
         * @return {?}
         */
        function (url) {
            /** @type {?} */
            var headers = {
                'Accept': 'text/xml, application/xml'
            };
            return this.webclient.get(url, { headers: headers, responseType: 'text' }).pipe(delayedRetry(2000, 2));
        };
        WpsClient.decorators = [
            { type: core.Injectable }
        ];
        /** @nocollapse */
        WpsClient.ctorParameters = function () { return [
            { type: undefined, decorators: [{ type: core.Inject, args: ['WpsVersion',] }] },
            { type: http.HttpClient },
            { type: undefined, decorators: [{ type: core.Inject, args: ['WpsCache',] }] }
        ]; };
        return WpsClient;
    }());
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
    var ServicesOgcModule = /** @class */ (function () {
        function ServicesOgcModule() {
        }
        ServicesOgcModule.decorators = [
            { type: core.NgModule, args: [{
                        declarations: [],
                        imports: [],
                        exports: [],
                        providers: [OwcJsonService, WmtsClientService, WpsClient]
                    },] }
        ];
        return ServicesOgcModule;
    }());

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
    var isBbox = (/**
     * @param {?} obj
     * @return {?}
     */
    function (obj) {
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

    exports.FakeCache = FakeCache;
    exports.OwcJsonService = OwcJsonService;
    exports.ServicesOgcModule = ServicesOgcModule;
    exports.WmtsClientService = WmtsClientService;
    exports.WpsClient = WpsClient;
    exports.isBbox = isBbox;
    exports.isCswOffering = isCswOffering;
    exports.isGMLCOVOffering = isGMLCOVOffering;
    exports.isGMLJP2Offering = isGMLJP2Offering;
    exports.isGeoJsonOffering = isGeoJsonOffering;
    exports.isGeoTIFFOffering = isGeoTIFFOffering;
    exports.isGmlOffering = isGmlOffering;
    exports.isKmlOffering = isKmlOffering;
    exports.isWfsOffering = isWfsOffering;
    exports.isWmsOffering = isWmsOffering;
    exports.isWmtsOffering = isWmtsOffering;
    exports.isWpsOffering = isWpsOffering;
    exports.isWpsState = isWpsState;
    exports.isXyzOffering = isXyzOffering;
    exports.shardsExpand = shardsExpand;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ukis-services-ogc.umd.js.map
