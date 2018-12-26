import Application from './tcpapplication';
import {Store} from './store';

import options from './options';

const app = new Application(options);

app.setStore(new Store(options)).start();
