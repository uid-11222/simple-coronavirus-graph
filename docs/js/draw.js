import {
    isLabeledIndex,
    getCtx,
    getDateString,
    getHeightLabelStep,
    MS_IN_DAY,
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
    labelMarginX = 80,
    labelDistance = 4,
    name,
    rowWidth = 30,
    rowWidthPadding = 22,
    textColor = '#222',
    topGraphPadding = 30,
    totalHeight = 900,
} = {}) => {
    const [dates, values] = parseDataText(dataText);

    const startDate = dates[0];
    const getDaysFromStart = date => (date - startDate) / MS_IN_DAY;
    const rows = 1 + getDaysFromStart(dates[dates.length - 1]);
    const totalWidth = rows * rowWidth;
    const rowHalf = Math.round((rowWidth - rowWidthPadding) / 2);

    const maxValue = Math.max(...values);
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

    dates.forEach((date, index) => {
        const value = values[index];
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
            const date = new Date(dates[0].valueOf() + i * MS_IN_DAY);

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
