<template>
  <div class="empty-piece cells" style="padding: 0;" v-if="data_ready">
    <div class="cells" :class="getEmptyType()" v-on:click="emptySelected()">
      <img class="boxMarker" :src="getImage()">
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

type EmptyType = 'None' | 'Red' | 'Blue' | 'Yellow'

export default defineComponent({
  name: 'EmptyPieceComponent',
  props: {
    piece: EmptyModel,
    grid: GridModel,
  },
  data() {
    return {
      data_ready: false,
      state: 'None' as EmptyType,
    }
  },
  mounted() {
    this.data_ready = true;

    Emitter.on('sageSelectedPosition', (position) => {
      if (MovementManager.isSageMoveValid(this.grid!, position as Position, this.piece!.position)) {
        this.state = 'Red';
      }
    });

    Emitter.on('sageUnselected', () => {
      this.state = this.state == 'Red' ? 'None' : this.state;
    });

    Emitter.on('oldRiverDisplay', (river) => {
      if ((river as Array<Position>).filter(water => PositionUtils.isSamePosition(water, this.piece!.position)).length > 0) {
        this.state = 'Red';
      }
    });

    Emitter.on('NewRiverAvailablePlacement', (position) => {
      if((PositionUtils.isStrictOrthogonalPosition(this.piece!.position, position as Position)&&(this.state == 'None'))){
        this.state = 'Yellow';
      } else{
        this.state = this.state == 'Yellow' ? 'None' : this.state;
      }
    });

  },
  methods: {
    getImage(): any {
      return require('@/assets/icons/boxMarker.png');
    },
    emptySelected(): void {
      if (this.state == 'Red') {
        this.$nextTick(()=>{
          Emitter.emit('sagePositionDestination', this.piece!.position)
        })
      }
    },
    getEmptyType(): string {
      let cssClass: string;
      switch (this.state) {
        case 'Blue':
          cssClass = 'moveAvailable';
          break;
        case 'Red':
          cssClass = 'oldRiver';
          break;
        case 'Yellow':
          cssClass = 'availableCell';
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
  height: 100%;
  text-align: center;
  position: relative;
  aspect-ratio: 1/1;

}

.oldRiver {
  background-color: rgba(255, 0, 0, 0.2);
}

.moveAvailable {
  background-color: rgba(76, 0, 255, 0.2);
}

.availableCell {
  background-color: rgba(255, 255, 0, 0.2);
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
.boxMarker {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
}

.boxMarker:hover {
  /* background-color: yellow; */
  opacity: 1;
  animation: hoverResizing 1s;
  animation-iteration-count: infinite;
  
}

.boxMarker:active {
  opacity: 1;
  animation: hoverResizing 1s;
  animation-iteration-count: infinite;

}

@keyframes hoverResizing {
  0% {
    width: 100%;
    height: 100%;
  }
  50% {
    width: 70%;
    height: 70%;
  }
  100% {
    width: 100%;
    height: 100%;
  }
}
</style>
