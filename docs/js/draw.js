import { isLabeledIndex, DATES, getDateString, getHeightLabelStep, MS_IN_DAY } from './utils.js';

export default ({
    barColor = 'rgba(250, 0, 0, 0.3)',
    bgColor = 'white',
    domElement,
    graphLineWidth = 2,
    gridColor = '#999',
    gridLineWidth = 1,
    headerColor = 'rgba(0, 0, 100, 0.1)',
    headerFontSize = 120,
    horizontalLabelFrequency = 32,
    labelBgColor = '#DDD',
    labelFontSize = 14,
    labelMarginX = 120,
    labelDistance = 4,
    name,
    rowWidth = 30,
    rowWidthPadding = 22,
    textColor = '#222',
    topGraphPadding = 50,
    totalHeight = 800,
    translucentTextColor = 'rgba(0, 50, 50, 0.4)',
    values,
} = {}) => {
    const startDate = DATES[0];
    const getDaysFromStart = date => (date - startDate) / MS_IN_DAY;
    const rows = 1 + getDaysFromStart(DATES[values.length - 1]);
    const totalWidth = rows * rowWidth;
    const rowHalf = Math.round((rowWidth - rowWidthPadding) / 2);

    const maxValue = Math.max(...values);
    const heightLabelsStep = getHeightLabelStep(maxValue);
    const heightLabelsCount = 1 + Math.floor(maxValue / heightLabelsStep);
    const heightScale = (totalHeight - topGraphPadding) / maxValue;
    const labelMarginY = labelFontSize * 2;

    /* eslint-disable-next-line no-param-reassign */
    domElement.width = totalWidth + labelMarginX;
    /* eslint-disable-next-line no-param-reassign */
    domElement.height = totalHeight + labelMarginY;

    const ctx = domElement.getContext('2d');

    ctx.clearRect(0, 0, domElement.width, domElement.height);

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

    values.forEach((value, index) => {
        const date = DATES[index];
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
            const date = new Date(DATES[0].valueOf() + i * MS_IN_DAY);

            ctx.fillText(getDateString(date), left, totalHeight + labelFontSize);
            ctx.moveTo(left, 0);
            ctx.lineTo(left, totalHeight + 4);
        }
    }

    for (let i = 0; i < heightLabelsCount; i += 1) {
        const height = Math.round(i * heightScale * heightLabelsStep);

        ctx.fillText(
            (heightLabelsStep * i).toLocaleString('en'),
            totalWidth + 2,
            totalHeight - height - 3,
        );
        ctx.moveTo(0, totalHeight - height);
        ctx.lineTo(totalWidth, totalHeight - height);
    }

    ctx.fillStyle = translucentTextColor;

    for (let i = 0; i < rows - 2 * labelDistance; i += 1) {
        if (isLabeledIndex(i, rows, labelDistance) && i % horizontalLabelFrequency === 0) {
            const left = i * rowWidth;

            for (let j = 0; j < heightLabelsCount; j += 1) {
                const height = Math.round(j * heightScale * heightLabelsStep);

                ctx.fillText(
                    (heightLabelsStep * j).toLocaleString('en'),
                    left + 2,
                    totalHeight - height - 3,
                );
            }
        }
    }

    ctx.stroke();
};
