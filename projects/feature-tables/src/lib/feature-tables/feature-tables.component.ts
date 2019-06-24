import { Component, OnInit, Input } from '@angular/core';
import { LayersService, VectorLayer, Layer } from '@ukis/services-layers';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FeatureCollection } from '@turf/helpers';

@Component({
    selector: 'ukis-feature-tables',
    templateUrl: './feature-tables.component.html',
    styleUrls: ['./feature-tables.component.css']
})
export class FeatureTablesComponent implements OnInit {

    @Input() layersSvc: LayersService;
    vectorLayers: Observable<VectorLayer[]>;

    constructor() { }

    ngOnInit() {
        this.vectorLayers = this.layersSvc.getOverlays().pipe(
            map((layers: Layer[]) => {
                let vectorLayers: Layer[] = layers.filter((layer: Layer) => {
                    return (layer instanceof VectorLayer);
                });
                let typedVectorLayers: VectorLayer[] = vectorLayers.map((layer: Layer) => {
                    return <VectorLayer>layer;
                })
                // let featureCollections: FeatureCollection[] = typedVectorLayers.map((layer: VectorLayer) => {
                //   return layer.data;
                // });
                return typedVectorLayers;
            })
        );
    }

}
