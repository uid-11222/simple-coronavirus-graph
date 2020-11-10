import Graph from './Graph.js';
import {
    DEFAULT_COUNTRY_NAME,
    COUNTRIES_LIST_ID,
    getDefaultGraphData,
    getDomElement,
    showNoDataForCountryError,
} from './utils.js';

export default class App {
    graphs = [];

    rootElement = getDomElement('<ul class="countriesList"></ul>');

    datalistElement = getDomElement(`<datalist id="${COUNTRIES_LIST_ID}">`);

    onChange = () => {};

    constructor(graphsData, countriesData) {
        this.graphsData = graphsData;
        this.countriesData = countriesData;

        this.initialRender();
    }

    initialRender() {
        document.body.append(this.datalistElement);

        for (const graphData of this.graphsData) {
            if (graphData.name in this.countriesData) {
                const graph = new Graph(graphData, this);

                this.graphs.push(graph);

                graph.setCountryData(this.countriesData[graphData.name]);

                this.rootElement.append(graph.rootElement);
            } else {
                showNoDataForCountryError(graphData.name);
            }
        }
    }

    setCountriesData(countriesData) {
        this.countriesData = countriesData;

        const countriesOptions = [];

        for (const countryName of Object.keys(this.countriesData)) {
            countriesOptions.push(`<option value="${countryName}">`);
        }

        this.datalistElement.innerHTML = countriesOptions.join('');

        for (const graph of this.graphs) {
            if (graph.data.name in this.countriesData) {
                graph.setCountryData(this.countriesData[graph.data.name]);
            } else {
                showNoDataForCountryError(graph.data.name);
            }
        }
    }

    upGraph(index) {
        if (index === 0) return;

        [this.graphsData[index - 1], this.graphsData[index]] = [
            this.graphsData[index],
            this.graphsData[index - 1],
        ];

        [this.graphs[index - 1], this.graphs[index]] = [this.graphs[index], this.graphs[index - 1]];

        this.rootElement.childNodes[index - 1].before(this.rootElement.childNodes[index]);
    }

    downGraph(index) {
        if (index === this.graphsData.length - 1) return;

        [this.graphsData[index + 1], this.graphsData[index]] = [
            this.graphsData[index],
            this.graphsData[index + 1],
        ];

        [this.graphs[index + 1], this.graphs[index]] = [this.graphs[index], this.graphs[index + 1]];

        this.rootElement.childNodes[index + 1].after(this.rootElement.childNodes[index]);
    }

    addGraph(index) {
        if (!(DEFAULT_COUNTRY_NAME in this.countriesData)) {
            showNoDataForCountryError(DEFAULT_COUNTRY_NAME);

            return;
        }

        const graphData = getDefaultGraphData();
        const graph = new Graph(graphData, this);

        this.graphsData.splice(index + 1, 0, graphData);
        this.graphs.splice(index + 1, 0, graph);

        graph.setCountryData(this.countriesData[graphData.name]);

        this.rootElement.childNodes[index].after(graph.rootElement);
    }

    removeGraph(index) {
        if (this.graphsData.length === 1) return;

        /* eslint-disable-next-line no-alert, no-restricted-globals */
        if (!confirm('Are you sure you want to delete this graph?')) return;

        const graph = this.graphs[index];

        this.graphsData.splice(index, 1);
        this.graphs.splice(index, 1);

        graph.rootElement.remove();

        for (const key of Object.keys(graph)) {
            graph[key] = undefined;
        }
    }

    renderGraphsScrolls() {
        for (const graph of this.graphs) {
            graph.renderScroll();
        }
    }
}
