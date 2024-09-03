<template>
  <div class="wizard-piece col cells" style="padding: 0;" v-if="data_ready" v-on:click="sageSelected()">
    <img class="boxMarker" :src="getBoxMarkerImage()">
    <div v-if="playerNumber == currentPlayer" class="wizard-shadow shinning-fade"></div>
    <img class="pieces wizard-image" :src="getWizardImage()" tabindex="-1">


  </div>
</template>

<script lang="ts">
import { SageModel } from '@/game/models/pieces/sage';
import { Emitter } from '@/main';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'WizardPieceComponent',
  props: {
    piece: SageModel,
    playerNumber: Number,
    currentPlayer: Number,
  },
  data() {
    return {
      data_ready: false,
      selected: false,
    }
  },
  mounted() {
    this.data_ready = true;
  },
  methods: {
    getBoxMarkerImage(): string {
      return require('@/assets/icons/boxMarker.png');
    },
    getWizardImage(): any {
      switch (this.playerNumber) {
        case 0:
          return require('@/assets/wizards/RockWizardMiniature.png');
        case 1:
          return require('@/assets/wizards/FireWizardMiniature.png');
        case 2:
          return require('@/assets/wizards/WaterWizardMiniature.png');
        case 3:
          return require('@/assets/wizards/WindWizardMiniature.png');
      }
    },
    sageSelected(): void {
      if(this.playerNumber == this.currentPlayer){
        if(this.selected){
          this.selected = false;
          Emitter.emit('sageUnselected');
        }else {
          this.selected = true;
          Emitter.emit('sageSelectedPosition', this.piece?.position);
        }
      }
    }
    
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.cells {
  position: relative;
  width: 100%;
  max-height: 100%;
  text-align: center;
  position: relative;
  aspect-ratio: 1/1;
}
.wizard-shadow {
  background-color: yellow;
  border-radius: 20px;
  width: 100%;
  height: 100%;
  z-index: 0;
}
.pieces {
  position: relative;
  box-sizing: border-box;
  /* max-width: 100%; */
  width: 100%;
  z-index: 2;
  position: absolute;
  bottom: 0%;
  left: 0%;
}

.wizard-image {
  position: absolute;
  max-height: 120%;
  max-width: 100%;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

.shinning-fade { animation: fadeIn 2s; animation-iteration-count: infinite; }
@keyframes fadeIn {
  0% { opacity: 0; }
  50% { opacity: .5; }
  100% { opacity: 0; }
}

.boxMarker {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  z-index: 3;
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
