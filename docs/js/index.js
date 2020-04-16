import * as data from './data.js';
import draw from './draw.js';

Object.entries(data).forEach(([name, dataText]) =>
    draw({ dataText, name: name.replace('_', ' ') }),
);
