export const MS_IN_DAY = 24 * 3600 * 1000;

const FIRST_DATE = new Date(2020, 0, 22);

export const DATES = [];

let currentDate = FIRST_DATE;
const LAST_DATE_IN_MS = Date.now() + MS_IN_DAY;

while (currentDate < LAST_DATE_IN_MS) {
    DATES.push(currentDate);

    currentDate = new Date(currentDate.valueOf() + MS_IN_DAY);
}

export const COUNTRIES_LIST_ID = 'countriesList';

export const DEFAULT_COUNTRY_NAME = 'US';

export const DEFAULT_COUNTRIES_DATA_TEXT = `
,${DEFAULT_COUNTRY_NAME},0,0
`;

export const isLabeledIndex = (index, rows, labelDistance) => {
    if (index < rows - 3) return index % labelDistance === 0;

    if (index === rows - 3 && index % labelDistance > 2) return true;

    return index === rows - 1;
};

export const getDateString = date => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(1 + date.getMonth()).padStart(2, '0');

    return `${day}.${month}`;
};

export const getDefaultGraphData = () => ({ name: DEFAULT_COUNTRY_NAME, scroll: 0 });

const TEMPORARY_DOM_ELEMENT = document.createElement('DIV');

const templatesCache = {};

export const getDomElement = template => {
    if (template in templatesCache) {
        return templatesCache[template].cloneNode(true);
    }

    TEMPORARY_DOM_ELEMENT.innerHTML = template.trim();

    const element = TEMPORARY_DOM_ELEMENT.firstChild;

    templatesCache[template] = element;

    return element.cloneNode(true);
};

export const getHeightLabelStep = maxValue => {
    const base = 10 ** Math.floor(Math.log10(maxValue));
    const rate = maxValue / base;

    if (rate >= 5) return base;
    if (rate >= 2) return base / 2;

    return base / 10;
};

export const GITHUB_API_URL =
    'https://api.github.com/repos/CSSEGISandData/COVID-19/contents/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';

export const parseCountriesData = text => {
    const countriesData = {};

    text.split('\n')
        .slice(1, -1)
        .forEach(line => {
            const parts = line.split(',');

            if (parts.length < 2) return;

            const [, rawCountry, , , ...numbers] = parts;
            const country = rawCountry.replace(/"/g, '').trim();

            if (country in countriesData) {
                numbers.forEach((number, i) => {
                    countriesData[country][i] += Number(number);
                });
            } else {
                countriesData[country] = numbers.map(Number);
            }
        });

    return countriesData;
};

export const throttle = (fn, delayInMs) => {
    let isPlanned = false;
    const wrappedFn = () => {
        isPlanned = false;
        fn();
    };

    return () => {
        if (isPlanned) return;

        isPlanned = true;

        setTimeout(wrappedFn, delayInMs);
    };
};
