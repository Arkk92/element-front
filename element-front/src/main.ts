import App from "@/App.vue";
import mitt from "mitt";
import { createApp } from "vue";
import enums from "vue-enums";
import ClientSocket from "./sockets/client";

import "bootstrap";
import "bootstrap-icons/font/bootstrap-icons";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { createPinia } from "pinia";

export const Emitter = mitt();

export const SocketInstance = ClientSocket.setupSocketConnection();

const pinia = createPinia();
const app = createApp(App);

app.use(enums);
app.use(pinia);

app.mount("#app");
