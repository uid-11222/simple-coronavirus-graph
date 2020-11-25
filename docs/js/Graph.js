import draw from './draw.js';
import { COUNTRIES_LIST_ID, getDomElement, throttle } from './utils.js';

export default class Graph {
    countryData = [];

    rootElement = getDomElement(`
        <li class="country">
            <input class="countriesInput" list="${COUNTRIES_LIST_ID}" title="Choose country">
            <button class="down" title="Move this graph down">▼</button>
            <button class="up" title="Move this graph up">▲</button>
            <button class="remove" title="Remove this graph">–</button>
            <button class="add" title="Add a new graph after this">+</button>
            <div class="graphContainer"><canvas class="graph"></canvas></div>
        </li>
    `);

    graphContainerElement = this.rootElement.querySelector('.graphContainer');

    graphElement = this.rootElement.querySelector('.graph');

    downElement = this.rootElement.querySelector('.down');

    upElement = this.rootElement.querySelector('.up');

    removeElement = this.rootElement.querySelector('.remove');

    addElement = this.rootElement.querySelector('.add');

    constructor(data, parent) {
        this.data = data;
        this.parent = parent;

        this.initialRender();
    }

    initialRender() {
        this.addOnClick({
            upElement: 'upGraph',
            downElement: 'downGraph',
            addElement: 'addGraph',
            removeElement: 'removeGraph',
        });

        const inputElement = this.rootElement.querySelector('.countriesInput');

        inputElement.value = this.data.name;
        inputElement.addEventListener('input', ({ target: { value } }) => {
            if (value in this.parent.countriesData) {
                this.onChangeCountryName(value);
            }
        });

        this.graphContainerElement.addEventListener(
            'scroll',
            throttle(() => {
                this.data.scroll = this.graphContainerElement.scrollLeft;
                this.parent.onChange();
            }, 64),
        );

        this.rerender();
    }

    addOnClick(classesToMethods) {
        for (const [elementName, methodName] of Object.entries(classesToMethods)) {
            this[elementName].addEventListener('click', () => {
                const { parent } = this;
                const { scrollTop } = document.documentElement;

                this.parent[methodName](this.parent.graphsData.indexOf(this.data));
                document.documentElement.scrollTop = scrollTop;

                parent.onChange();
            });
        }
    }

    onChangeCountryName(countryName) {
        if (countryName === this.data.name) return;

        this.data.name = countryName;
        this.setCountryData(this.parent.countriesData[countryName]);
        this.parent.onChange();
    }

    renderScroll() {
        this.graphContainerElement.scrollLeft = this.data.scroll;
    }

    rerender() {
        draw({
            domElement: this.graphElement,
            name: this.data.name,
            values: this.countryData,
        });
    }

    setCountryData(countryData = []) {
        this.countryData = countryData;

        this.rerender();
    }
}
