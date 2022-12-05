<template>
  <div class="room-layout">
    <button v-on:click="forceUpdateRoom()">Actualizar</button>
    <div class="row">
      <div class="col">
        USER NAV BAR
      </div>
      <div class="col">
        <Board v-if="data_ready"
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

export default defineComponent({
  name: 'RoomLayout',
  components: {
    Board
},
  data() {
    return {
      username: "Username",
      data_ready: false,
      roomData: new RoomModel(0),
    }
  },
  mounted() {
    SocketInstance.on("gameUpdate", (data) => {
      console.log(data)

      if(data != null){
        const room: RoomModel = new RoomModelMap().toDomain(data.room);
        Object.assign(this.roomData, room);
  
        this.data_ready = true;
      }
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
