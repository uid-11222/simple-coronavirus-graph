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

export const getHeightLabelStep = maxValue => {
    const base = 10 ** Math.floor(Math.log10(maxValue));
    const rate = maxValue / base;

    if (rate >= 5) return base;
    if (rate >= 2) return base / 2;

    return base / 10;
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
        .sort((a, b) => (a.date > b.date ? 1 : -1));
