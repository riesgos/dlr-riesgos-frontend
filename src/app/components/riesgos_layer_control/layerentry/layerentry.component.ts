import { Component, OnInit, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import {
  LayerGroup, Layer, RasterLayer, isRasterLayertype, WmsLayertype, WmtsLayertype, isRasterLayer,
  isVectorLayer, LayersService
} from '@dlr-eoc/services-layers';
import { MapStateService } from '@dlr-eoc/services-map-state';
import { } from '@dlr-eoc/services-layers';
import { ProductLayer } from '../../map/map.types';
import { state, style, transition, animate, trigger } from '@angular/animations';
import { ThemeService, ThemeMetadata } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'riesgos-layerentry',
  templateUrl: './layerentry.component.html',
  styleUrls: ['./layerentry.component.scss'],
  animations: [

    trigger('focusUnfocus', [
      state('focussed', style({
        'color': 'var(--clr-forms-focused-color)',
        'font-weight': 'bolder',
        'background-color': 'var(--clr-accordion-header-background-color)'
      })),
      state('unfocussed', style({
        'color': 'var(--clr-forms-subtext-color)',
        'font-weight': 'normal',
        'background-color': 'var(--clr-accordion-header-hover-background-color)'
      })),
      transition('focussed <=> unfocussed', [
        animate('0.5s')
      ]),

      state('focussedDark', style({
        'color': 'var(--clr-color-neutral-0)',
        'font-weight': 'bolder',
        'background-color': 'var(--clr-color-action-900)'
      })),
      state('unfocussedDark', style({
        'color': 'var(--clr-color-neutral-400)',
        'font-weight': 'normal',
        'background-color': '#17242b'
      })),
      transition('focussedDark <=> unfocussedDark', [
        animate('0.5s')
      ]),

    ]),

    trigger('focusUnfocusBG', [
      state('focussed', style({
        'background-color': 'var(--clr-accordion-header-background-color)'
      })),
      state('unfocussed', style({
        'background-color': 'var(--clr-accordion-header-hover-background-color)'
      })),
      transition('focussed <=> unfocussed', [
        animate('0.5s')
      ]),

      state('focussedDark', style({
        'background-color': 'var(--clr-color-action-900)'
      })),
      state('unfocussedDark', style({
        'background-color': '#17242b'
      })),
      transition('focussedDark <=> unfocussedDark', [
        animate('0.5s')
      ])
    ]),
  ]
})
export class RiesgosLayerentryComponent implements OnInit {
  private theme: string;

  @HostBinding('class.layer-visible') get visible() { return this.layer.visible; }
  @HostBinding('class') get cssClass() { return this.layer.cssClass; }

  @Input('layersSvc') layersSvc: LayersService;
  @Input('mapState') mapState?: MapStateService;
  @Input('layer') layer: ProductLayer;

  @Input('group') group?: LayerGroup;
  @Input('layerGroups') layerGroups?: LayerGroup[];
  @Input('expanded') set expanded(value: boolean) {
    if (this.layer) {
      this.layer.expanded = value;
    }
  }
  get expanded() {
    if (this.layer) {
      return this.layer.expanded;
    } else {
      return false;
    }
  }
  @Input('expandable') expandable = true;


  @Output() update = new EventEmitter<{ layer: Layer }>();

  public canZoomToLayer = false;

  public activeTabs = {
    settings: false,
    legend: true,
    styleLegend: false,
    description: false,
    dynamicDescription: false,
    changeStyle: false
  };


  constructor(
    //private store: Store<State>
    private themeService: ThemeService
  ) {
    this.themeService.getActiveTheme().subscribe((tm: ThemeMetadata) => {
      this.theme = tm.name;
    });
  }

  getFocusState(): string {
    let out = '';
    if (this.layer.hasFocus) {
      out += 'focussed';
    } else {
      out += 'unfocussed';
    }
    if (this.theme === 'dark') {
      out += 'Dark';
    }
    return out;
  }

  /**
   * obj: {any| IDynamicComponent}
   */
  checkIsComponentItem(obj: any, layer: Layer) {
    let isComp = false;
    if (obj && typeof obj === 'object') {
      if ('component' in obj) {
        if (!obj.inputs) {
          obj.inputs = { layer };
        } else if (obj.inputs && !obj.inputs.layer) {
          obj.inputs = Object.assign({ layer }, obj.inputs);
        }
        isComp = true;
      }
    }
    return isComp;
  }

  getLayerName(layer: Layer) {
    if (layer.displayName) {
      return layer.displayName;
    } else {
      return layer.name;
    }
  }

  ngOnInit() {
    if (!this.layersSvc) {
      console.error('you need to provide a layersService!');
    }
    if (!this.layer.legendImg) {
      this.activeTabs.description = true;
      this.activeTabs.legend = false;
      this.activeTabs.settings = false;
      this.activeTabs.changeStyle = false;
    }

    if (!this.layer.legendImg && !this.layer.description) {
      this.activeTabs.description = false;
      this.activeTabs.legend = false;
      this.activeTabs.settings = true;
    }

    if (this.layer.bbox && this.layer.bbox.length >= 4) {
      this.canZoomToLayer = true;
    }

    // this.store.pipe(
    //   select(getFocussedProcessId),
    //   withLatestFrom(
    //       this.store.pipe(select(getGraph)),
    //       this.layersSvc.getOverlays()),
    //   ).subscribe(([focussedProcessId, graph, currentOverlays]: [string, Graph, ProductLayer[]]) => {
    //     console.log(focussedProcessId, graph);
    //   });
  }

