import App from './App.js';
import {
    DEFAULT_COUNTRIES_DATA_TEXT,
    getDefaultGraphData,
    GITHUB_API_URL,
    parseCountriesData,
    throttle,
} from './utils.js';

const main = async () => {
    const graphsData = JSON.parse(localStorage.graphsDataText || 'null') || [getDefaultGraphData()];
    const countriesData = parseCountriesData(
        localStorage.countriesDataText || DEFAULT_COUNTRIES_DATA_TEXT,
    );

    const app = new App(graphsData, countriesData);

    app.onChange = throttle(() => {
        localStorage.graphsDataText = JSON.stringify(app.graphsData);
    }, 64);

    document.body.append(app.rootElement);
    app.renderGraphsScrolls();

    const response = await fetch(GITHUB_API_URL);

    const { content } = await response.json();

    const text = atob(content);

    localStorage.countriesDataText = text;

    const newCountriesData = parseCountriesData(text);

    app.setCountriesData(newCountriesData);
};

main();
