import { WizardableStep } from "src/app/components/config_wizard/wizardable_steps";
import { MultiVectorLayerProduct } from "src/app/components/map/mappable/mappable_products";
import { BarData, createGroupedBarChart } from "src/app/helpers/d3charts";
import { MappableProductAugmenter, WizardableStepAugmenter } from "src/app/services/augmenter/augmenter.service";
import { RiesgosProduct, RiesgosProductResolved, RiesgosStep } from "../../riesgos.state";
import { laharLossProps, laharUpdatedExposureProps } from "./7_lahardamage";



const laharAshfallLossProps = {
    ... laharLossProps,
    name: 'Lahar_and_Ashfall_Loss',
};

const laharAshfallUpdatedExposureProps = {
    ... laharUpdatedExposureProps,
    vectorLayerAttributes: {
        ... laharUpdatedExposureProps.vectorLayerAttributes,
        text: (props: object) => {
            const anchor = document.createElement('div');
            const expo = props['expo'];

            const data: {[groupName: string]: BarData[]} = {};
            for (let i = 0; i < expo['Taxonomy'].length; i++) {
                const dmg = expo['Damage'][i];
                const tax = expo['Taxonomy'][i];
                const bld = expo['Buildings'][i];
                if (!data[tax]) {
                    data[tax] = [];
                }
                data[tax].push({
                    label: dmg,
                    value: bld
                });
            }

            for (const label in data) {
                if (data[label]) {
                    // There seems to be never an entry with 'D1'
                    if (!data[label].find(e => e.label === 'D1')) {
                        data[label].push({label: "D1", value: 0});
                    }
                    data[label].sort((dp1, dp2) => dp1.label > dp2.label ? 1 : -1);
                }
            }

            const anchorUpdated = createGroupedBarChart(anchor, data, 400, 400, '{{ taxonomy_DX }}', '{{ nr_buildings }}');
            return `<h4 style="color: var(--clr-p1-color, #666666);">{{ Lahar_and_ashfall_damage_classification }}</h4>${anchor.innerHTML} {{ DamageStatesMavrouli }}{{StatesNotComparable}}`;
        },
    },
    name: 'LaharAndAshfallExposure',
};


export class LaharAshfallDamageMultiLayer implements MappableProductAugmenter {
    appliesTo(product: RiesgosProduct): boolean {
        return product.id === 'combinedDamageEcuador';
    }

    makeProductMappable(product: RiesgosProductResolved): MultiVectorLayerProduct[] {
        return [{
            ...product,
            description: {
                format: 'application/json',
                type: 'complex',
                vectorLayers: [laharAshfallUpdatedExposureProps, laharAshfallLossProps]
            },
        }];
    }

}


export class LaharAshfallDamage implements WizardableStepAugmenter {
    appliesTo(step: RiesgosStep): boolean {
        return step.step.id === 'CombinedDamageEcuador';
    }

    makeStepWizardable(step: RiesgosStep): WizardableStep {
        return {
            ...step,
            scenario: 'Ecuador',
            wizardProperties: {
                shape: 'dot-circle',
                providerName: 'GFZ',
                providerUrl: 'https://www.gfz-potsdam.de/en/',
                wikiLink: 'ExposureAndVulnerabilityEcuador'
            }
        }
    }
}
