import { createApp } from 'vue'
import App from '@/App.vue'
import ClientSocket from './sockets/client';
import enums from 'vue-enums'
import mitt from 'mitt';

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap";
import 'bootstrap-icons/font/bootstrap-icons';
import 'bootstrap-icons/font/bootstrap-icons.css';

export const SocketInstance = ClientSocket.setupSocketConnection();
export const Emitter = mitt();

console.log(process.env.VUE_APP_TITLE);
const app = createApp(App)
app.use(enums)
app.mount('#app')
