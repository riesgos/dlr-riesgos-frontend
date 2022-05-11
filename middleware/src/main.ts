import { createExpressApp } from './express/serverInterface';
import { config } from './config';


const expressApp = createExpressApp();

const expressServer = expressApp.listen(config.port, () => {
    console.log(`App listening on http://localhost:${config.port}`);
});
