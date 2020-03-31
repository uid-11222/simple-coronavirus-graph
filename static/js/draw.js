const YEAR = 2020;

const isLabeledIndex = (index, rows, labelDistance) => {
    if (index < rows - 3) return index % labelDistance === 0;

    if (index === rows - 3 && index % labelDistance > 2) return true;

    return index === rows - 1; // index % labelDistance && index === rows - 3;
};

const getCtx = (width, height) => {
    const graph = document.createElement('canvas');

    document.documentElement.append(graph);

    graph.width = width;
    graph.height = height;

    return graph.getContext('2d');
};

const getDateString = date => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(1 + date.getMonth()).padStart(2, '0');

    return `${day}.${month}`;
};

const parseDataText = dataText =>
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

export default ({
    barColor = 'rgba(250, 0, 0, 0.3)',
    bgColor = 'rgba(0, 0, 100, 0.1)',
    dataText,
    graphLineWidth = 2,
    gridColor = '#999',
    gridLineWidth = 1,
    headerColor = 'rgba(0, 0, 100, 0.1)',
    headerFontSize = 120,
    heightLabelsStep = 10000,
    labelBgColor = 'rgba(0, 300, 300, 0.3)',
    labelFontSize = 14,
    labelMargin = 50,
    labelDistance = 4,
    msInDay = 24 * 3600 * 1000,
    name,
    rowWidth = 30,
    rowWidthPadding = 22,
    textColor = '#222',
    topGraphPadding = 30,
    totalHeight = 900,
} = {}) => {
    const data = parseDataText(dataText);

    const startDate = data[0].date;
    const getDaysFromStart = date => (date - startDate) / msInDay;
    const rows = 1 + getDaysFromStart(data[data.length - 1].date);
    const totalWidth = rows * rowWidth;
    const rowHalf = Math.round((rowWidth - rowWidthPadding) / 2);

    const maxValue = Math.max(...data.map(item => item.value));
    const heightLabelsCount = 1 + Math.floor(maxValue / heightLabelsStep);
    const heightScale = (totalHeight - topGraphPadding) / maxValue;

    const ctx = getCtx(totalWidth + labelMargin, totalHeight + labelMargin);

    /**
     * Background.
     */
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, totalWidth, totalHeight);
    ctx.fillStyle = labelBgColor;
    ctx.fillRect(0, totalHeight, totalWidth + labelMargin, labelMargin);
    ctx.fillRect(totalWidth, 0, labelMargin, totalHeight);

    /**
     * Graph.
     */
    ctx.fillStyle = barColor;
    ctx.lineWidth = graphLineWidth;
    ctx.beginPath();
    ctx.font = `${labelFontSize}px mono`;

    data.forEach(({ date, value }) => {
        const days = getDaysFromStart(date);
        const height = Math.round(value * heightScale);
        const left = days * rowWidth;
        const top = totalHeight - height;

        ctx.lineTo(left + rowHalf, top);
        ctx.fillRect(left, top, rowWidth - rowWidthPadding, height);
    });

    ctx.stroke();

    /**
     * Labels and grid.
     */
    ctx.beginPath();
    ctx.fillStyle = textColor;
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = gridLineWidth;

    for (let i = 0; i < rows; i += 1) {
        if (isLabeledIndex(i, rows, labelDistance)) {
            const left = i * rowWidth;
            const date = new Date(data[0].date.valueOf() + i * msInDay);

            ctx.fillText(getDateString(date), left, totalHeight + labelFontSize);
            ctx.moveTo(left, 0);
            ctx.lineTo(left, totalHeight);
        }
    }

    for (let i = 0; i < heightLabelsCount; i += 1) {
        const height = Math.round(i * heightScale * heightLabelsStep);

        ctx.fillText(heightLabelsStep * i, totalWidth, totalHeight - height);
        ctx.moveTo(0, totalHeight - height);
        ctx.lineTo(totalWidth, totalHeight - height);
    }

    ctx.stroke();

    /**
     * Header.
     */
    ctx.fillStyle = headerColor;
    ctx.font = `${headerFontSize}px serif`;

    ctx.fillText(name, headerFontSize, headerFontSize);
};
