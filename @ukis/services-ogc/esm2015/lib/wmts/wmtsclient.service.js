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
const XLink_1_0 = XLink_1_0_Factory.XLink_1_0;
import * as OWS_1_1_0_Factory from 'ogc-schemas/lib/OWS_1_1_0';
/** @type {?} */
const OWS_1_1_0 = OWS_1_1_0_Factory.OWS_1_1_0;
import * as SMIL_2_0_Factory from 'ogc-schemas/lib/SMIL_2_0';
/** @type {?} */
const SMIL_2_0 = SMIL_2_0_Factory.SMIL_2_0;
import * as SMIL_2_0_Language_Factory from 'ogc-schemas/lib/SMIL_2_0_Language';
/** @type {?} */
const SMIL_2_0_Language = SMIL_2_0_Language_Factory.SMIL_2_0_Language;
import * as GML_3_1_1_Factory from 'ogc-schemas/lib/GML_3_1_1';
/** @type {?} */
const GML_3_1_1 = GML_3_1_1_Factory.GML_3_1_1;
import * as WMTS_1_0_Factory from 'ogc-schemas/lib/WMTS_1_0';
/** @type {?} */
const WMTS_1_0 = WMTS_1_0_Factory.WMTS_1_0;
export class WmtsClientService {
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
/** @nocollapse */ WmtsClientService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function WmtsClientService_Factory() { return new WmtsClientService(i0.ɵɵinject(i1.HttpClient)); }, token: WmtsClientService, providedIn: "root" });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid210c2NsaWVudC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHVraXMvc2VydmljZXMtb2djLyIsInNvdXJjZXMiOlsibGliL3dtdHMvd210c2NsaWVudC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRS9ELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDckMsT0FBTyxLQUFLLGlCQUFpQixNQUFNLDJCQUEyQixDQUFDOzs7O01BQ3pELFNBQVMsR0FBRyxpQkFBaUIsQ0FBQyxTQUFTO0FBQzdDLE9BQU8sS0FBSyxpQkFBaUIsTUFBTSwyQkFBMkIsQ0FBQzs7TUFDekQsU0FBUyxHQUFHLGlCQUFpQixDQUFDLFNBQVM7QUFDN0MsT0FBTyxLQUFLLGdCQUFnQixNQUFNLDBCQUEwQixDQUFDOztNQUN2RCxRQUFRLEdBQUcsZ0JBQWdCLENBQUMsUUFBUTtBQUMxQyxPQUFPLEtBQUsseUJBQXlCLE1BQU0sbUNBQW1DLENBQUM7O01BQ3pFLGlCQUFpQixHQUFHLHlCQUF5QixDQUFDLGlCQUFpQjtBQUNyRSxPQUFPLEtBQUssaUJBQWlCLE1BQU0sMkJBQTJCLENBQUM7O01BQ3pELFNBQVMsR0FBRyxpQkFBaUIsQ0FBQyxTQUFTO0FBQzdDLE9BQU8sS0FBSyxnQkFBZ0IsTUFBTSwwQkFBMEIsQ0FBQzs7TUFDdkQsUUFBUSxHQUFHLGdCQUFnQixDQUFDLFFBQVE7QUFPMUMsTUFBTSxPQUFPLGlCQUFpQjs7OztJQUsxQixZQUFvQixJQUFnQjtRQUFoQixTQUFJLEdBQUosSUFBSSxDQUFZOztjQUMxQixPQUFPLEdBQUcsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxFQUFFLGlCQUFpQixFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzVHLElBQUksQ0FBQyxlQUFlLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDcEQsSUFBSSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztJQUNwRCxDQUFDOzs7Ozs7SUFFTSxlQUFlLENBQUUsR0FBVyxFQUFFLE9BQU8sR0FBRyxPQUFPOzs7Y0FFNUMsa0JBQWtCLEdBQUcsR0FBRyxHQUFHLGlEQUFpRCxPQUFPLEVBQUU7O2NBQ3JGLE9BQU8sR0FBRyxJQUFJLFdBQVcsQ0FBQztZQUM1QixjQUFjLEVBQUUsVUFBVTtZQUMxQixRQUFRLEVBQUUsMkJBQTJCO1NBQ3hDLENBQUM7UUFDRixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FDNUUsR0FBRzs7OztRQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ1gsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMxRCxDQUFDLEVBQUMsQ0FDTCxDQUFDO0lBQ04sQ0FBQzs7O1lBMUJKLFVBQVUsU0FBQztnQkFDUixVQUFVLEVBQUUsTUFBTTthQUNyQjs7OztZQXJCUSxVQUFVOzs7Ozs7OztJQXdCZiwwQ0FBc0I7Ozs7O0lBQ3RCLDRDQUF3Qjs7Ozs7SUFFWixpQ0FBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IEpzb25peCB9IGZyb20gJ0Bib3VuZGxlc3NnZW8vanNvbml4JztcclxuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgKiBhcyBYTGlua18xXzBfRmFjdG9yeSBmcm9tICd3M2Mtc2NoZW1hcy9saWIvWExpbmtfMV8wJztcclxuY29uc3QgWExpbmtfMV8wID0gWExpbmtfMV8wX0ZhY3RvcnkuWExpbmtfMV8wO1xyXG5pbXBvcnQgKiBhcyBPV1NfMV8xXzBfRmFjdG9yeSBmcm9tICdvZ2Mtc2NoZW1hcy9saWIvT1dTXzFfMV8wJztcclxuY29uc3QgT1dTXzFfMV8wID0gT1dTXzFfMV8wX0ZhY3RvcnkuT1dTXzFfMV8wO1xyXG5pbXBvcnQgKiBhcyBTTUlMXzJfMF9GYWN0b3J5IGZyb20gJ29nYy1zY2hlbWFzL2xpYi9TTUlMXzJfMCc7XHJcbmNvbnN0IFNNSUxfMl8wID0gU01JTF8yXzBfRmFjdG9yeS5TTUlMXzJfMDtcclxuaW1wb3J0ICogYXMgU01JTF8yXzBfTGFuZ3VhZ2VfRmFjdG9yeSBmcm9tICdvZ2Mtc2NoZW1hcy9saWIvU01JTF8yXzBfTGFuZ3VhZ2UnO1xyXG5jb25zdCBTTUlMXzJfMF9MYW5ndWFnZSA9IFNNSUxfMl8wX0xhbmd1YWdlX0ZhY3RvcnkuU01JTF8yXzBfTGFuZ3VhZ2U7XHJcbmltcG9ydCAqIGFzIEdNTF8zXzFfMV9GYWN0b3J5IGZyb20gJ29nYy1zY2hlbWFzL2xpYi9HTUxfM18xXzEnO1xyXG5jb25zdCBHTUxfM18xXzEgPSBHTUxfM18xXzFfRmFjdG9yeS5HTUxfM18xXzE7XHJcbmltcG9ydCAqIGFzIFdNVFNfMV8wX0ZhY3RvcnkgZnJvbSAnb2djLXNjaGVtYXMvbGliL1dNVFNfMV8wJztcclxuY29uc3QgV01UU18xXzAgPSBXTVRTXzFfMF9GYWN0b3J5LldNVFNfMV8wO1xyXG5cclxuXHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIFdtdHNDbGllbnRTZXJ2aWNlIHtcclxuXHJcbiAgICBwcml2YXRlIHhtbG1hcnNoYWxsZXI7XHJcbiAgICBwcml2YXRlIHhtbHVubWFyc2hhbGxlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgICAgICBjb25zdCBjb250ZXh0ID0gbmV3IEpzb25peC5Db250ZXh0KFtTTUlMXzJfMCwgU01JTF8yXzBfTGFuZ3VhZ2UsIEdNTF8zXzFfMSwgWExpbmtfMV8wLCBPV1NfMV8xXzAsIFdNVFNfMV8wXSk7XHJcbiAgICAgICAgdGhpcy54bWx1bm1hcnNoYWxsZXIgPSBjb250ZXh0LmNyZWF0ZVVubWFyc2hhbGxlcigpO1xyXG4gICAgICAgIHRoaXMueG1sbWFyc2hhbGxlciA9IGNvbnRleHQuY3JlYXRlTWFyc2hhbGxlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDYXBhYmlsaXRpZXMgKHVybDogc3RyaW5nLCB2ZXJzaW9uID0gJzEuMS4wJyk6IE9ic2VydmFibGU8b2JqZWN0PiB7XHJcbiAgICAgICAgLy8gZXhhbXBsZTogaHR0cHM6Ly90aWxlcy5nZW9zZXJ2aWNlLmRsci5kZS9zZXJ2aWNlL3dtdHM/U0VSVklDRT1XTVRTJlJFUVVFU1Q9R2V0Q2FwYWJpbGl0aWVzJlZFUlNJT049MS4xLjBcclxuICAgICAgICBjb25zdCBnZXRDYXBhYmlsaXRpZXNVcmwgPSBgJHt1cmx9P1NFUlZJQ0U9V01UUyZSRVFVRVNUPUdldENhcGFiaWxpdGllcyZWRVJTSU9OPSR7dmVyc2lvbn1gO1xyXG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoe1xyXG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ3RleHQveG1sJyxcclxuICAgICAgICAgICAgJ0FjY2VwdCc6ICd0ZXh0L3htbCwgYXBwbGljYXRpb24veG1sJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KGdldENhcGFiaWxpdGllc1VybCwgeyBoZWFkZXJzLCByZXNwb25zZVR5cGU6ICd0ZXh0JyB9KS5waXBlKFxyXG4gICAgICAgICAgICBtYXAocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMueG1sdW5tYXJzaGFsbGVyLnVubWFyc2hhbFN0cmluZyhyZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbn0iXX0=