  /**
   * show or hide the layer
   */
  setLayerVisibility(selectedLayer: Layer, group?: LayerGroup) {
    if (!group) {
      if (selectedLayer.filtertype === 'Baselayers') {
        selectedLayer.visible = !selectedLayer.visible;
        const filterdlayers = this.layerGroups.filter((l) => l.filtertype === 'Baselayers');
        for (const layer of filterdlayers) {
          if (layer instanceof Layer && layer.id !== selectedLayer.id) {
            layer.visible = !selectedLayer.visible;
            this.layersSvc.updateLayer(layer, layer.filtertype || 'Baselayers');
          }
        }
      } else {
        selectedLayer.visible = !selectedLayer.visible;
        this.layersSvc.updateLayer(selectedLayer, selectedLayer.filtertype || 'Layers'); // TODO check for baselayers!!!!!!
      }
    } else {
      if (group.layers.length > 0) {
        /** "radio" for Baselayers */
        if (group.filtertype === 'Baselayers') {
          for (const layer of group.layers) {
            layer.visible = layer === selectedLayer;
          }
          this.update.emit({
            layer: this.layer
          });
          /** "checkbox" for all other layers */
        } else {
          const tempGroupVisible = group.visible;
          /** change visibility of the selected layer */
          selectedLayer.visible = !selectedLayer.visible;

          /** check if group visibility has changed */
          if (tempGroupVisible !== group.visible) {
            this.update.emit({
              layer: this.layer
            });
          } else {
            /** If the visibility of the group don't changes update only the layer  */
            this.layersSvc.updateLayer(selectedLayer, selectedLayer.filtertype || 'Layers');
          }
        }
      }
    }
  }
  /**
   * setLayerIndex
   */
  setLayerIndex(layer: Layer, dir, group?: LayerGroup) {
    // console.log('is First', this.isFirst(layer));
    // console.log('is Last', this.isLast(layer));
    // console.log(layer, group);
    if (group) {
      this.layersSvc.setLayerIndexInGroup(layer, dir, group);
    } else {
      this.layersSvc.setGroupLayerIndex(layer, dir);
    }
  }


  zoomTo(layer: Layer) {
    if (this.mapState && layer.bbox && layer.bbox.length >= 4) {
      this.mapState.setExtent(layer.bbox as [number, number, number, number]);
    }
  }

  setLayerOpacity(layer) {
    if (!this.group) {
      this.layersSvc.updateLayer(layer, layer.filtertype || 'Layers'); // TODO check for baselayers!!!!!!
    } else {
      this.update.emit({
        layer
      });
    }
  }

  checkBaselayer(layer: Layer, group?: LayerGroup) {
    if (layer.filtertype === 'Baselayers' || group && group.filtertype === 'Baselayers') {
      return true;
    } else {
      return false;
    }
  }

  /**
   * is expandable if layer has legend, description or opacity can be changed
   */
  is_expandable() {
    if (this.group) {
      return !this.layer.legendImg && this.group.filtertype === 'Baselayers';
    } else {
      return false; // !this.layer.legendImg; //this.layer.description
    }
  }

  showProperties() {
    if (!this.is_expandable()) {
      this.expanded = !this.expanded;
    }
  }

  switchTab(tabName: string) {
    for (const key of Object.keys(this.activeTabs)) {
      this.activeTabs[key] = tabName === key;
    }
  }

  isSelectedStyle(styleName: string): boolean {
    if (isRasterLayer(this.layer)) {
      if (this.layer.type === WmsLayertype) {
        return (this.layer as RasterLayer).params.STYLES === styleName;
      } else if (this.layer.type === WmtsLayertype) {
        return (this.layer as RasterLayer).params.style === styleName;
      }
    } else if (isVectorLayer(this.layer)) {
      // TODO: how to compare styles for vector layers?
      return false;
    }
    // TODO: how to compare styles for custom layers?
    return false;
  }

  executeChangeStyle(newStyleName: string) {
    if (isRasterLayertype(this.layer.type)) {
      if ((this.layer as RasterLayer).styles) {
        const newStyle = (this.layer as RasterLayer).styles.find(s => s.name === newStyleName);
        if (newStyle) {
          this.layer.legendImg = newStyle.legendURL;
          if (this.layer.type === WmsLayertype) {
            (this.layer as RasterLayer).params.STYLES = newStyle.name;
          } else if (this.layer.type === WmtsLayertype) {
            (this.layer as RasterLayer).params.style = newStyle.name;
          }
          this.layersSvc.updateLayer(this.layer, this.layer.filtertype);
        }
      }
    }
  }

  isFirst(layer) {
    if (this.group) {
      return this.layersSvc.isGroupFirst(layer, this.group.layers);
    } else {
      return this.layersSvc.isGroupFirst(layer, null, layer.filtertype);
    }
  }

  isLast(layer) {
    if (this.group) {
      return this.layersSvc.isGroupLast(layer, this.group.layers);
    } else {
      return this.layersSvc.isGroupLast(layer, null, layer.filtertype);
    }
  }

  getExpandShape() {
    // return this.openProperties ? 'down' : 'right';
    if (this.layer.icon) {
      return { transform: 'rotate(0deg)' };
    } else {
      return this.expanded ? { transform: 'rotate(90deg)' } : { transform: 'rotate(0deg)' };
    }
  }

}

