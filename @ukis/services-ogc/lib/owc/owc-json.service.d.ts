import { IOwsContext, IOwsResource, IOwsOffering, IOwsOperation, IOwsContent, WMS_Offering, WFS_Offering, WCS_Offering, CSW_Offering, WMTS_Offering, GML_Offering, KML_Offering, GeoTIFF_Offering, GMLJP2_Offering, GMLCOV_Offering } from './types/owc-json';
import { IEocOwsContext, IEocOwsResource, IEocOwsOffering, GeoJson_Offering, Xyz_Offering } from './types/eoc-owc-json';
import { VectorLayer, RasterLayer, Layer, TLayertype, ILayerDimensions, ILayerIntervalAndPeriod } from '@ukis/services-layers';
import { TGeoExtent } from '@ukis/services-map-state';
import { WmtsClientService } from '../wmts/wmtsclient.service';
import { Observable } from 'rxjs';
export declare function isWmsOffering(str: string): str is WMS_Offering;
export declare function isWfsOffering(str: string): str is WFS_Offering;
export declare function isWpsOffering(str: string): str is WCS_Offering;
export declare function isCswOffering(str: string): str is CSW_Offering;
export declare function isWmtsOffering(str: string): str is WMTS_Offering;
export declare function isGmlOffering(str: string): str is GML_Offering;
export declare function isKmlOffering(str: string): str is KML_Offering;
export declare function isGeoTIFFOffering(str: string): str is GeoTIFF_Offering;
export declare function isGMLJP2Offering(str: string): str is GMLJP2_Offering;
export declare function isGMLCOVOffering(str: string): str is GMLCOV_Offering;
export declare function isXyzOffering(str: string): str is Xyz_Offering;
export declare function isGeoJsonOffering(str: string): str is GeoJson_Offering;
export declare function shardsExpand(v: string): any[];
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
export declare class OwcJsonService {
    private wmtsClient;
    constructor(wmtsClient: WmtsClientService);
    checkContext(context: IOwsContext): any;
    getContextTitle(context: IOwsContext): string;
    getContextPublisher(context: IOwsContext): string;
    getContextExtent(context: IOwsContext): import("geojson").BBox;
    getResources(context: IOwsContext): IOwsResource[];
    /** Resource --------------------------------------------------- */
    getResourceTitle(resource: IOwsResource): string;
    getResourceUpdated(resource: IOwsResource): string;
    getResourceDate(resource: IOwsResource): string;
    getResourceOfferings(resource: IOwsResource): IOwsOffering[];
    /**
     * retrieve layer status active / inactive based on IOwsResource
     * @param resource: IOwsResource
     */
    isActive(resource: IOwsResource): boolean;
    getResourceOpacity(resource: IOwsResource): number;
    getResourceAttribution(resource: IOwsResource): string;
    getResourceShards(resource: IOwsResource): string;
    convertOwcTimeToIsoTimeAndPeriodicity(owctime: string): ILayerIntervalAndPeriod | string;
    getResourceDimensions(resource: IOwsResource): ILayerDimensions;
    /** Offering --------------------------------------------------- */
    getLayertypeFromOfferingCode(offering: IOwsOffering): TLayertype;
    checkIfServiceOffering(offering: IOwsOffering): boolean;
    checkIfDataOffering(offering: IOwsOffering): boolean;
    getOfferingContents(offering: IOwsOffering): IOwsOperation[] | IOwsContent[];
    /**
     * Helper function to extract legendURL from project specific ows Context
     * @param offering layer offering
     */
    getLegendUrl(offering: IOwsOffering): string;
    /**
     * retrieve iconUrl based on IOwsOffering
     * @param offering
     */
    getIconUrl(offering: IOwsOffering): string;
    /**
     * layer priority: first wms, then wmts, then wfs, then others.
     */
    getLayers(owc: IOwsContext, targetProjection: string): Observable<Layer[]>;
    createLayerFromOffering(offering: IOwsOffering, resource: IOwsResource, context: IOwsContext, targetProjection: string): Observable<Layer>;
    createVectorLayerFromOffering(offering: IOwsOffering, resource: IOwsResource, context?: IOwsContext): Observable<VectorLayer>;
    createRasterLayerFromOffering(offering: IOwsOffering, resource: IOwsResource, context: IOwsContext, targetProjection: string): Observable<RasterLayer>;
    private createWmtsLayerFromOffering;
    private createWmsLayerFromOffering;
    private getWmtsOptions;
    private getLayerForWMTS;
    private parseOperationUrl;
    private getMatrixSetForWMTS;
    private getWmsOptions;
    private getRasterLayerOptions;
    private getLayerOptions;
    /** Misc --------------------------------------------------- */
    private getUrlFromUri;
    /**
     * helper to pack query-parameters of a uri into a JSON
     * @param uri any uri with query-parameters
     */
    private getJsonFromUri;
    /**
     * retrieve display name of layer, based on IOwsResource and IOwsOffering
     * @param offering
     * @param resource
     */
    private getDisplayName;
    /**------------ DATA TO FILE -----------------------------------------*/
    /**
     * @TODO:
     *   - properties
     */
    generateOwsContextFrom(id: string, layers: Layer[], extent?: TGeoExtent, properties?: any): IEocOwsContext;
    generateResourceFromLayer(layer: Layer): IEocOwsResource;
    generateOfferingFromLayer(layer: Layer, legendUrl?: string, iconUrl?: string): IEocOwsOffering;
    getOfferingCodeFromLayer(layer: Layer): string;
    getContentsFromLayer(layer: VectorLayer): IOwsContent[];
    getOperationsFromLayer(layer: Layer): IOwsOperation[];
    getXyzOperationsFromLayer(layer: RasterLayer): IOwsOperation[];
    getTmsOperationsFromLayer(layer: RasterLayer): IOwsOperation[];
    getWfsOperationsFromLayer(layer: VectorLayer): IOwsOperation[];
    getWmsOperationsFromLayer(layer: RasterLayer): IOwsOperation[];
    getWmtsOperationsFromLayer(layer: RasterLayer): IOwsOperation[];
}
