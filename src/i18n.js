import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

const messages = {
    'en': {
        test: "test",
        homepage: {
            headline: {one: "The root of", two: "all your links"},
            footnote: "The simplest way to redirect your audience"
        }
    },
    'de': {
        test: "test",
        homepage: {
            headline: {one: "Die Wurzel", two: "all deiner Links"},
            footnote: "Der einfachste Weg dein Publikum weiterzuleiten"
        }
    }
};

const i18n = new VueI18n({
    locale: 'en', // set locale
    fallbackLocale: 'en', // set fallback locale
    messages, // set locale messages
});

export default i18n;