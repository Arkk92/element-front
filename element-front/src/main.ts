import App from '@/App.vue';
import mitt from 'mitt';
import { createApp } from 'vue';
import enums from 'vue-enums';
import ClientSocket from './sockets/client';

import "bootstrap";
import 'bootstrap-icons/font/bootstrap-icons';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { SocketController } from './sockets/SocketController';
import { createPinia } from 'pinia';
import { DomainToSocketGateway } from './sockets/DomainToSocketGateway';

export const Emitter = mitt();

export const SocketInstance = ClientSocket.setupSocketConnection();
const socketController = new SocketController(SocketInstance);
const domainToSocketGateway = new DomainToSocketGateway(SocketInstance);
const pinia = createPinia()
const app = createApp(App)

app.use(enums)
app.use(pinia);

socketController.execute();
domainToSocketGateway.execute();

app.mount('#app')
