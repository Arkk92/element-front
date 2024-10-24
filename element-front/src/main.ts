import ClientSocket from "@/infra/sockets/client";
import mitt from "mitt";
import { createApp } from "vue";
import enums from "vue-enums";
import App from "./presentation/App.vue";

import "bootstrap";
import "bootstrap-icons/font/bootstrap-icons";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { createPinia } from "pinia";
import { useAuthStore } from "./presentation/stores/auth";
import { useServerStore } from "./presentation/stores/server";

export const Emitter = mitt();

const pinia = createPinia();
const app = createApp(App);

app.use(enums);
app.use(pinia);

const authStore = useAuthStore();
export const SocketInstance = ClientSocket.setupSocketConnection(
  authStore.getAuthData
);
const serverStore = useServerStore();
serverStore.listenForSocketConnection();
serverStore.listenForSocketDisconnection();
serverStore.listenForActiveUsers();

app.mount("#app");
