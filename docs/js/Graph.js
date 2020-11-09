import draw from './draw.js';
import { COUNTRIES_LIST_ID, getDomElement, showNoDataForCountryError } from './utils.js';

export default class Graph {
    countryData = [];

    domElement = getDomElement(`
        <li class="country">
            <input class="countriesInput" list="${COUNTRIES_LIST_ID}" title="Choose country">
            <button class="down" title="Move this graph down">▼</button>
            <button class="up" title="Move this graph up">▲</button>
            <button class="remove" title="Remove this graph">-</button>
            <button class="add" title="Add a new graph after this">+</button>
            <div class="graphContainer"><canvas class="graph"></canvas></div>
        </li>
    `);

    graphElement = this.domElement.querySelector('.graph');

    constructor(data, parent) {
        this.data = data;
        this.parent = parent;

        this.initialRender();
    }

    initialRender() {
        this.addOnClick({
            up: 'upGraph',
            down: 'downGraph',
            add: 'addGraph',
            remove: 'removeGraph',
        });

        const inputElement = this.domElement.querySelector('.countriesInput');

        inputElement.value = this.data.name;
        inputElement.addEventListener('change', ({ target }) =>
            this.onChangeCountryName(target.value),
        );

        this.rerender();
    }

    addOnClick(classesToMethods) {
        for (const [className, methodName] of Object.entries(classesToMethods)) {
            this.domElement.querySelector(`.${className}`).addEventListener('click', () => {
                const { parent } = this;

                this.parent[methodName](this.parent.graphsData.indexOf(this.data));
                parent.onChange();
            });
        }
    }

    onChangeCountryName(countryName) {
        if (countryName in this.parent.countriesData) {
            this.data.name = countryName;
            this.setCountryData(this.parent.countriesData[countryName]);
            this.parent.onChange();
        } else {
            showNoDataForCountryError(countryName);
        }
    }

    rerender() {
        draw({
            domElement: this.graphElement,
            name: this.data.name,
            values: this.countryData,
        });
    }

    setCountryData(countryData) {
        this.countryData = countryData;

        this.rerender();
    }
}
