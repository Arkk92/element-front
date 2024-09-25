<template>
  <div class="room-container">
    <Background/>
    <div v-if="data_ready" class="room-layout">
  
      <div class="container-fluid full-height-container">
        <div class="row custom-row">
          <div class="col side-col overlay-column">
            <UserLayout class="user-layout-column" :user-list="roomData.user_list" :turn-user-id="getTurnUserId()"
              :turn="roomData.game.turn" :user-to-player-map="roomData.user_to_player_map"
              :player-list="roomData.game.player_list" />
            <Logger class="logger-layout-column" />
          </div>
          <div class="col center-col overlay-column d-flex justify-content-center align-items-center">
            <GameLayout :game="roomData.game" :is-user-turn="isCurrentUserTurn()"
              :current-player-id="getPlayerIdByUserId(getUserId())" :room-id="roomData.uuid"></GameLayout>
          </div>
          <div class="col side-col overlay-column">
            <div class="chat-layout-wrapper">
  
              <ChatLayout :room-id="roomData.uuid"></ChatLayout>
            </div>
            <div class="player-action-layout">
  
              <PlayerActionsLayout v-if="isCurrentUserTurn()" :element-pool-manager="roomData.game.board.elementPool"
                :turn="roomData.game.turn" :room-id="roomData.uuid" :player="getPlayerIdByUserId(getUserId())">
              </PlayerActionsLayout>
  
            </div>
          </div>
          <WinnerLayout v-if="isGameOver" :current-user="getUserId()" :room="roomData" :winner="winner"></WinnerLayout>
        </div>
      </div>
  
    </div>
    <div class="room-layout" v-else>
      <MainMenu/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useCookies } from "vue3-cookies";
import { Emitter, SocketInstance } from '@/main';
import { RoomModel, RoomModelMap } from '@/game/models/room';
import UserLayout from './UserLayout.vue';
import GameLayout from './gameLayout.vue';
import ChatLayout from './chatLayout.vue';
import WinnerLayout from './WinnerLayout.vue';
import PlayerActionsLayout from './playerActionsLayout.vue';
import Logger from '@/composables/Logger.vue';
import Background from '@/components/Background.vue';
import MainMenu from '@/composables/MainMenu/MainMenu.vue';

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
    return { cookies };
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

    SocketInstance.on("gameUpdate", (data) => {
      // console.log("Game update: ")
      // console.log(data)

      if (data != null) {
        room = new RoomModelMap().toDomain(data.room);
        this.roomData = room;
        this.turn_player_uuid = data.player_turn_uuid;

        if (data.winner != null) {
          this.isGameOver = true;
          this.winner = data.winner!
          setTimeout(() => {
            this.cookies.remove('roomId');
            this.cookies.remove('userId');
          }, 2000);

        }
        this.data_ready = true;


      }
    }),
      SocketInstance.on('error', async (data) => {
        if (data) {
          Emitter.emit('errorLog', data.message)
          Emitter.emit('resetPlayerMenu');
        }
      }),

      SocketInstance.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
      });

  },

  methods: {
    getUserId(): string {
      return this.cookies.get("userId");
    },
    getTurnUserId(): string {

      for (let user of this.roomData.user_to_player_map) {
        if (user.player_uuid == this.turn_player_uuid) {
          return user.user_uuid;
        }
      }
      return "";
    },
    isCurrentUserTurn(): boolean {
      return this.getUserId() === this.getTurnUserId();
    },
    getPlayerIdByUserId(userId: string): string {
      for (let user of this.roomData.user_to_player_map) {
        if (userId === user.user_uuid) {
          return user.player_uuid;
        }
      }
      return ""
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
