import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

export type TranslationDictionary = Record<string, unknown>;

const NAMESPACE = 'translation';

const sanitize = (value?: TranslationDictionary): TranslationDictionary => {
    if (!value || typeof value !== 'object') {
        return {};
    }
    return value;
};

export const configureI18n = (
    locale: string | undefined,
    fallbackLocale: string | undefined,
    translations?: TranslationDictionary,
    fallbackTranslations?: TranslationDictionary,
) => {
    const primary = sanitize(translations);
    const fallback = sanitize(fallbackTranslations);
    const lng = locale && locale.trim() ? locale : 'en';
    const flng =
        fallbackLocale && fallbackLocale.trim() ? fallbackLocale : 'en';

    if (!i18next.isInitialized) {
        i18next.use(initReactI18next).init({
            resources: {
                [flng]: { [NAMESPACE]: fallback },
                [lng]: { [NAMESPACE]: primary },
            },
            lng,
            fallbackLng: flng,
            interpolation: {
                escapeValue: false,
            },
            defaultNS: NAMESPACE,
        });
        return;
    }

    if (!i18next.hasResourceBundle(flng, NAMESPACE)) {
        i18next.addResourceBundle(flng, NAMESPACE, fallback, true, true);
    }
    if (!i18next.hasResourceBundle(lng, NAMESPACE)) {
        i18next.addResourceBundle(lng, NAMESPACE, primary, true, true);
    }

    if (i18next.language !== lng) {
        void i18next.changeLanguage(lng);
    }
};

export { useTranslation } from 'react-i18next';
