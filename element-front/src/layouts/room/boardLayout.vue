<template>
  <div class="board-layout">
    <div class="row">
      <div class="col">

        <div class="row">
  
          <div class="col">
            <div class="row align-items-center">
              <div class="col element-div">
                <img class="element" :src="require('@/assets/elements/Fire.png')">
              </div>
              <div class="col">
                x{{ board?.elementPool.fire.amount }}
              </div>
            </div>
          </div>
          <div class="col">
            <div class="row align-items-center">
              <div class="col element-div">
                <img class="element" :src="require('@/assets/elements/Water.png')">
              </div>
              <div class="col">
                x{{ board?.elementPool.water.amount }}
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="row align-items-center">
              <div class="col element-div">
                <img class="element" :src="require('@/assets/elements/Earth.png')">
              </div>
              <div class="col">
                x{{ board?.elementPool.earth.amount }}
              </div>
            </div>
          </div>
          <div class="col">
            <div class="row align-items-center">
              <div class="col element-div">
                <img class="element" :src="require('@/assets/elements/Wind.png')">
              </div>
              <div class="col">
                x{{ board?.elementPool.wind.amount }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col">
        LEGEND!
      </div>
    </div>
    <div class="row">
      <Board :board="board" :players="players" :current-player="currentPlayer">
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
  props: {
    board: BoardModel,
    players: Array,
    currentPlayer: Number,
  },
  data() {
    return {
    }
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.element {
  height: 40px;
  width: 40px;
  border: solid;
  border-width: 1px;
  border-radius: 40px;
  vertical-align: middle;
  text-align: center;
}

.element-div {
  
}


</style>
