<template>
  <div class="wizard-piece col border border-dark border-1 cells" style="padding: 0;" v-if="data_ready">

    <img v-if="playerNumber == currentPlayer" class="pieces shinning-fade" :src="getShine()">
    <img v-if="selected" class="pieces" :src="getSelectedShadow()">
    <img class="pieces" :src="getImage()" v-on:click="sageSelected()">


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
    getImage(): any {
      switch (this.playerNumber) {
        case 0:
          return require('@/assets/wizards/Wizard_1.png');
        case 1:
          return require('@/assets/wizards/Wizard_2.png');
        case 2:
          return require('@/assets/wizards/Wizard_3.png');
        case 3:
          return require('@/assets/wizards/Wizard_4.png');
      }
    },
    getShine(): any {
      return require('@/assets/wizards/Wizard_shine.png');
    },
    getSelectedShadow(): any {
      return require('@/assets/wizards/Wizard_selected.png');
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
  width: 100%;
  max-width: 64px;
  max-height: 64px;
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

.shinning-fade { animation: fadeIn 2s; animation-iteration-count: infinite; }
@keyframes fadeIn {
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
}
</style>
