<template>
  <div class="player">
    <br>
    Player {{player_number}}:
    <button v-on:click="movePlayerSage()">Move Sage</button>
    <input v-model="sage_row" type="number">
    <input v-model="sage_column" type="number">
  </div>
</template>

<script lang="ts">
import { Socket } from 'socket.io-client';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PlayerConmponent',
  props: {
    player_number: Number,
    socket: Socket,
  },
  data() {
    return {
      sage_row: "",
      sage_column: "",
      
    }
  },
  methods: {
    movePlayerSage(): void {
      if(this.socket != undefined){
        this.socket.emit("movePlayerSage", 
          this.player_number, 
          this.sage_row, 
          this.sage_column
          );
      }
      
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
