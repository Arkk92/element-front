<template>
  <div class="empty-piece cells" style="padding: 0;" v-if="data_ready">
    <div class="cells" :class="getEmptyType()" 
    v-on:touchstart="onPressingCell()"
    v-on:touchend="emptySelected()"
    v-on:touchcancel="cancelPressingCell()"
    v-on:mousedown="onPressingCell()"
    v-on:mouseup="emptySelected()"
    v-on:mouseleave="cancelPressingCell()"
    >
      <img class="boxMarker" :src="getImage()">
    </div>
  </div>
</template>

<script lang="ts">
import { MovementManager } from '@/domain/game/controllers/movement_manager';
import { EmptyModel } from '@/domain/game/models/pieces/empty';
import { Position, PositionUtils } from '@/domain/game/utils/position_utils';
import { defineComponent } from 'vue';

import { usePlayerActionStore } from '@/presentation/stores/playerAction';
import { useRiverStore } from '@/presentation/stores/river';
import { useRoomStore } from '@/presentation/stores/room';
import boxMarkerImageUrl from '/assets/boxMarker.png';
import { usePieceStore } from '@/presentation/stores/piece';

type EmptyType = 'None' | 'Red' | 'Blue' | 'Yellow'

export default defineComponent({
  name: 'EmptyPieceComponent',
  props: {
    piece: EmptyModel,
  },
  setup() {
    const playerActionStore = usePlayerActionStore();
    const roomStore = useRoomStore();
    const riverStore = useRiverStore();
    const pieceStore = usePieceStore();
    return {
      playerActionStore, roomStore, riverStore, pieceStore
    }
  },
  data() {
    return {
      data_ready: false,
    }
  },
  computed: {
    state(): EmptyType {
      if (this.playerActionStore.isWizardSelected() && this.isAllowedToMoveOn) {
        return 'Red'
      }
      if (this.isPartOfOldRiver) {
        return 'Red';
      }
      if (this.isAllowedToBuildRiver) {
        return 'Yellow'
      }
      if(this.isNextToClickedPosition){
        return 'Yellow'
      }
      return 'None'
    },
    isAllowedToMoveOn(): boolean {
      if(this.playerActionStore.wizardPosition && this.piece){
        return MovementManager.isSageMoveValid(this.roomStore.model.game.board.grid, this.playerActionStore.wizardPosition, this.piece.position);
      }
      return false;
    },
    isPartOfOldRiver(): boolean {
      if(this.riverStore.state!=='PlacingNewRiver') return false;
      return (this.riverStore.model.oldRiver as Array<Position>).filter(water => PositionUtils.isSamePosition(water, this.piece!.position)).length > 0
    },
    isAllowedToBuildRiver(): boolean {
      if(this.riverStore.state!=='PlacingNewRiver') return false;
      return PositionUtils.isStrictOrthogonalPosition(this.riverStore.model.lastWaterPlaced, this.piece!.position);
    },
    isNextToClickedPosition(): boolean {
      if(this.pieceStore.currentClickedPosition==null) return false;
      return PositionUtils.isStrictOrthogonalPosition(this.piece!.position, this.pieceStore.currentClickedPosition);
    }
  },
  mounted() {
    this.data_ready = true;
  },
  methods: {
    getImage(): any {
      return boxMarkerImageUrl;
    },
    emptySelected(): void {
      this.cancelPressingCell();
      this.$emit('clicked', this.piece);
    },
    getEmptyType(): string {
      const stateToCssClassMap = {
        'None': '',
        'Blue': 'moveAvailable',
        'Red': 'oldRiver',
        'Yellow': 'availableCell'
      }
      return stateToCssClassMap[this.state]
    },
    onPressingCell(){
      this.pieceStore.onCurrentClickedPosition(this.piece!.position);
    },
    cancelPressingCell(){
      this.pieceStore.onCurrentClickedPosition(null)
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
  user-select: none;
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
