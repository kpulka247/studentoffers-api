import React from 'react'
import i18n from "i18next"
import {initReactI18next, I18nextProvider} from "react-i18next"
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpApi from 'i18next-http-backend'

import ReactDOM from 'react-dom/client'
import App from './App'

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .use(LanguageDetector)
    .use(HttpApi)
    .init({
        supportedLngs: ['en', 'pl'],
        fallbackLng: 'en',
        detection: {
            order: ['cookie', 'navigator', 'htmlTag', 'localStorage', 'path', 'subdomain'],
            caches: ['cookie']
        },
        backend: {
            loadPath: process.env.PUBLIC_URL + '/static/locales/{{lng}}/translation.json'
        },
        react: {useSuspense: false}
    })


const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
    <React.StrictMode>
        <I18nextProvider i18n={i18n}>
            <App/>
        </I18nextProvider>
    </React.StrictMode>
)