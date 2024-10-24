<template>
  <div class="board">
    <div class="custom-row" v-for="row in gridCells" :key="row as any">
      <Cell :position="cell.position" v-for="cell in row" :key="cell as any" />
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { usePieceStore } from '@/presentation/stores/piece';
import { useRoomStore } from '../stores/room';
import Cell from './Cell.vue';


export default defineComponent({
  name: 'BoardComponent',
  components: {
    Cell
  },
  setup() {
    const pieceStore = usePieceStore();
    const roomStore = useRoomStore();
    return { pieceStore, roomStore }
  },
  computed: {
    gridCells() {
      return this.roomStore.model.game.board.grid.cells;
    }
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.custom-row {
  position: relative;
  display: flex;
  height: calc(100%/11);
  width: 100%;
}

.board {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
