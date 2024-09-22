<template>
  <div class="board-layout">
    <div class="board-background-image-wrapper">
      <GameBoard
      :board="board"
      :current-player="currentPlayer"
      :players="players"
      />
    </div>
    <div class="legend-layout">
      <Legend
      :board="board"
      />
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { BoardModel } from '@/game/models/board';
import Legend from '@/composables/Legend.vue';
import GameBoard from '@/composables/GameBoard.vue';

export default defineComponent({
  name: 'GameLayout',
  components: {
    GameBoard,
    Legend
  },
  props: {
    board: BoardModel,
    players: Array,
    currentPlayer: Number,
  },
  data() {
    return {
    }
  }
  
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.board-layout {
  height: 100%;
  width: 100%;
  z-index: 1001;
}
.legend-layout {
  position: absolute;
  max-width: 6%;
  width: 100%;
  height: 40%;
  bottom: 0;
  right: 0;
  z-index: 2;
}
.board-background-image-wrapper {
  position: relative;
  height: 100%;
  max-width: 94%;
  top: 0px;
  z-index: 1;
}

</style>
