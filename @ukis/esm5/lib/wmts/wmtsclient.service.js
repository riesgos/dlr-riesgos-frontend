/**
 * @fileoverview added by tsickle
 * Generated from: lib/wmts/wmtsclient.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Jsonix } from '@boundlessgeo/jsonix';
import { map } from 'rxjs/operators';
import * as XLink_1_0_Factory from 'w3c-schemas/lib/XLink_1_0';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
/** @type {?} */
var XLink_1_0 = XLink_1_0_Factory.XLink_1_0;
import * as OWS_1_1_0_Factory from 'ogc-schemas/lib/OWS_1_1_0';
/** @type {?} */
var OWS_1_1_0 = OWS_1_1_0_Factory.OWS_1_1_0;
import * as SMIL_2_0_Factory from 'ogc-schemas/lib/SMIL_2_0';
/** @type {?} */
var SMIL_2_0 = SMIL_2_0_Factory.SMIL_2_0;
import * as SMIL_2_0_Language_Factory from 'ogc-schemas/lib/SMIL_2_0_Language';
/** @type {?} */
var SMIL_2_0_Language = SMIL_2_0_Language_Factory.SMIL_2_0_Language;
import * as GML_3_1_1_Factory from 'ogc-schemas/lib/GML_3_1_1';
/** @type {?} */
var GML_3_1_1 = GML_3_1_1_Factory.GML_3_1_1;
import * as WMTS_1_0_Factory from 'ogc-schemas/lib/WMTS_1_0';
/** @type {?} */
var WMTS_1_0 = WMTS_1_0_Factory.WMTS_1_0;
var WmtsClientService = /** @class */ (function () {
    function WmtsClientService(http) {
        this.http = http;
        /** @type {?} */
        var context = new Jsonix.Context([SMIL_2_0, SMIL_2_0_Language, GML_3_1_1, XLink_1_0, OWS_1_1_0, WMTS_1_0]);
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
        var headers = new HttpHeaders({
            'Content-Type': 'text/xml',
            'Accept': 'text/xml, application/xml'
        });
        return this.http.get(getCapabilitiesUrl, { headers: headers, responseType: 'text' }).pipe(map((/**
         * @param {?} response
         * @return {?}
         */
        function (response) {
            return _this.xmlunmarshaller.unmarshalString(response);
        })));
    };
    WmtsClientService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    /** @nocollapse */
    WmtsClientService.ctorParameters = function () { return [
        { type: HttpClient }
    ]; };
    /** @nocollapse */ WmtsClientService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function WmtsClientService_Factory() { return new WmtsClientService(i0.ɵɵinject(i1.HttpClient)); }, token: WmtsClientService, providedIn: "root" });
    return WmtsClientService;
}());
export { WmtsClientService };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid210c2NsaWVudC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHVraXMvc2VydmljZXMtb2djLyIsInNvdXJjZXMiOlsibGliL3dtdHMvd210c2NsaWVudC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRS9ELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDckMsT0FBTyxLQUFLLGlCQUFpQixNQUFNLDJCQUEyQixDQUFDOzs7O0lBQ3pELFNBQVMsR0FBRyxpQkFBaUIsQ0FBQyxTQUFTO0FBQzdDLE9BQU8sS0FBSyxpQkFBaUIsTUFBTSwyQkFBMkIsQ0FBQzs7SUFDekQsU0FBUyxHQUFHLGlCQUFpQixDQUFDLFNBQVM7QUFDN0MsT0FBTyxLQUFLLGdCQUFnQixNQUFNLDBCQUEwQixDQUFDOztJQUN2RCxRQUFRLEdBQUcsZ0JBQWdCLENBQUMsUUFBUTtBQUMxQyxPQUFPLEtBQUsseUJBQXlCLE1BQU0sbUNBQW1DLENBQUM7O0lBQ3pFLGlCQUFpQixHQUFHLHlCQUF5QixDQUFDLGlCQUFpQjtBQUNyRSxPQUFPLEtBQUssaUJBQWlCLE1BQU0sMkJBQTJCLENBQUM7O0lBQ3pELFNBQVMsR0FBRyxpQkFBaUIsQ0FBQyxTQUFTO0FBQzdDLE9BQU8sS0FBSyxnQkFBZ0IsTUFBTSwwQkFBMEIsQ0FBQzs7SUFDdkQsUUFBUSxHQUFHLGdCQUFnQixDQUFDLFFBQVE7QUFJMUM7SUFRSSwyQkFBb0IsSUFBZ0I7UUFBaEIsU0FBSSxHQUFKLElBQUksQ0FBWTs7WUFDMUIsT0FBTyxHQUFHLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUM1RyxJQUFJLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQ3BELElBQUksQ0FBQyxhQUFhLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDcEQsQ0FBQzs7Ozs7O0lBRU0sMkNBQWU7Ozs7O0lBQXRCLFVBQXdCLEdBQVcsRUFBRSxPQUFpQjtRQUF0RCxpQkFZQztRQVpvQyx3QkFBQSxFQUFBLGlCQUFpQjs7O1lBRTVDLGtCQUFrQixHQUFNLEdBQUcsc0RBQWlELE9BQVM7O1lBQ3JGLE9BQU8sR0FBRyxJQUFJLFdBQVcsQ0FBQztZQUM1QixjQUFjLEVBQUUsVUFBVTtZQUMxQixRQUFRLEVBQUUsMkJBQTJCO1NBQ3hDLENBQUM7UUFDRixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLEVBQUUsT0FBTyxTQUFBLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUM1RSxHQUFHOzs7O1FBQUMsVUFBQSxRQUFRO1lBQ1IsT0FBTyxLQUFJLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMxRCxDQUFDLEVBQUMsQ0FDTCxDQUFDO0lBQ04sQ0FBQzs7Z0JBMUJKLFVBQVUsU0FBQztvQkFDUixVQUFVLEVBQUUsTUFBTTtpQkFDckI7Ozs7Z0JBckJRLFVBQVU7Ozs0QkFEbkI7Q0FnREMsQUE1QkQsSUE0QkM7U0F6QlksaUJBQWlCOzs7Ozs7SUFFMUIsMENBQXNCOzs7OztJQUN0Qiw0Q0FBd0I7Ozs7O0lBRVosaUNBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBKc29uaXggfSBmcm9tICdAYm91bmRsZXNzZ2VvL2pzb25peCc7XHJcbmltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0ICogYXMgWExpbmtfMV8wX0ZhY3RvcnkgZnJvbSAndzNjLXNjaGVtYXMvbGliL1hMaW5rXzFfMCc7XHJcbmNvbnN0IFhMaW5rXzFfMCA9IFhMaW5rXzFfMF9GYWN0b3J5LlhMaW5rXzFfMDtcclxuaW1wb3J0ICogYXMgT1dTXzFfMV8wX0ZhY3RvcnkgZnJvbSAnb2djLXNjaGVtYXMvbGliL09XU18xXzFfMCc7XHJcbmNvbnN0IE9XU18xXzFfMCA9IE9XU18xXzFfMF9GYWN0b3J5Lk9XU18xXzFfMDtcclxuaW1wb3J0ICogYXMgU01JTF8yXzBfRmFjdG9yeSBmcm9tICdvZ2Mtc2NoZW1hcy9saWIvU01JTF8yXzAnO1xyXG5jb25zdCBTTUlMXzJfMCA9IFNNSUxfMl8wX0ZhY3RvcnkuU01JTF8yXzA7XHJcbmltcG9ydCAqIGFzIFNNSUxfMl8wX0xhbmd1YWdlX0ZhY3RvcnkgZnJvbSAnb2djLXNjaGVtYXMvbGliL1NNSUxfMl8wX0xhbmd1YWdlJztcclxuY29uc3QgU01JTF8yXzBfTGFuZ3VhZ2UgPSBTTUlMXzJfMF9MYW5ndWFnZV9GYWN0b3J5LlNNSUxfMl8wX0xhbmd1YWdlO1xyXG5pbXBvcnQgKiBhcyBHTUxfM18xXzFfRmFjdG9yeSBmcm9tICdvZ2Mtc2NoZW1hcy9saWIvR01MXzNfMV8xJztcclxuY29uc3QgR01MXzNfMV8xID0gR01MXzNfMV8xX0ZhY3RvcnkuR01MXzNfMV8xO1xyXG5pbXBvcnQgKiBhcyBXTVRTXzFfMF9GYWN0b3J5IGZyb20gJ29nYy1zY2hlbWFzL2xpYi9XTVRTXzFfMCc7XHJcbmNvbnN0IFdNVFNfMV8wID0gV01UU18xXzBfRmFjdG9yeS5XTVRTXzFfMDtcclxuXHJcblxyXG5cclxuQEluamVjdGFibGUoe1xyXG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBXbXRzQ2xpZW50U2VydmljZSB7XHJcblxyXG4gICAgcHJpdmF0ZSB4bWxtYXJzaGFsbGVyO1xyXG4gICAgcHJpdmF0ZSB4bWx1bm1hcnNoYWxsZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICAgICAgY29uc3QgY29udGV4dCA9IG5ldyBKc29uaXguQ29udGV4dChbU01JTF8yXzAsIFNNSUxfMl8wX0xhbmd1YWdlLCBHTUxfM18xXzEsIFhMaW5rXzFfMCwgT1dTXzFfMV8wLCBXTVRTXzFfMF0pO1xyXG4gICAgICAgIHRoaXMueG1sdW5tYXJzaGFsbGVyID0gY29udGV4dC5jcmVhdGVVbm1hcnNoYWxsZXIoKTtcclxuICAgICAgICB0aGlzLnhtbG1hcnNoYWxsZXIgPSBjb250ZXh0LmNyZWF0ZU1hcnNoYWxsZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q2FwYWJpbGl0aWVzICh1cmw6IHN0cmluZywgdmVyc2lvbiA9ICcxLjEuMCcpOiBPYnNlcnZhYmxlPG9iamVjdD4ge1xyXG4gICAgICAgIC8vIGV4YW1wbGU6IGh0dHBzOi8vdGlsZXMuZ2Vvc2VydmljZS5kbHIuZGUvc2VydmljZS93bXRzP1NFUlZJQ0U9V01UUyZSRVFVRVNUPUdldENhcGFiaWxpdGllcyZWRVJTSU9OPTEuMS4wXHJcbiAgICAgICAgY29uc3QgZ2V0Q2FwYWJpbGl0aWVzVXJsID0gYCR7dXJsfT9TRVJWSUNFPVdNVFMmUkVRVUVTVD1HZXRDYXBhYmlsaXRpZXMmVkVSU0lPTj0ke3ZlcnNpb259YDtcclxuICAgICAgICBjb25zdCBoZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKHtcclxuICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICd0ZXh0L3htbCcsXHJcbiAgICAgICAgICAgICdBY2NlcHQnOiAndGV4dC94bWwsIGFwcGxpY2F0aW9uL3htbCdcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldChnZXRDYXBhYmlsaXRpZXNVcmwsIHsgaGVhZGVycywgcmVzcG9uc2VUeXBlOiAndGV4dCcgfSkucGlwZShcclxuICAgICAgICAgICAgbWFwKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnhtbHVubWFyc2hhbGxlci51bm1hcnNoYWxTdHJpbmcocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG59Il19