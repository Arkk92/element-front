<template>
  <div class="room">
    
    <button v-on:click="forceUpdateRoom()">Actualizar</button>
    <Player
      :player_number="1"
      :socket="socket"
    ></Player>
    <br>
    <Player
      :player_number="2"
    ></Player>
    

    <div v-if="data_ready == true">
      <BoardVue :board="game.board">
      </BoardVue>

      <br>
      Turn: Player {{game.turn_player.player_number +1}}, Status: 
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BoardVue from './Board.vue';
import ClientSocket from '@/sockets/client'
import Player from './Player.vue';

const socket = ClientSocket.setupSocketConnection();

export default defineComponent({
  name: 'RoomComponent',
  components: {
    BoardVue,
    Player
},
  data() {
    return {
      data_ready: false,
      uuid: "",
      game: null,
      user_map_list: new Map(),
      socket: socket

    }
  },
  mounted() {

    socket.on("gameUpdate", (data) => {
      console.log(data)

      this.uuid = data.room.uuid;
      this.game = data.room.game;
      this.user_map_list = data.room.user_map_list;

      console.log(this.game)

      this.data_ready = true;
    })
  },
  methods: {
    forceUpdateRoom(): void {
      socket.emit("joinRoom", "test");
      socket.emit('forceGameUpdate');
    },
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
