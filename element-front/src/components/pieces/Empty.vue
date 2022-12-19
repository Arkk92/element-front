<template>
  <div class="empty-piece border border-dark border-1 cells" style="padding: 0;" v-if="data_ready">
    <div class="cells" :class="moveAvailable ? 'moveAvailable' : ''" v-on:click="emptySelected()">

    </div>

    <!-- <img class="empty" :src="getImage()"> -->

  </div>
</template>

<script lang="ts">
import { MovementManager } from '@/game/controllers/movement_manager';
import { GridModel } from '@/game/models/grid';
import { EmptyModel } from '@/game/models/pieces/empty';
import { Position } from '@/game/utils/position_utils';
import { Emitter } from '@/main';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EmptyPieceComponent',
  props: {
    piece: EmptyModel,
    grid: GridModel,
  },
  data() {
    return {
      data_ready: false,
      moveAvailable: false,
    }
  },
  mounted() {
    this.data_ready = true;

    Emitter.on('sageSelectedPosition', (position) => {
      this.moveAvailable = MovementManager.isSageMoveValid(this.grid!, position as Position, this.piece!.position);
    });

    Emitter.on('sageUnselected', () => {
      this.moveAvailable = false;
    });

  },
  methods: {
    getImage(): any {
      return require('@/assets/pieces/Empty.png');
    },
    emptySelected(): void {
      if(this.moveAvailable){
        Emitter.emit('sagePositionDestination', this.piece!.position )
      }
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.cells {
  width: 100%;
  max-width: 64px;
  max-height: 64px;
  text-align: center;
  position: relative;
  aspect-ratio: 1/1;

}
.moveAvailable {
  background-color: red;
  opacity: 20%;
}

.empty {
  box-sizing: border-box;
  max-width: 100%;
  width: 100%;
  z-index: 1;
  position: absolute;
  bottom: 0%;
  left: 0%;
}
</style>
