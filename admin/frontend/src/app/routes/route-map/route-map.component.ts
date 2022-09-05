import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';

import { LayersService, Layer, LayerGroup } from '@dlr-eoc/services-layers';
import { MapStateService, TGeoExtent, MapState } from '@dlr-eoc/services-map-state';
import { IMapControls, MapOlService } from '@dlr-eoc/map-ol';
import { TileWMS } from 'ol/source';
import { IDateRange as IDateRange } from 'src/app/components/time-range-picker/time-range-picker.component';
import { updateSearchParamsHashRouting } from 'src/app/shared/utils/url';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, first } from 'rxjs/operators';

import { ActivatedRoute } from '@angular/router';
import { LayersHelperService } from './time-layers.service';
import { OverviewMap } from 'ol/control';
import TileLayer from 'ol/layer/Tile';
import { baselayers } from './baselayers';
import { AlertService } from 'src/app/components/global-alert/alert.service';
import { SettingsStateService } from './settings-state.service';
import { overlays } from './overlays';
import { ProgressService } from 'src/app/components/global-progress/progress.service';
import { Ifilters } from 'src/app/components/burntarea-filter/burntarea-filter.component';


@Component({
  selector: 'app-route-map',
  templateUrl: './route-map.component.html',
  styleUrls: ['./route-map.component.scss'],
  /** use different instances of the services only for testing with different routes  */
  providers: [LayersService, MapStateService, MapOlService, SettingsStateService]
})

