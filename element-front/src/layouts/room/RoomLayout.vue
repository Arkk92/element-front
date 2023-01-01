<template>
  <div class="alert alert-danger" role="alert" v-show="showingError">
    {{ error }}
  </div>

  <div class="room-layout">
    <div class="row" v-if="data_ready">
      <div class="col-md-3">
        <UserLayout :user-list="roomData.user_list" :current-user-id="getUserId()" :turn-user-id="getTurnUserId()"
          :turn="roomData.game.turn" :user-to-player-map="roomData.user_to_player_map" :player-list="roomData.game.player_list" />
      </div>
      <div class="col">
        <GameLayout :game="roomData.game" :is-user-turn="isCurrentUserTurn()"
          :current-player-id="getPlayerIdByUserId(getUserId())" :room-id="roomData.uuid"></GameLayout>
      </div>
      <div class="col">
        <ChatLayout :room-id="roomData.uuid"></ChatLayout>
      </div>
      <WinnerLayout v-if="isGameOver" :current-user="getUserId()" :room="roomData" :winner="winner"></WinnerLayout>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { SocketInstance } from '@/main';
import { RoomModel, RoomModelMap } from '@/game/models/room';
import UserLayout from './UserLayout.vue';
import GameLayout from './gameLayout.vue';
import ChatLayout from './chatLayout.vue';
import WinnerLayout from './WinnerLayout.vue';


let room: RoomModel;

export default defineComponent({
  name: 'RoomLayout',
  components: {
    UserLayout,
    GameLayout,
    ChatLayout,
    WinnerLayout
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
      /*console.log("Game update: ")
      console.log(data)*/

      if (data != null) {
        room = new RoomModelMap().toDomain(data.room);
        this.roomData = room;
        this.turn_player_uuid = data.player_turn_uuid;
        if (data.winner != null) {
          this.isGameOver = true;
          this.winner = data.winner!
        }
        this.data_ready = true;


      }
    }),
      SocketInstance.on('error', async (data) => {
        console.log(data);
        if (data) {
          this.error = data.message as string;
          this.showingError = true;
        }
        setTimeout(() => {
          this.error = "";
          this.showingError = false;
        }, 5000)
      })

  },

  methods: {
    getUserId(): string {
      for (let user of this.roomData.user_list) {
        if (user.socket_id === SocketInstance.id) {
          return user.uuid;
        }
      }
      return "";
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

</style>
