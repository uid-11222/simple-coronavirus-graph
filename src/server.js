import { join } from 'path';
import { fileURLToPath } from 'url';

import express from 'express';

const rootDir = join(fileURLToPath(import.meta.url), '..', '..');
const staticDir = join(rootDir, 'static');
const PORT = process.env.PORT || 5000;
const server = express();

server.set('port', PORT);

server.use('/', express.static(staticDir));

server.listen(PORT, () => {
    /* eslint-disable-next-line no-console */
    console.log(`Start server on port ${PORT}.`);
});
