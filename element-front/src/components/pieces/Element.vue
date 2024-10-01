<template>
  <div class="element">
    <div class="element-piece col cells" style="padding: 0;" v-if="data_ready" :class="getCssClass()" v-on:click="clicked">
      <img class="boxMarker" :src="getBoxMarkerImage()">
      <img class="pieces" :src="getImage()" style="opacity: 100%;" :class="state == 'RiverHead' ? 'river-head' : ''">
      <span v-if="isWind()" class="wind-counter">
        {{ (piece as any).stacked_winds }}
      </span>
      <div v-if="showOverlay" class="river-head-overlay">
        <!-- Cancel Button (Top Left) -->
        <button class="overlay-button cancel" @click.stop="handleRiverHeadAction('Cancel')">
          ❌
        </button>

        <!-- Undo Button (Top Right) -->
        <button class="overlay-button undo" @click.stop="handleRiverHeadAction('Undo')">
          ⏪
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ElementModel, ElementTypes } from '@/game/models/elements/elements';
import { defineComponent } from 'vue';
import type { PropType } from 'vue'
import { EarthModel } from '@/game/models/elements/earth';
import { Emitter } from '@/main';
import { Position, PositionUtils } from '@/game/utils/position_utils';
import { River } from '../PlayerMenu/types';

import boxMarkerImageUrl from '/assets/boxMarker.png'
import fireImageUrl from '/assets/Fire.png'
import waterImageUrl from '/assets/Water.png'
import mountainImageUrl from '/assets/Mountain.png'
import earthImageUrl from '/assets/Earth.png'
import windImageUrl from '/assets/Wind.png'

type WaterType = 'RiverHead' | 'River';
type ElementFrontType = 'None' | WaterType | 'ReplaceableFire';

export default defineComponent({
  name: 'ElementPieceComponent',
  data() {
    return {
      data_ready: false,
      state: 'None' as ElementFrontType,
      showOverlay: false,
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
        this.state = 'RiverHead'
      }
    })

    Emitter.on('NewRiverAvailablePlacement', (position) => {
      if (this.piece!.element_type == ElementTypes.Fire) {
        if (PositionUtils.isStrictOrthogonalPosition(this.piece!.position, position as Position)) {
          this.state = 'ReplaceableFire';
        } else {
          this.state = 'None';
        }
      }
      this.showOverlay = PositionUtils.isSamePosition(this.piece!.position, position as Position);
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
      return boxMarkerImageUrl
    },
    getImage(): any {
      switch (this.piece?.element_type) {
        case ElementTypes.Fire:
          return fireImageUrl
        case ElementTypes.Water:
          return waterImageUrl
        case ElementTypes.Earth:
          if ((this.piece! as EarthModel).is_mountain || (this.piece! as EarthModel).is_range) {
            return mountainImageUrl
          }
          return earthImageUrl
        case ElementTypes.Wind:
          return windImageUrl
      }
    },
    isWind(): boolean {
      return this.piece?.element_type == ElementTypes.Wind
    },
    isWater(): boolean {
      return this.piece?.element_type == ElementTypes.Water
    },

    getCssClass(): string {
      let cssClass: string;
      switch (this.state) {
        case 'River':
          cssClass = 'moveAvailable';
          break;
        case 'ReplaceableFire':
          cssClass = 'replaceable-fire';
          break;
        default:
          cssClass = '';
          break;
      }
      return cssClass;
    },
    handleRiverHeadAction(action: string) {
      Emitter.emit(`river${action}`);
    },
    clicked(){
      this.$emit('clicked', this.piece);
    }
  },
})
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.cells {
  width: 100%;
  text-align: center;
  position: relative;
  aspect-ratio: 1/1;

}

.river-head {
  opacity: 0.5 !important;
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
  font-size: 2.5rem;
  -webkit-text-stroke: 1px black;
  cursor: default;
  z-index: 5;

}

.moveAvailable {
  background-color: rgb(168, 168, 44);
}

.replaceable-fire {
  background-color: rgba(255, 255, 0, 0.2);
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
    background-color: rgb(255, 255, 0, 0.2);
  }

  50% {
    background-color: rgb(255, 255, 0, .6);
  }

  100% {
    background-color: rgb(255, 255, 0, 0.2);
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

.river-head-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 11;
  opacity: 1;
}

.overlay-button {
  position: absolute;
  width: 45%;
  font-size: 1rem;
  font-weight: bold;
  border: 2px solid #ff7043;
  border-radius: 8px;
  background-color: #29293a;
  color: white;
  cursor: pointer;
  text-shadow: 0 0 5px #fff, 0 0 10px #ff5722;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.overlay-button:hover {
  transform: scale(1.05);
}

.cancel {
  top: 0;
  left: 0;
  text-shadow: 0 0 5px #ff3a3a, 0 0 10px #ff0000;
  box-shadow: 0 0 10px #ff0000, 0 0 15px #ff3a3a;
}

.undo {
  top: 0;
  right: 0;
  text-shadow: 0 0 5px #3a9df2, 0 0 10px #007bff;
  box-shadow: 0 0 10px #007bff, 0 0 15px #3a9df2;
}

.overlay-button:active {
  transform: scale(0.95);
}

@media screen and (max-width: 785px) {
  .wind-counter {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    font-weight: bold;
    color: yellow;
    font-size: 1rem;
    -webkit-text-stroke: 1px black;
    cursor: default;
    z-index: 5;

  }

  .overlay-button {
    position: absolute;
    width: 45%;
    font-size: 1rem;
    font-weight: bold;
    border: 2px solid #ff7043;
    border-radius: 8px;
    background-color: #29293a;
    color: white;
    cursor: pointer;
    text-shadow: 0 0 5px #fff, 0 0 10px #ff5722;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
    transition: all 0.3s ease;
  }
}
</style>
