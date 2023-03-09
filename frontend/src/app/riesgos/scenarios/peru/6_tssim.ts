import { createKeyValueTableHtml } from 'src/app/helpers/others';
import { FeatureCollection } from '@turf/helpers';
import { toDecimalPlaces } from 'src/app/helpers/colorhelpers';
import { MappableProductAugmenter, WizardableStepAugmenter } from 'src/app/services/augmenter/augmenter.service';
import { RiesgosProduct, RiesgosProductResolved, RiesgosStep } from '../../riesgos.state';
import { WizardableStep } from 'src/app/components/config_wizard/wizardable_steps';
import { WmsLayerProduct } from 'src/app/components/map/mappable/mappable_products';



export class TsWmsPeru implements MappableProductAugmenter {
    appliesTo(product: RiesgosProduct): boolean {
        return product.id === 'tsWms';
    }

    makeProductMappable(product: RiesgosProductResolved): WmsLayerProduct[] {
        // download: access tiff from wcs instead of wms
        // 

        return [{
            ...product,
            description: {
                id: 'epiCenter',
                name: 'ts-wms',
                icon: 'tsunami',
                format: 'string',
                type: 'literal',
                featureInfoRenderer: (fi: FeatureCollection) => {
                    if (fi.features && fi.features[0] && fi.features[0].properties['GRAY_INDEX']) {
                        return createKeyValueTableHtml('Tsunami', {'mwh': toDecimalPlaces(fi.features[0].properties['GRAY_INDEX'], 2) + ' m'}, 'medium');
                    }
                },
            },
        }]
    }

}

export class TsServicePeru implements WizardableStepAugmenter {
    appliesTo(step: RiesgosStep): boolean {
        return step.step.id === 'Tsunami';
    }

    makeStepWizardable(step: RiesgosStep): WizardableStep {
        return {
            ... step,
            scenario: 'Peru',
            wizardProperties: {
                providerName: 'AWI',
                providerUrl: 'https://www.awi.de/en/',
                shape: 'tsunami' as 'tsunami',
                wikiLink: 'TsunamiWiki'
            }
        }
    }

}
