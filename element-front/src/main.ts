import { createApp } from 'vue'
//import App from './App.vue'
import Room from '@/components/Room.vue'
import ClientSocket from './sockets/client';

export const SocketInstance = ClientSocket.setupSocketConnection();
createApp(Room).mount('#app')
