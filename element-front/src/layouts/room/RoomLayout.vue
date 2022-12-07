<template>
  <div class="room-layout">
    <button v-on:click="forceUpdateRoom()">Actualizar</button>
    <div class="row" v-if="data_ready">
      <div class="col-md-3">
        <UserLayout 
        :user-list="roomData.user_list"
        />
      </div>
      <div class="col-md-6">
        <Board
        :board="roomData.game.board"
        >
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
      roomData: room
    }
  },
  mounted() {
    SocketInstance.on("gameUpdate", (data) => {
      console.log("Game update: ")
      console.log(data)

      if(data != null){
        room = new RoomModelMap().toDomain(data.room);
        this.roomData = room;
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
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
