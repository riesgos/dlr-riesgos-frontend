import { Component, OnInit, Input, forwardRef, OnDestroy } from '@angular/core';
import { FeatureSelectParameter } from '../parameter';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MapOlService } from '@ukis/map-ol';
import { Feature } from 'geojson';
import { feature as turfFeature, geometry as turfGeometry } from '@turf/helpers';
import { BehaviorSubject } from 'rxjs';


@Component({
	selector: 'ukis-form-select-feature',
	templateUrl: './form-select-feature.component.html',
	styleUrls: ['./form-select-feature.component.css'],
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		multi: true,
		useExisting: forwardRef(() => FormSelectFeatureComponent),
	}]
})
export class FormSelectFeatureComponent implements OnInit, ControlValueAccessor {

	@Input() parameter: FeatureSelectParameter;
	public selectionOngoing: BehaviorSubject<boolean>;
	public selectedFeature: Feature;
	private changeFunction;

	constructor(
		private mapService: MapOlService
	) {
	}

	ngOnInit() {

		this.selectedFeature = this.parameter.defaultValue;
		this.selectionOngoing = new BehaviorSubject<boolean>(false);

		this.selectionOngoing.subscribe(ongoing => {
			if (ongoing) this.cursorToCrosshair(true);
			else this.cursorToCrosshair(false);
		});

		this.mapService.map.on("click", (event) => {
			if (this.selectionOngoing.getValue()) {
				this.mapService.map.forEachFeatureAtPixel(event.pixel, (olFeature, layer) => {
					if (layer.get("id") == this.parameter.layerId) {
						this.selectionOngoing.next(false);
						let cleanFeature = this.cleanupOlFeature(olFeature);
						this.selectedFeature = cleanFeature;
						this.changeFunction(this.selectedFeature);
					}
				})
			}
		})
	}

	


	private cleanupOlFeature(olFeature) {
		let geometry = olFeature.get("geometry");
		let cleanGeometry = turfGeometry("Point", geometry.flatCoordinates);
		let cleanProperties = olFeature.getProperties();
		delete cleanProperties.geometry;
		let cleanFeature = turfFeature(cleanGeometry, cleanProperties, { id: olFeature.getId() });
		return cleanFeature;
	}

	writeValue(selectedFeature: Feature): void {
		this.selectedFeature = selectedFeature;
	}

	registerOnChange(fn: any): void {
		this.changeFunction = fn;
	}

	private cursorToCrosshair(doIt: boolean): void {
		if (doIt) {
			document.getElementById("map").style.cursor = "crosshair";
		} else {
			document.getElementById("map").style.cursor = "inherit";
		}
	}

	registerOnTouched(fn: any): void { }

	setDisabledState(isDisabled: boolean): void { }

	onSelectButtonClicked() {
		let current = this.selectionOngoing.getValue();
		this.selectionOngoing.next(!current);
	}

}
