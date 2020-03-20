import rawData from './data.js';

const barColor = 'rgba(250, 0, 0, 0.5)';
const bgColor = 'rgba(0, 0, 100, 0.1)';
const rowWidth = 20;
const rowWidthPadding = 10;
const totalHeight = 600;
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
const getDaysFromStart = date => (date - startDate) / (24 * 3600 * 1000);
const rows = 1 + getDaysFromStart(data[data.length - 1].date);
const totalWidth = rows * rowWidth;

const max = Math.max(...data.map(item => item.value));
const heightScale = (totalHeight - 30) / max;

graph.width = totalWidth;
graph.height = totalHeight;

ctx.fillStyle = bgColor;
ctx.fillRect(0, 0, totalWidth, totalHeight);

ctx.fillStyle = barColor;
ctx.lineWidth = Math.round(rowWidth / 10);
ctx.beginPath();
// ctx.moveTo(0, totalHeight);

data.forEach(({ date, value }) => {
    const days = getDaysFromStart(date);
    const height = Math.round(value * heightScale);
    const left = days * rowWidth;
    const top = totalHeight - height;

    ctx.lineTo(left, top);
    ctx.fillRect(left, top, rowWidth - rowWidthPadding, height);
});

ctx.stroke();
