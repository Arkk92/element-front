<template>
  <div class="board-layout">
    <div class="row">
      <div class="col">
        <div class="row align-items-center">
          <div class="col">
            Fire:
          </div>
          <div class="col-3">
            <div class="circle fire"></div>
          </div>
          <div class="col">
            x{{ board?.elementPool.fire.amount }}
          </div>
        </div>
      </div>
      <div class="col">
        <div class="row align-items-center">
          <div class="col">
            Water:
          </div>
          <div class="col-3">
            <div class="circle water"></div>
          </div>
          <div class="col">
            x{{ board?.elementPool.water.amount }}
          </div>
        </div>
      </div>
      <div class="col">
        <div class="row align-items-center">
          <div class="col">
            Earth:
          </div>
          <div class="col-3">
            <div class="circle earth"></div>
          </div>
          <div class="col">
            x{{ board?.elementPool.earth.amount }}
          </div>
        </div>
      </div>
      <div class="col">
        <div class="row align-items-center">
          <div class="col">
            Wind:
          </div>
          <div class="col-3">
            <div class="circle wind"></div>
          </div>
          <div class="col">
            x{{ board?.elementPool.wind.amount }}
          </div>
        </div>
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
  props: {
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
.circle {
  width: 20px;
  height: 20px;
  -webkit-border-radius: 25px;
  -moz-border-radius: 25px;
  border: solid;
  border-width: 1px;
  border-radius: 25px;
  text-align: center;
}

.fire {
  background: red;
}

.wind {
  background: white;
}

.water {
  background: blue;
}

.earth {
  background: brown;
}
</style>
