import rawData from './data.js';

const barColor = 'rgba(250, 0, 0, 0.3)';
const bgColor = 'rgba(0, 0, 100, 0.1)';
const gridColor = '#999';
const labelBgColor = 'rgba(0, 300, 300, 0.3)';
const labelFontSize = 14;
const labelMargin = 50;
const labelDistance = 4;
const heightLabelsStep = 10000;
const rowWidth = 35;
const rowWidthPadding = 27;
const msInDay = 24 * 3600 * 1000;
const textColor = '#222';
const totalHeight = 900;
const year = new Date().getFullYear();

const data = rawData
    .trim()
    .split('\n')
    .map(line => {
        const [rawDate, value] = line.split(/\s+/g);
        const [day, month] = rawDate.split(/\./g);
        const date = new Date(year, parseInt(month, 10) - 1, day);

        return { date, value: parseInt(value, 10) };
    })
    .sort((a, b) => (a.date > b.date ? 1 : -1));

const graph = document.getElementById('graph');
const ctx = graph.getContext('2d');

const startDate = data[0].date;
const getDateString = date => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(1 + date.getMonth()).padStart(2, '0');

    return `${day}.${month}`;
};
const getDaysFromStart = date => (date - startDate) / msInDay;
const rows = 1 + getDaysFromStart(data[data.length - 1].date);
const totalWidth = rows * rowWidth;
const rowHalf = Math.round((rowWidth - rowWidthPadding) / 2);

const max = Math.max(...data.map(item => item.value));
const heightScale = (totalHeight - 30) / max;

graph.width = totalWidth + labelMargin;
graph.height = totalHeight + labelMargin;

ctx.fillStyle = bgColor;
ctx.fillRect(0, 0, totalWidth, totalHeight);
ctx.fillStyle = labelBgColor;
ctx.fillRect(0, totalHeight, totalWidth + labelMargin, labelMargin);
ctx.fillRect(totalWidth, 0, labelMargin, totalHeight);

ctx.fillStyle = barColor;
ctx.lineWidth = 2;
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

ctx.beginPath();
ctx.fillStyle = textColor;
ctx.strokeStyle = gridColor;
ctx.lineWidth = 1;

for (let i = 0; i < rows; i += 1) {
    if (i % labelDistance === 0 || i === rows - 1) {
        const left = i * rowWidth;
        const date = new Date(data[0].date.valueOf() + i * msInDay);
        ctx.fillText(getDateString(date), left, totalHeight + labelFontSize);
        ctx.moveTo(left, 0);
        ctx.lineTo(left, totalHeight);
    }
}

const heightLabelsCount = 1 + Math.floor(max / heightLabelsStep);

for (let i = 0; i < heightLabelsCount; i += 1) {
    const height = Math.round(i * heightScale * heightLabelsStep);
    ctx.fillText(heightLabelsStep * i, totalWidth, totalHeight - height);
    ctx.moveTo(0, totalHeight - height);
    ctx.lineTo(totalWidth, totalHeight - height);
}

ctx.stroke();
