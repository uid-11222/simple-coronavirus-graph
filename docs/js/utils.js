export const isLabeledIndex = (index, rows, labelDistance) => {
    if (index < rows - 3) return index % labelDistance === 0;

    if (index === rows - 3 && index % labelDistance > 2) return true;

    return index === rows - 1;
};

export const getCtx = (width, height) => {
    const graph = document.createElement('canvas');

    document.body.append(graph);

    graph.width = width;
    graph.height = height;

    return graph.getContext('2d');
};

export const getDateString = date => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(1 + date.getMonth()).padStart(2, '0');

    return `${day}.${month}`;
};

const TEMPORARY_DOM_ELEMENT = document.createElement('DIV');

export const getDomElement = template => {
    TEMPORARY_DOM_ELEMENT.innerHTML = template.trim();

    return TEMPORARY_DOM_ELEMENT.firstChild;
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

export const COUNTRIES_LIST_ID = 'countriesList';

export const DEFAULT_COUNTRY_NAME = 'US';

export const MS_IN_DAY = 24 * 3600 * 1000;

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

const YEAR = 2020;

export const parseDataText = dataText =>
    dataText
        .trim()
        .split('\n')
        .map(line => {
            const [rawDate, value] = line.split(/\s+/g);
            const [day, month] = rawDate.split(/\./g);
            const date = new Date(YEAR, parseInt(month, 10) - 1, day);

            return { date, value: parseInt(value, 10) };
        })
        .sort((a, b) => (a.date > b.date ? 1 : -1))
        .reduce(
            (acc, { date, value }) => {
                acc[0].push(date);
                acc[1].push(value);

                return acc;
            },
            [[], []],
        );

export const showNoDataForCountryError = countryName => {
    /* eslint-disable-next-line no-console */
    console.error(`No data for country ${countryName}`);
};
