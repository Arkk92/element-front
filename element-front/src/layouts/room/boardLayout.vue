<template>
  <div class="board-layout">
    <div class="row">
      <div class="col">
        Fire: x{{board?.elementPool.fire.amount}}
      </div>
      <div class="col">
        Water: x{{board?.elementPool.water.amount}}
      </div>
      <div class="col">
        Earth: x{{board?.elementPool.earth.amount}}
      </div>
      <div class="col">
        Wind: x{{board?.elementPool.wind.amount}}
      </div>
    </div>
    <div class="row">
      <Board :board="board">
        </Board>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { BoardModel } from '@/game/models/board';
import Board from '@/components/Board.vue';

export default defineComponent({
  name: 'GameLayout',
  components: {
    Board
},
  props : {
    board: BoardModel,
  },
  data() {
    return {
    }
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
