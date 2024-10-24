<template>
  <div class="element">
    <div class="element-piece col cells" style="padding: 0;" v-if="data_ready" :class="getCssClass()"
      v-on:click="clicked">
      <img class="boxMarker" :src="getBoxMarkerImage()">
      <img class="pieces" :src="getImage()" style="opacity: 100%;" :class="state == 'RiverHead' ? 'river-head' : ''">
      <span v-if="isWind" class="wind-counter">
        {{ (piece as any).stacked_winds }}
      </span>
      <div v-if="showOverlay" class="river-head-overlay">
        <!-- Cancel Button (Top Left) -->
        <button class="overlay-button cancel" @click.stop="handleCancelRiver()">
          ❌
        </button>

        <!-- Undo Button (Top Right) -->
        <button class="overlay-button undo" @click.stop="handleUndoRiver()">
          ⏪
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { EarthModel } from '@/domain/game/models/elements/earth';
import { ElementModel, ElementTypes } from '@/domain/game/models/elements/elements';
import { Position, PositionUtils } from '@/domain/game/utils/position_utils';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import { PieceModel } from '@/domain/game/models/pieces/pieces';
import { useRiverStore } from '@/presentation/stores/river';
import boxMarkerImageUrl from '/assets/boxMarker.png';
import earthImageUrl from '/assets/Earth.png';
import fireImageUrl from '/assets/Fire.png';
import mountainImageUrl from '/assets/Mountain.png';
import waterImageUrl from '/assets/Water.png';
import windImageUrl from '/assets/Wind.png';
import { usePieceStore } from '@/presentation/stores/piece';

type WaterType = 'RiverHead' | 'River' | 'RiverOrigin';
type ElementFrontType = 'None' | WaterType | 'ReplaceableFire' | 'NoSelectable';

export default defineComponent({
  name: 'ElementPieceComponent',
  data() {
    return {
      data_ready: false,
    }
  },
  setup() {
    const riverStore = useRiverStore();
    const pieceStore = usePieceStore();
    return {
      riverStore, pieceStore
    }
  },
  props: {
    piece: {
      type: Object as PropType<PieceModel>,
      required: true
    }
  },
  mounted() {
    this.data_ready = true;
  },
  computed: {
    state(): ElementFrontType {
      let state: ElementFrontType = 'None'
      if (this.isPartOfAvailableRivers) {
        state = 'River';
      }
      if (this.isRiverOrigin) {
        state = 'RiverOrigin'
      }
      if (this.isRiverHead) {
        state = 'RiverHead';
      }
      if (this.isFireReplaceableByRiver) {
        state = 'ReplaceableFire';
      }
      if(this.isNextToClickedPosition){
        state = 'NoSelectable';
      }
      return state
    },
    showOverlay(): boolean {
      if (this.riverStore.state === 'PlacingNewRiver') {
        return this.isRiverHead;
      }
      return false;
    },
    isPartOfAvailableRivers(): boolean {
      if (this.riverStore.state !== 'ShowingRiversAvailable') return false;
      const rivers = this.riverStore.availableRivers
      return rivers.some(river => river.some((water => PositionUtils.isSamePosition(this.piece.position, water as Position))));
    },
    isFireReplaceableByRiver(): boolean {
      if (this.riverStore.state !== 'PlacingNewRiver' || ((this.piece as ElementModel).element_type != ElementTypes.Fire)) {
        return false;
      }
      return PositionUtils.isStrictOrthogonalPosition(this.piece.position, this.riverStore.model.lastWaterPlaced);
    },
    isRiverHead(): boolean {
      if (this.riverStore.state !== 'PlacingNewRiver') return false;
      return PositionUtils.isSamePosition(this.piece.position, this.riverStore.model.lastWaterPlaced);
    },
    isRiverOrigin(): boolean {
      return PositionUtils.isSamePosition(this.piece.position, this.riverStore.model.placedWater.position);
    },
    isWind(): boolean {
      return (this.piece as ElementModel).element_type == ElementTypes.Wind
    },
    isWater(): boolean {
      return (this.piece as ElementModel).element_type == ElementTypes.Water
    },
    isNextToClickedPosition(): boolean {
      if(this.pieceStore.currentClickedPosition==null) return false;
      return PositionUtils.isStrictOrthogonalPosition(this.piece!.position, this.pieceStore.currentClickedPosition);
    }
  },
  methods: {
    getBoxMarkerImage(): string {
      return boxMarkerImageUrl
    },
    getImage(): any {
      switch ((this.piece as ElementModel).element_type) {
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


    getCssClass(): string {
      const stateToCssClass = {
        'River': 'moveAvailable',
        'ReplaceableFire': 'replaceable-fire',
        'RiverOrigin': 'river-origin',
        'NoSelectable': 'no-selectable'
      }
      return stateToCssClass[this.state];
    },
    handleUndoRiver() {
      this.riverStore.undoRiverSegment();
    },
    handleCancelRiver() {
      this.riverStore.cancelRiver();
    },
    clicked() {
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

.river-origin {
  opacity: 0.5 !important;
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

.no-selectable {
  background-color: rgba(255, 0, 0, 0.2);
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

@media screen and (max-width: 785px) , screen and (max-height: 400px) {
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
