export { I18nService } from '@cds/core/internal';
export { componentStringsDefault } from './internal/services/i18n.service.js';
declare global {
    interface HTMLElement {
        'cds-text': string;
        'cds-layout': string;
        'cds-list': string;
        'cds-table': string;
    }
    interface HTMLElementTagNameMap {
        'cds-demo': HTMLElement;
        'cds-placeholder': HTMLElement;
    }
}
