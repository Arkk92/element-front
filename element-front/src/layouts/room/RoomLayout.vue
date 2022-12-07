<template>
  <div class="room-layout">
    <button v-on:click="forceUpdateRoom()">Actualizar</button>
    <div class="row" v-if="data_ready">
      <div class="col-md-3">
        <UserLayout :user-list="roomData.user_list" :current-user-id="getUserId()" :turn-user-id="getTurnUserId()"
          :turn="roomData.game.turn" />
      </div>
      <div class="col">
        <Board :board="roomData.game.board">
        </Board>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { SocketInstance } from '@/main';
import { RoomModel, RoomModelMap } from '@/game/models/room';
import Board from '@/components/Board.vue';
import UserLayout from '../UserLayout.vue';


let room: RoomModel;

export default defineComponent({
  name: 'RoomLayout',
  components: {
    Board,
    UserLayout
  },
  data() {
    return {
      username: "Username",
      data_ready: false,
      roomData: room,
      turn_player_uuid: "",
    }
  },
  mounted() {
    SocketInstance.on("gameUpdate", (data) => {
      console.log("Game update: ")
      console.log(data)

      if (data != null) {
        room = new RoomModelMap().toDomain(data.room);
        this.roomData = room;
        this.turn_player_uuid = data.player_turn_uuid;
        this.data_ready = true;
      }
    }),
      SocketInstance.on('error', (data) => {
        console.log(data);
      })

  },

  methods: {
    forceUpdateRoom(): void {
      SocketInstance.emit('joinRoom', 'test');
      SocketInstance.emit('forceGameUpdate', "room1");
    },
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
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
