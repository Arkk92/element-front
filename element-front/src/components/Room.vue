<template>
  <div class="room">
    <a v-on:click="forceUpdateRoom()">Actualizar!!!</a>
    {{board}}
  </div>
</template>

<script lang="ts">
//import Board from '@/models/board';
import { defineComponent } from 'vue';
//import BoardVue from './Board.vue';
import ClientSocket from '@/sockets/client'
//import Room from '@/models/room';

const socket = ClientSocket.setupSocketConnection();

export default defineComponent({
  name: 'RoomComponent',
  components: {
    //BoardVue
  },
  data() {
    return {
      board: ""
    }
  },
  mounted(){
    const socket = ClientSocket.setupSocketConnection();

    socket.on("gameUpdate", (data) => {
      console.log(data)
      this.board = data
    })
  },
  methods: {
    forceUpdateRoom(): void {
      alert("Foece update game!!")
      socket.emit('forceGameUpdate');
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
