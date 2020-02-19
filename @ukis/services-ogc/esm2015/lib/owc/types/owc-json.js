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
export function IOwsContext() { }
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
export function IOwsResource() { }
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
export function IOwsResourceProperties() { }
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
export function IOwsOffering() { }
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
export function IOwsCreator() { }
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
export function IOwsAuthor() { }
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
export function IOwsCategorie() { }
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
export function IOwsLinks() { }
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
export function IOwsCreatorApplication() { }
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
export function IOwsCreatorDisplay() { }
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
export function IOwsOperation() { }
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
export function IOwsContent() { }
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
export function IOwsStyleSet() { }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3djLWpzb24uanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AdWtpcy9zZXJ2aWNlcy1vZ2MvIiwic291cmNlcyI6WyJsaWIvb3djL3R5cGVzL293Yy1qc29uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBZ0JBLGlDQTJDQzs7Ozs7OztJQXRDQyx5QkFBb0I7O0lBQ3BCLGlDQWdDRTs7Ozs7SUFFRiwrQkFBeUI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQjNCLGtDQVFDOzs7Ozs7O0lBSEMsMEJBQW9COztJQUNwQixrQ0FBbUM7Ozs7OztBQUlyQyw0Q0FnQ0M7Ozs7OztJQTlCQyx1Q0FBYzs7Ozs7SUFFZCx5Q0FBb0I7Ozs7O0lBRXBCLDBDQUFrQjs7Ozs7SUFFbEIseUNBQXVCOzs7OztJQUV2QiwyQ0FBbUI7Ozs7O0lBRW5CLHdDQUFnQjs7Ozs7SUFFaEIsc0NBQWtCOzs7OztJQUVsQiwyQ0FBMkI7Ozs7O0lBRTNCLHdDQUFpQjs7Ozs7SUFFakIsNENBQTZCOzs7OztJQUU3QixxREFBNkI7Ozs7O0lBRTdCLHFEQUE2Qjs7Ozs7O0lBSTdCLHdDQUFnQjs7Ozs7SUFFaEIsdUNBQW9COzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QnRCLGtDQVVDOzs7Ozs7SUFSQyw0QkFDNEY7Ozs7O0lBRTVGLGtDQUE2Qjs7Ozs7SUFFN0IsZ0NBQXlCOztJQUN6Qiw4QkFBd0I7Ozs7OztBQUsxQixpQ0FJQzs7O0lBSEMsNEJBQWU7O0lBQ2YsMEJBQWE7O0lBQ2IsOEJBQWlCOzs7OztBQUduQixnQ0FNQzs7Ozs7O0lBSkMsMEJBQWM7O0lBQ2QsMkJBQWU7O0lBQ2YseUJBQWE7Ozs7OztBQUlmLG1DQUtDOzs7SUFKQywrQkFBZ0I7Ozs7O0lBRWhCLDZCQUFjOztJQUNkLDhCQUFlOzs7OztBQUdqQiwrQkFTQzs7O0lBUkMsd0JBQVk7O0lBQ1oseUJBQWM7O0lBQ2QseUJBQWM7O0lBQ2QsMEJBQWU7Ozs7O0lBRWYsK0JBQW9COztJQUNwQix5QkFBa0I7Ozs7OztBQUlwQiw0Q0FJQzs7O0lBSEMsdUNBQWU7O0lBQ2YscUNBQWE7O0lBQ2IseUNBQWlCOzs7OztBQUduQix3Q0FTQzs7Ozs7O0lBUEMsd0NBQW9COzs7OztJQUVwQix5Q0FBcUI7Ozs7OztJQUdyQix3Q0FBb0I7Ozs7Ozs7QUFPdEIsbUNBZUM7Ozs7Ozs7SUFWQyw2QkFBYTs7Ozs7SUFFYiwrQkFBZTs7SUFDZiw2QkFBYzs7Ozs7SUFFZCw2QkFBYzs7SUFDZCxnQ0FBc0I7O0lBQ3RCLCtCQUFxQjs7Ozs7O0FBTXZCLGlDQVFDOzs7Ozs7SUFOQywyQkFBYTs7SUFDYiwyQkFBYzs7SUFDZCw0QkFBZTs7Ozs7SUFFZiw4QkFBaUI7Ozs7OztBQUluQixrQ0FRQzs7O0lBUEMsNEJBQWE7O0lBQ2IsNkJBQWM7O0lBQ2QsZ0NBQWtCOztJQUNsQiwrQkFBa0I7O0lBQ2xCLGlDQUFtQjs7SUFDbkIsK0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIFR5cGUgZGVmaW5pdGlvbnMgZm9yIE9HQyBPV1MgQ29udGV4dCBHZW8gRW5jb2RpbmcgU3RhbmRhcmQgVmVyc2lvbjogMS4wXHJcbiAqIGh0dHA6Ly9kb2NzLm9wZW5nZW9zcGF0aWFsLm9yZy9pcy8xNC0wNTVyMi8xNC0wNTVyMi5odG1sXHJcbiAqIERlZmluaXRpb25zIGJ5OiBNYXRoaWFzIEJvZWNrXHJcbiAqIFR5cGVTY3JpcHQgVmVyc2lvbjogMi41LjNcclxuICpcclxuICogZGVwZW5kcyBvbiBAdHlwZXMvZ2VvanNvbkBeNzk0Ni4wLjJcclxuICovXHJcbmltcG9ydCAqIGFzIEdlb0pTT04gZnJvbSAnZ2VvanNvbic7XHJcblxyXG5cclxuLyoqXHJcbiAqIFRoZSBPV1MgQ29udGV4dCBkZXNjcmliZXMgTWV0YWRhdGEsIEFQSSwgVGltZSBSYW5nZVxyXG4gKiBodHRwOi8vd3d3Lm93c2NvbnRleHQub3JnL293Y191c2VyX2d1aWRlL0MwX3VzZXJHdWlkZS5odG1sI3RydWV0aGUtb3dzLWNvbnRleHQtZG9jdW1lbnQtc3RydWN0dXJlXHJcbiAqIElmIG5vIGJvdW5kaW5nIGJveCBpcyBzcGVjaWZpZWQsIGRvIG5vdCBjaGFuZ2UgdGhlIGN1cnJlbnQgdmlldyB3aGVuIHRoZSBjb250ZXh0IGRvY3VtZW50IGlzIGxvYWRlZC5cclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgSU93c0NvbnRleHQgZXh0ZW5kcyBHZW9KU09OLkZlYXR1cmVDb2xsZWN0aW9uPEdlb0pTT04uR2VvbWV0cnlPYmplY3QgfCBudWxsLCBHZW9KU09OLkdlb0pzb25Qcm9wZXJ0aWVzPiB7XHJcbiAgLyoqXHJcbiAgICogVGhlIGlkIGVsZW1lbnQgZGVmaW5lcyBhIG1hbmRhdG9yeSByZWZlcmVuY2UgdG8gdGhlIGlkZW50aWZpY2F0aW9uIG9mIHRoZSBDb250ZXh0IGRvY3VtZW50LlxyXG4gICAqIFRoZSBjb250ZW50IGZvciB0aGUgaWQgZWxlbWVudCBTSEFMTCBiZSBhbiBJUkksIGFzIGRlZmluZWQgYnkgSUVURiBbUkZDMzk4N11cclxuICAgKi9cclxuICBpZDogc3RyaW5nIHwgbnVtYmVyO1xyXG4gIHByb3BlcnRpZXM6IHtcclxuICAgIGxpbmtzOiB7IHByb2ZpbGVzOiBzdHJpbmdbXSB9IHwgSU93c0xpbmtzW107XHJcbiAgICAvKiogTGFuZ3VhZ2Ugb2YgQ29udGV4dCBkb2N1bWVudCBjb250ZW50ICovXHJcbiAgICBsYW5nOiBMYW5nU3RyaW5nO1xyXG4gICAgLyoqIFRpdGxlIGZvciB0aGUgQ29udGV4dCBkb2N1bWVudCAqL1xyXG4gICAgdGl0bGU6IHN0cmluZztcclxuICAgIC8qKiBEYXRlIG9mIGEgY3JlYXRpb24gb3IgdXBkYXRlIG9mIHRoZSBDb250ZXh0IGRvY3VtZW50ICovXHJcbiAgICB1cGRhdGVkOiBEYXRlU3RyaW5nO1xyXG4gICAgLyoqIERlc2NyaXB0aW9uIG9mIHRoZSBDb250ZXh0IGRvY3VtZW50IHB1cnBvc2Ugb3IgY29udGVudCAqL1xyXG4gICAgc3VidGl0bGU/OiBzdHJpbmc7XHJcbiAgICAvKiogVGhpcyBlbGVtZW50IGlzIG9wdGlvbmFsIGFuZCBpbmRpY2F0ZXMgdGhlIGF1dGhvcnMgYXJyYXkgb2YgdGhlIENvbnRleHQgZG9jdW1lbnQgKi9cclxuICAgIGF1dGhvcnM/OiBJT3dzQXV0aG9yW107XHJcbiAgICAvKiogSWRlbnRpZmllciBmb3IgdGhlIHB1Ymxpc2hlciBvZiB0aGUgQ29udGV4dCBkb2N1bWVudCAqL1xyXG4gICAgcHVibGlzaGVyPzogc3RyaW5nO1xyXG4gICAgLyoqIFRvb2wvYXBwbGljYXRpb24gdXNlZCB0byBjcmVhdGUgdGhlIENvbnRleHQgZG9jdW1lbnQgYW5kIGl0cyBwcm9wZXJ0aWVzICovXHJcbiAgICBjcmVhdG9yPzogSU93c0NyZWF0b3I7XHJcbiAgICAvKipcclxuICAgICAqIFByb3BlcnRpZXMgb2YgdGhlIGRpc3BsYXkgaW4gdXNlIHdoZW4gdGhlIGNvbnRleHQgZG9jdW1lbnQgd2FzIGNyZWF0ZWQgKGZvciBkaXNwbGF5IGJhc2VkIGFwcGxpY2F0aW9ucyBvbmx5KS5cclxuICAgICAqIFRoaXMgY2xhc3MgaXMgb3B0aW9uYWwgYW5kIGludGVuZGVkIGZvciBjcmVhdG9yIGFwcGxpY2F0aW9ucyB0aGF0IHVzZSBhIGdyYXBoaWNhbCB1c2VyIGludGVyZmFjZSB3aXRoIGEgZ2VvZ3JhcGhpY2FsIGRpc3BsYXkgd2l0aGluIGEgZml4ZWQgcGl4ZWwgc2l6ZSBhbmQgbm90IHNjYWxhYmxlIHRvIGRpZmZlcmVudCBjb21wdXRhdGlvbmFsIGRldmljZXMgXHJcbiAgICAgKi9cclxuICAgIGRpc3BsYXk/OiBJT3dzQ3JlYXRvckRpc3BsYXlbXTtcclxuICAgIC8qKiBJbmZvcm1hdGlvbiBhYm91dCByaWdodHMgaGVsZCBpbiBhbmQgb3ZlciB0aGUgQ29udGV4dCBkb2N1bWVudCAqL1xyXG4gICAgcmlnaHRzPzogc3RyaW5nO1xyXG4gICAgLyoqXHJcbiAgICAqIERhdGUgb3IgcmFuZ2Ugb2YgZGF0ZXMgcmVsZXZhbnQgdG8gdGhlIHJlc291cmNlIFxyXG4gICAgKiB0aW1lIHJhbmdlIHdoaWNoIGlzIGV4cGVjdGVkIHRvIGJlIG9mIGludGVyZXN0IHRvIHRoZSB1c2VyLlxyXG4gICAgKi9cclxuICAgIGRhdGU/OiBEYXRlU3RyaW5nO1xyXG4gICAgLyoqIFRoaXMgYXJyYXkgaXMgYW4gb3B0aW9uYWwgYW5kIGV4cHJlc3NlcyBjYXRlZ29yaWVzIHJlbGF0ZWQgdG8gdGhpcyBDb250ZXh0IGRvY3VtZW50ICovXHJcbiAgICBjYXRlZ29yaWVzPzogSU93c0NhdGVnb3JpZVtdO1xyXG4gICAgLyoqIEV4dGVuc2lvbiBBbnkgb3RoZXIgZWxlbWVudCAqL1xyXG4gICAgW2s6IHN0cmluZ106IGFueTtcclxuICB9O1xyXG4gIC8qKiBPcmRlcmVkIExpc3Qgb2YgUmVzb3VyY2VzIGF2YWlsYWJsZSBvbiB0aGUgQ29udGV4dCBkb2N1bWVudCAqL1xyXG4gIGZlYXR1cmVzOiBJT3dzUmVzb3VyY2VbXTtcclxuICAvKiogRXh0ZW5zaW9uIEFueSBvdGhlciBlbGVtZW50ICovXHJcbiAgW2s6IHN0cmluZ106IGFueTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEVhY2ggbGF5ZXIgKGEuay5hLiBmZWF0dXJlKSBpbiBhIGNvbnRleHQgZG9jdW1lbnQgaXMga25vd24gYXMgYSDigJhSZXNvdXJjZeKAmVxyXG4gKiBBIFJlc291cmNlIHJlZmVyZW5jZSBhIHNldCBvZiBnZW9zcGF0aWFsIGluZm9ybWF0aW9uIHRvIGJlIHRyZWF0ZWQgYXMgYSBsb2dpY2FsIGVsZW1lbnQuXHJcbiAqIFRoZSByZXNvdXJjZXMgYXJlIG9yZGVyZWQgc3VjaCB0aGF0IHRoZSBmaXJzdCBpdGVtIGluIHRoZSBkb2N1bWVudCBpcyB0byBiZSBkaXNwbGF5ZWQgYXQgdGhlIGZyb250LlxyXG4gKiBUaGlzIGRlZmluZXMgdGhlIG9yZGVyIGluIHdoaWNoIGxheWVycyBhcmUgZHJhd24uXHJcbiAqIEEgcmVzb3VyY2UgKHdoaWNoIGluIEdJUyB0ZXJtcyBpcyBhIGxheWVyKSBjYW4gaGF2ZSBhIG51bWJlciBvZiBvZmZlcmluZ3MsIGFuZCBlYWNoIG9mZmVyaW5nXHJcbiAqIGlzIGZvY3Vzc2VkIG9uIGEgcGFydGljdWxhciByZXByZXNlbnRhdGlvbiBvZiBpbmZvcm1hdGlvbi5cclxuICogVGhlc2UgY2FuIGJlIG9uZSBvZiBhIG51bWJlciBvZiBPR0MgV2ViIFNlcnZpY2VzLCBzcGVjaWZpY2FsbHkgV01TLCBXTVRTLCBXRlMsIFdDUywgV1BTIGFuZCBDU1csXHJcbiAqIG9yIG9uZSBvZiBhIG51bWJlciBvZiBpbmxpbmUgb3IgcmVmZXJlbmNlZCBmb3JtYXRzLCBzcGVjaWZpY2FsbHkgR01MLCBLTUwsIEdlb1RJRkYsIEdNTEpQMiwgR01MQ09WLFxyXG4gKiBvciBhIGN1c3RvbSBvZmZlcmluZyB0eXBlIGRlZmluZWQgaW4gYSBwcm9maWxlIG9yIGJ5IGFuIG9yZ2FuaXNhdGlvbi5cclxuICogaHR0cDovL3d3dy5vd3Njb250ZXh0Lm9yZy9vd2NfdXNlcl9ndWlkZS9DMF91c2VyR3VpZGUuaHRtbCN0cnVldGhlLW93cy1jb250ZXh0LWRvY3VtZW50LXN0cnVjdHVyZVxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBJT3dzUmVzb3VyY2UgZXh0ZW5kcyBHZW9KU09OLkZlYXR1cmUge1xyXG4gIC8qKlxyXG4gICAqIFVuYW1iaWd1b3VzIHJlZmVyZW5jZSB0byB0aGUgaWRlbnRpZmljYXRpb24gb2YgdGhlIENvbnRleHQgcmVzb3VyY2UgKElSSSlcclxuICAgKiBTdHJpbmcgdHlwZSB0aGF0IFNIQUxMIGNvbnRhaW4gYSBVUkkgdmFsdWVcclxuICAgKi9cclxuICBpZDogc3RyaW5nIHwgbnVtYmVyO1xyXG4gIHByb3BlcnRpZXM6IElPd3NSZXNvdXJjZVByb3BlcnRpZXM7XHJcbiAgW2s6IHN0cmluZ106IGFueTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJT3dzUmVzb3VyY2VQcm9wZXJ0aWVzIHtcclxuICAvKiogVGl0bGUgZ2l2ZW4gdG8gdGhlIENvbnRleHQgcmVzb3VyY2UgKi9cclxuICB0aXRsZTogc3RyaW5nO1xyXG4gIC8qKiBEYXRlIG9mIHRoZSBsYXN0IHVwZGF0ZSBvZiB0aGUgQ29udGV4dCByZXNvdXJjZSAqL1xyXG4gIHVwZGF0ZWQ6IERhdGVTdHJpbmc7XHJcbiAgLyoqIFRoZSBwdXJwb3NlIGlzIHRvIHByb3ZpZGUgYSBnZW5lcmljIGRlc2NyaXB0aW9uIG9mIHRoZSBjb250ZW50IGluIGEgZm9ybWF0IHVuZGVyc3RhbmRhYmxlIGJ5IGdlbmVyaWMgcmVhZGVycyAqL1xyXG4gIGFic3RyYWN0Pzogc3RyaW5nO1xyXG4gIC8qKiBUaGlzIGVsZW1lbnQgaXMgb3B0aW9uYWwgYW5kIGluZGljYXRlcyB0aGUgYXV0aG9ycyBhcnJheSBvZiB0aGUgQ29udGV4dCByZXNvdXJjZSAqL1xyXG4gIGF1dGhvcnM/OiBJT3dzQXV0aG9yW107XHJcbiAgLyoqIEVudGl0eSByZXNwb25zaWJsZSBmb3IgbWFraW5nIHRoZSBDb250ZXh0IHJlc291cmNlIGF2YWlsYWJsZSAqL1xyXG4gIHB1Ymxpc2hlcj86IHN0cmluZztcclxuICAvKiogSW5mb3JtYXRpb24gYWJvdXQgcmlnaHRzIGhlbGQgaW4gYW5kIG92ZXIgdGhlIENvbnRleHQgcmVzb3VyY2UgKi9cclxuICByaWdodHM/OiBzdHJpbmc7XHJcbiAgLyoqIERhdGUgb3IgcmFuZ2Ugb2YgZGF0ZXMgcmVsZXZhbnQgdG8gdGhlIENvbnRleHQgcmVzb3VyY2UgKi9cclxuICBkYXRlPzogRGF0ZVN0cmluZztcclxuICAvKiogVGhpcyBlbGVtZW50IGlzIG9wdGlvbmFsIGFuZCBjYW4gY29udGFpbiBhIG51bWJlciBvZiBvZmZlcmluZ3MgZGVmaW5lZCBieSB0aGUgY2xhc3MgT1dDOk9mZmVyaW5nICovXHJcbiAgb2ZmZXJpbmdzPzogSU93c09mZmVyaW5nW107XHJcbiAgLyoqIEZsYWcgdmFsdWUgaW5kaWNhdGluZyB0byB0aGUgY2xpZW50IGlmIHRoZSBDb250ZXh0IHJlc291cmNlIHNob3VsZCBiZSBkaXNwbGF5ZWQgYnkgZGVmYXVsdCAqL1xyXG4gIGFjdGl2ZT86IGJvb2xlYW47XHJcbiAgLyoqIFRoaXMgYXJyYXkgaXMgb3B0aW9uYWwgYW5kIGV4cHJlc3NlcyBhIGNhdGVnb3J5IHJlbGF0ZWQgdG8gdGhlIENvbnRleHQgcmVzb3VyY2UgKi9cclxuICBjYXRlZ29yaWVzPzogSU93c0NhdGVnb3JpZVtdO1xyXG4gIC8qKiBNaW5pbXVtIHNjYWxlIGZvciB0aGUgZGlzcGxheSBvZiB0aGUgQ29udGV4dCByZXNvdXJjZSBEb3VibGUgKi9cclxuICBtaW5zY2FsZWRlbm9taW5hdG9yPzogbnVtYmVyO1xyXG4gIC8qKiBNYXhpbXVtIHNjYWxlIGZvciB0aGUgZGlzcGxheSBvZiB0aGUgQ29udGV4dCByZXNvdXJjZSBEb3VibGUgKi9cclxuICBtYXhzY2FsZWRlbm9taW5hdG9yPzogbnVtYmVyO1xyXG4gIC8qKiBEZWZpbml0aW9uIG9mIHRoZSBmb2xkZXIgaW4gd2hpY2ggdGhlIHJlc291cmNlIGlzIHBsYWNlZCBcclxuICAqIFRoZSBmb2xkZXIgYXR0cmlidXRlIGlzIGludGVuZGVkIHRvIHN1cHBvcnQgdGhlIGNvbmNlcHQgcHJlc2VudCBpbiBtYW55IGNsaWVudHMgb3Igb3JnYW5pc2luZyBsYXllcnMgaW50byBmb2xkZXJzLlxyXG4gICovXHJcbiAgZm9sZGVyPzogc3RyaW5nO1xyXG4gIC8qKiBUT0RPISEhIGxpbmtzIGlzIGRlZmluZWQgYXMgT2JqZWN0IGJ1dCBpbiB0aGUgZXhhbXBsZXMgYXMgQXJyYXkgICovXHJcbiAgbGlua3M/OiBJT3dzTGlua3NbXTtcclxuICBbazogc3RyaW5nXTogYW55O1xyXG59XHJcblxyXG5cclxuLyoqXHJcbiAqIEluIHJlYWxpdHkgYSByZXNvdXJjZSBjYW4gYmUgcmVhbGlzZWQgaW4gYSBudW1iZXIgb2YgZGlmZmVyZW50IHdheXMsIGFuZCBzbyBhbiBPV0MgZG9jdW1lbnQgYWxsb3dzIHZhcmlvdXMgb3B0aW9ucyB0byBiZSBzcGVjaWZpZWQuXHJcbiAqIFRoZXNlIGFyZSBrbm93biBhcyBvZmZlcmluZ3MuXHJcbiAqIFRoZSBpbnRlbnRpb24gaXMgdGhhdCB0aGVzZSBhcmUsIGFzIGZhciBhcyBpcyBwb3NzaWJsZSBieSB0aGUgZm9ybWF0IHVzZWQsXHJcbiAqIGVxdWl2YWxlbnQgYW5kIG5vIHByaW9yaXR5IGlzIGFzc2lnbmVkIHRvIHRoZWlyIG9yZGVyIGluIHRoZSBzdGFuZGFyZC5cclxuICogVGhleSBhcmUgaW50ZW5kZWQgdG8gYmUgYWx0ZXJuYXRpdmVzIHRoYXQgdGhlIGNsaWVudCBjYW4gdXNlIHRvIGFsbG93IGl0IHRvIHZpc3VhbGlzZSBvciB1c2UgdGhlIHJlc291cmNlLlxyXG4gKlxyXG4gKiBTbyBmb3IgZXhhbXBsZSBmb3VyIG9mZmVyaW5ncywgYSBXTVMsIGEgV0ZTIHdpdGggcG9ydHJheWFsIGFzIFNMRCwgYW5kIGFuIGlubGluZSBHTUwgT2ZmZXJpbmcgYWdhaW4gd2l0aCBwb3J0cmF5YWwgYXMgU0xELlxyXG4gKiBEaWZmZXJlbnQgY2xpZW50cyBjb3VsZCB1c2UgdGhlc2Ugb2ZmZXJpbmdzIGFzIGFwcHJvcHJpYXRlOlxyXG4gKiAtIGEgc2ltcGxlIGJyb3dzZXIgYmFzZWQgY2xpZW50IGNvdWxkIHVzZSB0aGUgV01TIG9mZmVyaW5nIHByb3ZpZGVkLCB1c2luZyB0aGUgc3RhbmRhcmQgcG9ydHJheWFsXHJcbiAqIC0gYSBtb3JlIHNvcGhpc3RpY2F0ZWQgY2xpZW50LCBjb3VsZCB1c2UgdGhlIFdGUyBvZmZlcmluZyBhbmQgdGhlIGFzc29jaWF0ZWQgU0xEIERvY3VtZW50LlxyXG4gKlxyXG4gKiBUaGVyZSBhcmUgdHdvIHR5cGVzIG9mIG9mZmVyaW5nLCBzZXJ2aWNlIG9mZmVyaW5ncyBhbmQgZGF0YSBvZmZlcmluZ3MuXHJcbiAqIEEgc2VydmljZSBvZmZlcmluZyBoYXMgYSBzZXJ2aWNlIHJlcXVlc3QgKGluIHRoZSBmb3JtIG9mIGEgY2FwYWJpbGl0aWVzIHJlcXVlc3QgYW5kIGEgZGF0YSByZXF1ZXN0KVxyXG4gKiBhbmQgb3B0aW9uYWwgY29udGVudCBhbmQgc3R5bGluZyBlbGVtZW50cy5cclxuICogQSBkYXRhIG9mZmVyaW5nIGhhcyBhIGNvbnRlbnQgZWxlbWVudCBhbmQgb3B0aW9uYWwgc3R5bGluZyBlbGVtZW50cy5cclxuICpcclxuICpcclxuICogaHR0cDovL3d3dy5vd3Njb250ZXh0Lm9yZy9vd2NfdXNlcl9ndWlkZS9DMF91c2VyR3VpZGUuaHRtbCN0cnVlbXVsdGlwbGUtb2ZmZXJpbmdzLWFuZC1wcmlvcml0eVxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBJT3dzT2ZmZXJpbmcge1xyXG4gIC8qKiBFeHRlbnNpb24gT2ZmZXJpbmdzIHdpdGggdHlwZSAtIHN0cmluZyAqL1xyXG4gIGNvZGU6IFdNU19PZmZlcmluZyB8IFdGU19PZmZlcmluZyB8IFdDU19PZmZlcmluZyB8IFdQU19PZmZlcmluZyB8IENTV19PZmZlcmluZyB8IFdNVFNfT2ZmZXJpbmcgfFxyXG4gIEdNTF9PZmZlcmluZyB8IEtNTF9PZmZlcmluZyB8IEdlb1RJRkZfT2ZmZXJpbmcgfCBHTUxKUDJfT2ZmZXJpbmcgfCBHTUxDT1ZfT2ZmZXJpbmcgfCBzdHJpbmc7XHJcbiAgLyoqIFdlYiBTZXJ2aWNlIE9mZmVyaW5ncyBwcm92aWRlIHRoZWlyIG9wZXJhdGlvbnMgKi9cclxuICBvcGVyYXRpb25zPzogSU93c09wZXJhdGlvbltdO1xyXG4gIC8qKiBDb250ZW50IE9mZmVyaW5ncyBhbGxvdyBjb250ZW50IHRvIGJlIGVtYmVkZGVkIGluIGFuIE9XUyBDb250ZXh0IGRvY3VtZW50LiAqL1xyXG4gIGNvbnRlbnRzPzogSU93c0NvbnRlbnRbXTtcclxuICBzdHlsZXM/OiBJT3dzU3R5bGVTZXRbXTtcclxuICBbazogc3RyaW5nXTogYW55O1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJT3dzQ3JlYXRvciB7XHJcbiAgdGl0bGU/OiBzdHJpbmc7XHJcbiAgdXJpPzogc3RyaW5nO1xyXG4gIHZlcnNpb24/OiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSU93c0F1dGhvciB7XHJcbiAgLyoqIEVudGl0eSBwcmltYXJpbHkgcmVzcG9uc2libGUgZm9yIG1ha2luZyB0aGUgQ29udGV4dCBkb2N1bWVudCAqL1xyXG4gIG5hbWU/OiBzdHJpbmc7XHJcbiAgZW1haWw/OiBzdHJpbmc7XHJcbiAgdXJpPzogc3RyaW5nO1xyXG4gIFtrOiBzdHJpbmddOiBhbnk7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSU93c0NhdGVnb3JpZSB7XHJcbiAgc2NoZW1lPzogc3RyaW5nO1xyXG4gIC8qKiBDYXRlZ29yeSByZWxhdGVkIHRvIHRoaXMgY29udGV4dCBkb2N1bWVudC4gSXQgTUFZIGhhdmUgYSByZWxhdGVkIGNvZGUtbGlzdCB0aGF0IGlzIGlkZW50aWZpZWQgYnkgdGhlIHNjaGVtZSBhdHRyaWJ1dGUgKi9cclxuICB0ZXJtPzogc3RyaW5nO1xyXG4gIGxhYmVsPzogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElPd3NMaW5rcyB7XHJcbiAgcmVsOiBzdHJpbmc7XHJcbiAgaHJlZj86IHN0cmluZztcclxuICB0eXBlPzogc3RyaW5nO1xyXG4gIHRpdGxlPzogc3RyaW5nO1xyXG4gIC8qKiBSZWZlcmVuY2UgdG8gYSBkZXNjcmlwdGlvbiBvZiB0aGUgQ29udGV4dCByZXNvdXJjZSBpbiBhbHRlcm5hdGl2ZSBmb3JtYXQgKi9cclxuICBhbHRlcm5hdGVzPzogc3RyaW5nO1xyXG4gIGxhbmc/OiBMYW5nU3RyaW5nO1xyXG4gIFtrOiBzdHJpbmddOiBhbnk7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSU93c0NyZWF0b3JBcHBsaWNhdGlvbiB7XHJcbiAgdGl0bGU/OiBzdHJpbmc7XHJcbiAgdXJpPzogc3RyaW5nO1xyXG4gIHZlcnNpb24/OiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSU93c0NyZWF0b3JEaXNwbGF5IHtcclxuICAvKiogV2lkdGggbWVhc3VyZWQgaW4gcGl4ZWxzIG9mIHRoZSBkaXNwbGF5IHNob3dpbmcgdGhlIEFyZWEgb2YgSW50ZXJlc3QgKi9cclxuICBwaXhlbFdpZHRoPzogbnVtYmVyO1xyXG4gIC8qKiBXaWR0aCBtZWFzdXJlZCBpbiBwaXhlbHMgb2YgdGhlIGRpc3BsYXkgc2hvd2luZyBieSB0aGUgQXJlYSBvZiBJbnRlcmVzdCAqL1xyXG4gIHBpeGVsSGVpZ2h0PzogbnVtYmVyO1xyXG4gIC8qKiBUaGUgc2l6ZSBvZiBhIHBpeGVsIG9mIHRoZSBkaXNwbGF5IGluIG1pbGltZXRlcnMgXHJcbiAgICogKGNvbWJpbmVkIHdpdGggdGhlIHByZXZpb3VzIG9uZXMgYWxsb3dzIGZvciB0aGUgcmVhbCBkaXNwbGF5IHNpemUgdG8gYmUgY2FsY3VsYXRlZCkgKi9cclxuICBtbVBlclBpeGVsPzogbnVtYmVyO1xyXG4gIFtrOiBzdHJpbmddOiBhbnk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBNb3N0IHNlcnZpY2Ugb2ZmZXJpbmdzIGhhdmUgdHdvIG9wZXJhdGlvbnMsIGEg4oCYR2V0Q2FwYWJpbGl0aWVz4oCZIG9wZXJhdGlvbiBhbmQgYSBkYXRhIG9wZXJhdGlvbiBzdWNoIGFzIOKAmEdldE1hcOKAmSBmb3IgV01TIFxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBJT3dzT3BlcmF0aW9uIHtcclxuICAvKipcclxuICAgKiBUaGUgY29kZSBpZGVudGlmaWVzIHRoZSB0eXBlIG9mIG9wZXJhdGlvbi5cclxuICAgKiBWYWxpZCB0eXBlcyBhcmUgZGVmaW5lZCB3aXRoaW4gZWFjaCBzcGVjaWZpYyBleHRlbnNpb24gd2l0aGluIHRoZSBPV1MgQ29udGV4dCBjb25jZXB0dWFsIG1vZGVsIFtPR0MgMTItMDgwXS5cclxuICAgKi9cclxuICBjb2RlOiBzdHJpbmc7XHJcbiAgLyoqIG1ldGhvZCBkZWZpbmVzIHRoZSBhY2Nlc3MgbWV0aG9kLCBmb3IgZXhhbXBsZSBHRVQgb3IgUE9TVC4gKi9cclxuICBtZXRob2Q6IHN0cmluZztcclxuICB0eXBlPzogc3RyaW5nO1xyXG4gIC8qKiBocmVmIGlzIHRoZSBVUkkgY29udGFpbmluZyB0aGUgZGVmaW5pdGlvbiBvZiB0aGUgcmVxdWVzdCAqL1xyXG4gIGhyZWY/OiBzdHJpbmc7XHJcbiAgcmVxdWVzdD86IElPd3NDb250ZW50O1xyXG4gIHJlc3VsdD86IElPd3NDb250ZW50O1xyXG4gIC8qKiBFeHRlbnNpb24gb2YgT3BlcmF0aW9uICovXHJcbiAgW2s6IHN0cmluZ106IGFueTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSU93c0NvbnRlbnQge1xyXG4gIC8qKiBNSU1FIHR5cGUgb2YgdGhlIENvbnRlbnQgKi9cclxuICB0eXBlOiBzdHJpbmc7XHJcbiAgaHJlZj86IHN0cmluZztcclxuICB0aXRsZT86IHN0cmluZztcclxuICAvKiogU3RyaW5nIHR5cGUsIG5vdCBlbXB0eSB0aGF0IGNhbiBjb250YWluIGFueSB0ZXh0IGVuY29kZWQgbWVkaWEgdHlwZSAqL1xyXG4gIGNvbnRlbnQ/OiBzdHJpbmc7XHJcbiAgW2s6IHN0cmluZ106IGFueTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJT3dzU3R5bGVTZXQge1xyXG4gIG5hbWU6IHN0cmluZztcclxuICB0aXRsZTogc3RyaW5nO1xyXG4gIGFic3RyYWN0Pzogc3RyaW5nO1xyXG4gIGRlZmF1bHQ/OiBib29sZWFuO1xyXG4gIGxlZ2VuZFVSTD86IHN0cmluZztcclxuICBjb250ZW50PzogSU93c0NvbnRlbnQ7XHJcbiAgW2s6IHN0cmluZ106IGFueTtcclxufVxyXG5cclxuXHJcblxyXG4vKiogSVNPLTg2MDEgZm9ybWF0IGUuZy4gWVlZWS1NTS1ERFRoaDptbTpzc1ogb3IgWVlZWS1NTS1ERFRoaDptbTpzc1ovWVlZWS1NTS1ERFRoaDptbTpzc1ogKi9cclxuZXhwb3J0IHR5cGUgRGF0ZVN0cmluZyA9IHN0cmluZztcclxuXHJcblxyXG4vKiogUkZDLTMwNjYgY29kZSBlLmcuIGVuLGRlICovXHJcbmV4cG9ydCB0eXBlIExhbmdTdHJpbmcgPSBzdHJpbmc7XHJcblxyXG5cclxuZXhwb3J0IHR5cGUgV01TX09mZmVyaW5nID0gJ2h0dHA6Ly93d3cub3Blbmdpcy5uZXQvc3BlYy9vd2MtZ2VvanNvbi8xLjAvcmVxL3dtcycgfFxyXG4gICAgJ2h0dHA6Ly9zY2hlbWFzLm9wZW5naXMubmV0L3dtcy8xLjEuMScgfCAnaHR0cDovL3NjaGVtYXMub3Blbmdpcy5uZXQvd21zLzEuMS4wJztcclxuZXhwb3J0IHR5cGUgV0ZTX09mZmVyaW5nID0gJ2h0dHA6Ly93d3cub3Blbmdpcy5uZXQvc3BlYy9vd2MtZ2VvanNvbi8xLjAvcmVxL3dmcyc7XHJcbmV4cG9ydCB0eXBlIFdDU19PZmZlcmluZyA9ICdodHRwOi8vd3d3Lm9wZW5naXMubmV0L3NwZWMvb3djLWdlb2pzb24vMS4wL3JlcS93Y3MnO1xyXG5leHBvcnQgdHlwZSBXUFNfT2ZmZXJpbmcgPSAnaHR0cDovL3d3dy5vcGVuZ2lzLm5ldC9zcGVjL293Yy1nZW9qc29uLzEuMC9yZXEvd3BzJztcclxuZXhwb3J0IHR5cGUgQ1NXX09mZmVyaW5nID0gJ2h0dHA6Ly93d3cub3Blbmdpcy5uZXQvc3BlYy9vd2MtZ2VvanNvbi8xLjAvcmVxL2Nzdyc7XHJcbmV4cG9ydCB0eXBlIFdNVFNfT2ZmZXJpbmcgPSAnaHR0cDovL3d3dy5vcGVuZ2lzLm5ldC9zcGVjL293Yy1nZW9qc29uLzEuMC9yZXEvd210cyc7XHJcbmV4cG9ydCB0eXBlIEdNTF9PZmZlcmluZyA9ICdodHRwOi8vd3d3Lm9wZW5naXMubmV0L3NwZWMvb3djLWdlb2pzb24vMS4wL3JlcS9nbWwnO1xyXG5leHBvcnQgdHlwZSBLTUxfT2ZmZXJpbmcgPSAnaHR0cDovL3d3dy5vcGVuZ2lzLm5ldC9zcGVjL293Yy1nZW9qc29uLzEuMC9yZXEva21sJztcclxuZXhwb3J0IHR5cGUgR2VvVElGRl9PZmZlcmluZyA9ICdodHRwOi8vd3d3Lm9wZW5naXMubmV0L3NwZWMvb3djLWdlb2pzb24vMS4wL3JlcS9nZW90aWZmJztcclxuZXhwb3J0IHR5cGUgR01MSlAyX09mZmVyaW5nID0gJ2h0dHA6Ly93d3cub3Blbmdpcy5uZXQvc3BlYy9vd2MtZ2VvanNvbi8xLjAvcmVxL2dtbGpwMic7XHJcbmV4cG9ydCB0eXBlIEdNTENPVl9PZmZlcmluZyA9ICdodHRwOi8vd3d3Lm9wZW5naXMubmV0L3NwZWMvb3djLWdlb2pzb24vMS4wL3JlcS9nbWxjb3YnO1xyXG4iXX0=