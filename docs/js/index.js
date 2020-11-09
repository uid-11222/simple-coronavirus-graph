import App from './App.js';
import { DEFAULT_COUNTRY_NAME, GITHUB_API_URL, parseCountriesData } from './utils.js';

const main = async () => {
    const graphsData = JSON.parse(localStorage.graphsDataText || 'null') || [
        { name: DEFAULT_COUNTRY_NAME },
    ];
    const countriesData = parseCountriesData(localStorage.countriesDataText || '');

    const app = new App(graphsData, countriesData);

    app.onChange = () => {
        setTimeout(() => {
            localStorage.graphsDataText = JSON.stringify(app.graphsData);
        }, 8);
    };

    document.body.append(app.domElement);

    const response = await fetch(GITHUB_API_URL);

    const { content } = await response.json();

    const text = atob(content);

    localStorage.countriesDataText = text;

    const newCountriesData = parseCountriesData(text);

    app.setCountriesData(newCountriesData);
};

main();
