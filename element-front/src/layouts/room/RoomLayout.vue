<template>
  <div class="room-container">
    <Background/>
    <div v-if="data_ready" class="room-layout">
  
      <div class="container-fluid full-height-container">
        <div class="row custom-row">
          <div class="col side-col overlay-column">
            <UserLayout class="user-layout-column" />
            <Logger class="logger-layout-column" />
          </div>
          <div class="col center-col overlay-column d-flex justify-content-center align-items-center">
            <GameLayout :game="roomData.game" :is-user-turn="isCurrentUserTurn()"
              :current-player-id="playerId" :room-id="roomData.uuid"></GameLayout>
          </div>
          <div class="col side-col overlay-column">
            <div class="chat-layout-wrapper">
  
              <ChatLayout :room-id="roomData.uuid"></ChatLayout>
            </div>
            <div class="player-action-layout">
  
              <PlayerActionsLayout :is-user-turn="isCurrentUserTurn()" :element-pool-manager="roomData.game.board.elementPool"
                :turn="roomData.game.turn" :room-id="roomData.uuid" :player="playerId">
              </PlayerActionsLayout>
  
            </div>
          </div>
          <WinnerLayout v-if="isGameOver" :current-user="userId" :room="roomData" :winner="winner" @on-close="resetRoomLayout"></WinnerLayout>
        </div>
      </div>
  
    </div>
    <div class="room-layout" v-else>
      <MainMenu/>
    </div>
  </div>
</template>

<script lang="ts">
import Background from '@/components/Background.vue';
import Logger from '@/composables/Logger.vue';
import MainMenu from '@/composables/MainMenu/MainMenu.vue';
import { RoomModel } from '@/game/models/room';
import { Emitter } from '@/main';
import { useGameStore } from '@/stores/game';
import { useRoomStore } from '@/stores/room';
import { defineComponent } from 'vue';
import { useCookies } from "vue3-cookies";
import UserLayout from './UserLayout.vue';
import WinnerLayout from './WinnerLayout.vue';
import ChatLayout from './chatLayout.vue';
import GameLayout from './gameLayout.vue';
import PlayerActionsLayout from './playerActionsLayout.vue';
import { useAuthStore } from '@/stores/auth';

let room: RoomModel;

export default defineComponent({
  name: 'RoomLayout',
  components: {
    UserLayout,
    GameLayout,
    ChatLayout,
    WinnerLayout,
    PlayerActionsLayout,
    Logger,
    Background,
    MainMenu
  },
  setup() {
    const { cookies } = useCookies();
    const roomStore = useRoomStore();
    const authStore = useAuthStore();
    const gameStore = useGameStore();
    return { cookies, authStore, roomStore, gameStore };
  },
  data() {
    return {
      username: "Username",
      data_ready: false,
      roomData: room,
      turn_player_uuid: "",
      error: "",
      showingError: false,
      isGameOver: false,
      winner: '',
    }
  },
  mounted() {
    
    if(this.authStore.roomId != null){
      /* Existing session try to reconnect */
      this.roomStore.updateRoomState('Re-Joining'); 
    }
    Emitter.on('RoomUpdate', () =>{
      const gameStore = useGameStore();  
      this.roomData = this.roomStore.roomModel;
      this.turn_player_uuid = gameStore.turnPlayerId;
      if(gameStore.winner){
        this.isGameOver = true;
        this.winner = gameStore.winner
      }
      this.data_ready = true;
    })
    // SocketInstance.on("gameUpdate", (data) => {
    //   console.log("Game update: ")
    //   console.log(data)

    //   if (data != null) {
    //     room = new RoomModelMap().toDomain(data.room);
    //     this.roomData = room;
    //     this.turn_player_uuid = data.player_turn_uuid;

    //     if (data.winner != null) {
    //       this.isGameOver = true;
    //       this.winner = data.winner!
    //       setTimeout(() => {
    //         this.cookies.remove('roomId');
    //         this.cookies.remove('userId');
    //       }, 2000);

    //     }
    //     this.data_ready = true;
    //   }
    // }),
    //   SocketInstance.on('error', async (data) => {
    //     if (data) {
    //       Emitter.emit('errorLog', data.message)
    //       Emitter.emit('resetPlayerMenu');
    //     }
    //   }),

    //   SocketInstance.on("connect_error", (err) => {
    //     console.log(`connect_error due to ${err.message}`);
    //   });
    
      // const roomId = this.cookies.get('roomId')
      // if(roomId != null){
      //   SocketInstance.emit('forceGameUpdate', {})
      //   Emitter.emit("joinGame");
      // }
  },

  methods: {
    isCurrentUserTurn(): boolean {
      return this.playerId === this.gameStore.getTurnPlayerId();
    },
    resetRoomLayout(){
      this.data_ready = false;
      this.isGameOver = false;
      this.authStore.reset();
      this.roomStore.reset();
      Emitter.emit('restart');
    }

  },
  computed: {
    userId(): string {
      return this.authStore.userId;
    },
    playerId(): string {
      return this.authStore.playerId;
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.room-layout {
  position: absolute;
  width: 100%;
  top: 6%;
  height: 88%;
  min-height: 88%;
}

.overlay-column {
  z-index: 1000;
}

.custom-row {
  height: 100%;
}

.center-col {
  height: 100%;
}

.side-col {
  flex: 0 0 15%;
  /* Each column takes 15% of the row's width */
  max-width: 15%;
  height: 100%
}

.full-height-container {
  position: absolute;
  height: 100%;
}

.chat-layout-wrapper {
  position: relative;
  height: 60%;
}

.player-action-layout {
  position: relative;
  height: 40%;
}

.user-layout-column {
  height: 60%;
  width: 100%;
}

.logger-layout-column {
  height: 40%;
  width: 100%;
}

</style>
