import { defineStore } from "pinia";

import { onNumberOfUsersConnected } from "@/infra/sockets/services/usersConnectedSocket";
import { onSocketConnect } from "@/infra/sockets/services/connectSocket";
import { onSocketDisconnect } from "@/infra/sockets/services/disconnectSocket";
import { SocketInstance } from "@/main";
import { useAuthStore } from "./auth";

const defaultState = {
  serverUp: false,
  numOfActiveUsers: 0,
};

export const useServerStore = defineStore("server", {
  state: () => {
    return {
      ...defaultState,
    };
  },
  getters: {},
  actions: {
    reset() {
      Object.assign(this, defaultState);
    },
    updateNumberOfActiveUsers(numOfUsers: number): void {
      this.numOfActiveUsers = numOfUsers;
    },
    listenForActiveUsers() {
      onNumberOfUsersConnected(this.updateNumberOfActiveUsers);
    },
    listenForSocketConnection(): void {
        onSocketConnect(()=>{
            this.serverUp = true;
        })
    },
    listenForSocketDisconnection(): void {
        onSocketDisconnect(()=>{
            this.serverUp = false;
        })
    }
  },
});
