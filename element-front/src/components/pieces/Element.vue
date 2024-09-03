<template>
  <div class="element-piece col cells" style="padding: 0;" v-if="data_ready" :class="getCssClass()">
    <img class="boxMarker" :src="getBoxMarkerImage()">
    <img class="pieces" :src="getImage()" style="opacity: 100%;">
    <span v-if="isWind()" class="wind-counter">
      {{ (piece as WindModel).stacked_winds }}
    </span>

  </div>
</template>

<script lang="ts">
import { ElementModel, ElementTypes } from '@/game/models/elements/elements';
import { defineComponent } from 'vue';
import type { PropType } from 'vue'
import { WindModel } from '@/game/models/elements/wind';
import { EarthModel } from '@/game/models/elements/earth';
import { Emitter } from '@/main';
import { Position, PositionUtils } from '@/game/utils/position_utils';
import { River } from '../PlayerMenu/types';

type WaterType = 'RiverHead' | 'River'
type ElementFrontType = 'None' | WaterType

export default defineComponent({
  name: 'ElementPieceComponent',
  data() {
    return {
      data_ready: false,
      state: 'None' as ElementFrontType
    }
  },
  props: {
    piece: Object as PropType<ElementModel>,
  },
  mounted() {
    this.data_ready = true;

    Emitter.on('riverHighlight', (river) => {
      if ((river as River).some(water => PositionUtils.isSamePosition(this.piece!.position, water as Position))) {
        this.state = 'River';
      }
    })

    Emitter.on('riverHead', (position) => {
      if (PositionUtils.isSamePosition(this.piece!.position, position as Position)) {
        this.state = 'RiverHead';
      }
    })

    Emitter.on('oldRiverDisplay', (river) => {
      if (!(river as River).some(water => PositionUtils.isSamePosition(this.piece!.position, water as Position))) {
        this.state = 'None';
      }
    })

    Emitter.on('oldRiverDisplayOff', (river) => {
      if ((river as River).some(water => PositionUtils.isSamePosition(this.piece!.position, water as Position))) {
        this.state = 'None';
      }
    })
  },
  methods: {
    getBoxMarkerImage(): string {
      return require('@/assets/icons/boxMarker.png');
    },
    getImage(): any {
      switch (this.piece?.element_type) {
        case ElementTypes.Fire:
          return require('@/assets/elements/Fire.png');
        case ElementTypes.Water:
          return require('@/assets/elements/Water.png');
        case ElementTypes.Earth:
          if ((this.piece! as EarthModel).is_mountain || (this.piece! as EarthModel).is_range) {
            return require('@/assets/elements/Mountain.png');
          }
          return require('@/assets/elements/Earth.png');
        case ElementTypes.Wind:
          return require('@/assets/elements/Wind.png');
      }
    },
    isWind(): boolean {
      return this.piece?.element_type == ElementTypes.Wind
    },

    getCssClass(): string {
      let cssClass: string;
      switch (this.state) {
        case 'River':
          cssClass = 'moveAvailable';
          break;
        case 'RiverHead':
          cssClass = 'riverHead';
          break;
        default:
          cssClass = '';
          break;
      }
      return cssClass;
    }
  },
})
</script>

<script setup lang="ts">

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.cells {
  width: 100%;
  text-align: center;
  position: relative;
  aspect-ratio: 1/1;

}


.pieces {
  box-sizing: border-box;
  max-width: 100%;
  width: 100%;
  z-index: 1;
  position: absolute;
  bottom: 0%;
  left: 0%;
}

.wind-counter {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  font-weight: bold;
  color: yellow;
  font-size: 40px;
  -webkit-text-stroke: 1px black;
  cursor: default;
  z-index: 5;

}

.moveAvailable {
  background-color: rgb(168, 168, 44) ;
}

.riverHead {
  background-color: red;
  opacity: 20%;
}

.shinning-fade {
  animation: fadeIn 2s;
  animation-iteration-count: infinite;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

@keyframes availableFadeIn {
  0% {
    background-color: rgb(255, 255, 0, 0.2) ;
  }
  50% {
    background-color: rgb(255, 255, 0, .6) ;
  }
  100% {
    background-color: rgb(255, 255, 0, 0.2) ;
  }
}

.boxMarker {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  z-index: 10;
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
