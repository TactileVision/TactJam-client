import React from 'react';
import ReactDOM from 'react-dom';
import App from '@/components/App';
import axios from "axios";
import { I18nextProvider } from 'react-i18next';
import i18n from './services/i18n';
import { InformProvider } from './components/centralComponents/InformContext';

axios.defaults.baseURL = 'https://itactjam.informatik.htw-dresden.de';
axios.defaults.timeout = 2000,
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

ReactDOM.render(
    <I18nextProvider i18n={i18n}>
        <InformProvider>
            <App />
        </InformProvider>
    </I18nextProvider>
    , document.getElementById('root'));