export class RouteMapComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'content-container';


  public subs: Subscription[] = [];
  public controls: IMapControls;
  public nav = {
    rightWidth: 15,
    minWidth: 12,
    maxWidth: 40,
    unit: 'rem'
  };

  layers: Array<Layer> = [];


  constructor(
    public layerSvc: LayersService,
    public mapStateSvc: MapStateService,
    public mapOlSvc: MapOlService,
    public route: ActivatedRoute,
    public layerHelper: LayersHelperService,
    public alertSvc: AlertService,
    public progressSvc: ProgressService,
    public settingsSvc: SettingsStateService
  ) {
    this.controls = {
      attribution: true,
      scaleLine: true
    };

    // pass used service from component providers
    this.layerHelper = new LayersHelperService(layerSvc, mapOlSvc, alertSvc, settingsSvc);
  }

  ngOnInit() {
    this.addOverlays();
    this.addLayers();
    this.addBaselayers();
    this.mapOlSvc.map.addControl(new OverviewMap({
      layers: [
        new TileLayer({
          source: new TileWMS({
            url: 'https://geoservice.dlr.de/eoc/basemap/wms',
            params: {
              LAYERS: 'basemap',
              FORMAT: 'image/png',
              TRANSPARENT: true
            }
          }),
        })

      ],
    }));

    this.subscribeToMapState();
    this.subscribeToRoute();
    this.subscribeToFilters();
    this.subscribeToLayers();
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }


  addOverlays() {
    overlays.map(l => this.layerSvc.addLayer(l, 'Overlays'));
  }

  addLayers() {
    const layers = [
      this.layerHelper.createModisDaily(this.settingsSvc.currentTimeRange.value),
      this.layerHelper.createBurntareaWms().baGroup,
      this.layerHelper.createFirmsWms().firmsGroup
    ];

    layers.map(layer => {
      if (layer instanceof Layer) {
        this.layerSvc.addLayer(layer, 'Layers');
      } else if (layer instanceof LayerGroup) {
        this.layerSvc.addLayerGroup(layer);
      }
    })
  }

  addBaselayers() {
    baselayers.map(l => this.layerSvc.addLayer(l, 'Baselayers'));
  }


  setCurrentTime(range: IDateRange) {
    if (range.min && range.max) {
      this.settingsSvc.currentTimeRange.next(range);

      this.layerHelper.refreshBurntareaWms(range);
      this.layerHelper.refreshFirmsWms(range);
      this.layerHelper.refreshModisDaily(range);
      this.updateUrlQuery();

      this.layerHelper.checkLayersTimeRage(this.layers);
    }
  }

  subscribeToMapState() {
    const routeSub = this.mapStateSvc.getMapState().pipe(distinctUntilChanged((prev, curr) => prev.extent[0] === curr.extent[0] && prev.extent[1] === curr.extent[1] && prev.extent[2] === curr.extent[2] && prev.extent[3] === curr.extent[3])).subscribe((state) => {
      this.updateUrlQuery({
        state
      });
    });
    this.subs.push(routeSub);
  }

  setInitialMapState() {
    this.mapStateSvc.setMapState(this.settingsSvc.startState.value);
  }

  subscribeToFilters() {
    const filterSub = this.settingsSvc.filters.subscribe(filters => {
      this.updateUrlQuery({
        filters
      });
      const cqlFilter = this.settingsSvc.getCQL_FILTER(filters);
      this.layerHelper.filterBurtnareaWms(cqlFilter);
    });
    this.subs.push(filterSub);
  }

  subscribeToRoute() {
    const queryParamsSub = this.route.queryParams.pipe(first()).subscribe((params) => {
      let hasBbox = false;

      Object.keys(params).forEach(param => {
        if (param === 'bbox') {
          const bbox = params[param].split(',').map((i: string) => parseFloat(i)) as TGeoExtent;;
          if (bbox.length === 4) {
            this.mapStateSvc.setExtent(bbox);
            this.settingsSvc.currentExtent.next(bbox);
            hasBbox = true;
          }
        }

        if (param === 'timerange') {
          const timeStrings = params[param].split('/');
          const timeRange: IDateRange = {
            min: timeStrings[0],
            max: timeStrings[1]
          };
          this.settingsSvc.startTimeRange.next(timeRange);
          this.setCurrentTime(timeRange);
        }

        // filters
        const filters: Ifilters = this.settingsSvc.filters.value;
        if (param === 'area_ha') {
          filters.area_ha = params['area_ha'].split(',').map((i: string) => parseFloat(i));
        }

        if (param === 'avg_dndvi') {
          filters.avg_dndvi = params['avg_dndvi'].split(',').map((i: string) => parseFloat(i));
        }

        if (param === 'confidence') {
          filters.confidence = params['confidence'].split(',').map((i: string) => parseFloat(i));
        }

        if (Object.keys(filters).length) {
          this.settingsSvc.filters.next(filters);
        }

        if (param === 'layers') {
          const layerIDs: string[] = params['layers'].split(',');
          if (layerIDs.length) {
            this.layerHelper.updateVisibleLayers(layerIDs);
          }
        }
      });


      if (!hasBbox) {
        this.setInitialMapState()
      }
    });
    this.subs.push(queryParamsSub);
  }

  subscribeToLayers() {
    if (this.layerSvc) {

      const layersSub = this.layerSvc.getLayers().subscribe(layers => {
        this.layers = layers;
        this.layerHelper.checkLayersTimeRage(this.layers);
        this.checkLayersVisible();
      });
      this.subs.push(layersSub);
    }
  }

  checkLayersVisible() {
    const visibleLayers = this.layers.filter(item => item.visible).map(item => item.id);
    this.updateUrlQuery({ layers: visibleLayers });
  }


  updateUrlQuery(params?: { state?: MapState, layers?: string[], filters?: Ifilters }) {
    if (window.history.pushState) {
      const paramsObj: any = {};
      if (params?.state) {
        const extent = params.state.extent.map(item => item.toFixed(3));
        paramsObj.bbox = extent.join(',');
      } else {
        const extent = this.settingsSvc.currentExtent.value.map(item => item.toFixed(3));
        paramsObj.bbox = extent.join(',');
      }

      if (this.settingsSvc.currentTimeRange.value.min && this.settingsSvc.currentTimeRange.value.max) {
        const timeString = `${this.settingsSvc.currentTimeRange.value.min}/${this.settingsSvc.currentTimeRange.value.max}`;
        paramsObj.timerange = timeString;
      }

      if (params?.layers) {
        if (params.layers.length) {
          paramsObj.layers = params.layers.join(',');
        }
      }

      if (params?.filters) {
        paramsObj.area_ha = params.filters?.area_ha.join(',');
        paramsObj.avg_dndvi = params.filters?.avg_dndvi.join(',');
        paramsObj.confidence = params.filters?.confidence.join(',');
      }
      const newurl = updateSearchParamsHashRouting(paramsObj);
      window.history.pushState({ path: newurl }, '', newurl);
    }
  }
}
