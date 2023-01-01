<template>
  <div class="empty-piece border border-dark border-1 cells" style="padding: 0;" v-if="data_ready">
    <div class="cells" :class="getEmptyType()" v-on:click="emptySelected()">
      
    </div>

    <!-- <img class="empty" :src="getImage()"> -->

  </div>
</template>

<script lang="ts">
import { MovementManager } from '@/game/controllers/movement_manager';
import { GridModel } from '@/game/models/grid';
import { EmptyModel } from '@/game/models/pieces/empty';
import { Position, PositionUtils } from '@/game/utils/position_utils';
import { Emitter } from '@/main';
import { defineComponent } from 'vue';

type EmptyType = 'None' | 'Red' | 'Blue'

export default defineComponent({
  name: 'EmptyPieceComponent',
  props: {
    piece: EmptyModel,
    grid: GridModel,
  },
  data() {
    return {
      data_ready: false,
      state: 'None' as EmptyType
    }
  },
  mounted() {
    this.data_ready = true;

    Emitter.on('sageSelectedPosition', (position) => {
      if(MovementManager.isSageMoveValid(this.grid!, position as Position, this.piece!.position)){
        this.state = 'Red';
      }
    });

    Emitter.on('sageUnselected', () => {
      this.state = this.state == 'Red' ? 'None' : this.state;
    });

    Emitter.on('oldRiverDisplay', (river) => {
      if ((river as Array<Position>).filter(water => PositionUtils.isSamePosition(water, this.piece!.position)).length > 0) {
        this.state = 'Blue';
      }
    });

    Emitter.on('oldRiverDisplayOff', () => {
      this.state = this.state == 'Blue' ? 'None' : this.state;
    });

  },
  methods: {
    getImage(): any {
      return require('@/assets/pieces/Empty.png');
    },
    emptySelected(): void {
      if(this.state == 'Red'){
        Emitter.emit('sagePositionDestination', this.piece!.position )
      }
    },
    getEmptyType(): string {
      let cssClass: string;
      switch(this.state){
        case 'Blue':
          cssClass = 'oldRiver';
          break;
        case 'Red':
          cssClass = 'moveAvailable';
          break;
        default:
          cssClass = '';
          break;
      }
      return cssClass;
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

.oldRiver {
  background-color: blue;
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
