import { Emitter } from '@/main';
import { JoinGameData, UserAuthData } from '@/sockets/socketUtils';
import { defineStore } from 'pinia'
import { useCookies } from 'vue3-cookies';

const COOKIES_EXPIRATION_TIME = 3600;

export const useAuthStore = defineStore('auth', {
  state: () => {
    const {cookies} = useCookies();
    return {
        cookies,
        roomId: cookies.get('roomId'),
        userId: cookies.get('userId'),
        playerId: cookies.get('playerId'),
        userName: 'Guest'
    }
  },
  getters: {
    getAuthData(): UserAuthData {
        return { roomUuid: this.roomId, userUuid: this.userId, playerUuid: this.playerId };
    }
  },
  actions: {
    reset(){
      this.removeAuthData();
      this.userName = 'Guest';
    },
    updateAuthData(data: UserAuthData) {
      this.roomId = data.roomUuid;
      this.userId = data.userUuid;
      this.playerId = data.playerUuid;
      this.cookies.set("roomId", this.roomId, COOKIES_EXPIRATION_TIME);
      this.cookies.set("userId", this.userId, COOKIES_EXPIRATION_TIME);
      this.cookies.set("playerId", this.playerId, COOKIES_EXPIRATION_TIME);
      Emitter.emit('AuthDataUpdate')
    },
    removeAuthData(){
      this.roomId = '';
      this.userId = '';
      this.cookies.remove("roomId");
      this.cookies.remove("userId");
      this.cookies.remove("playerId");
    },
  },
})