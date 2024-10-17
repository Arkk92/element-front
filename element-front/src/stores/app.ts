import { SocketInstance } from '@/main';
import { DomainToSocketGateway } from '@/sockets/DomainToSocketGateway';
import { SocketController } from '@/sockets/SocketController';
import { defineStore } from 'pinia';

type AppStates = 'Loading' | 'MainMenu' | 'InGame';

export const useAppStore = defineStore('app', {
  state: () => {
    return {
        state: 'Loading' as AppStates
    }
  },
  getters: {
    getState(): AppStates {
        return this.state;
    }
  },
  actions: {
    reset(){
      this.state = 'Loading';
    },
    onLoadingFinished(){
      const socketController = new SocketController(SocketInstance);
      const domainToSocketGateway = new DomainToSocketGateway(SocketInstance);
      socketController.execute();
      domainToSocketGateway.execute();
      this.state = 'MainMenu';
    },
    onGameStart(){
      this.state = 'InGame';
    },
    onGameEnd(){
      this.state = 'MainMenu';
    }
    
  }
})