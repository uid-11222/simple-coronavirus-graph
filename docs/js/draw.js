import {
    isLabeledIndex,
    getCtx,
    getDateString,
    getHeightLabelStep,
    parseDataText,
} from './utils.js';

export default ({
    barColor = 'rgba(250, 0, 0, 0.3)',
    bgColor = 'white',
    dataText,
    graphLineWidth = 2,
    gridColor = '#999',
    gridLineWidth = 1,
    headerColor = 'rgba(0, 0, 100, 0.1)',
    headerFontSize = 120,
    labelBgColor = '#DDD',
    labelFontSize = 14,
    labelMarginX = 70,
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
    const heightLabelsStep = getHeightLabelStep(maxValue);
    const heightLabelsCount = 1 + Math.floor(maxValue / heightLabelsStep);
    const heightScale = (totalHeight - topGraphPadding) / maxValue;
    const labelMarginY = labelFontSize * 2;

    const ctx = getCtx(totalWidth + labelMarginX, totalHeight + labelMarginY);

    /**
     * Background.
     */
    ctx.fillStyle = 'black';
    ctx.moveTo(0, 0);
    ctx.lineWidth = 1;
    ctx.lineTo(totalWidth + labelMarginX, 0);
    ctx.lineTo(totalWidth + labelMarginX, totalHeight + labelMarginY);
    ctx.lineTo(0, totalHeight + labelMarginY);
    ctx.lineTo(0, 0);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, totalWidth, totalHeight);
    ctx.fillStyle = labelBgColor;
    ctx.fillRect(0, totalHeight, totalWidth + labelMarginX, labelMarginY);
    ctx.fillRect(totalWidth, 0, labelMarginX, totalHeight);

    ctx.stroke();

    /**
     * Header.
     */
    ctx.fillStyle = headerColor;
    ctx.font = `${headerFontSize}px serif`;

    ctx.fillText(name, headerFontSize, headerFontSize);

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
            ctx.lineTo(left, totalHeight + 4);
        }
    }

    for (let i = 0; i < heightLabelsCount; i += 1) {
        const height = Math.round(i * heightScale * heightLabelsStep);

        ctx.fillText((heightLabelsStep * i).toLocaleString('en'), totalWidth, totalHeight - height);
        ctx.moveTo(0, totalHeight - height);
        ctx.lineTo(totalWidth, totalHeight - height);
    }

    ctx.stroke();
};
