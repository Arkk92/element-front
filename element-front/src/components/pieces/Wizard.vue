<template>
  <div class="wizard-piece col border border-dark border-1 cells" style="padding: 0;" v-if="data_ready">

    <img class="pieces shinning-fade" :src="getShine()" :style="currentWizardTurn==true ? 'visibility: visible' : 'visibility: hidden' ">
    <img class="pieces" :src="getImage()">


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
  },
  data() {
    return {
      data_ready: false,
      currentWizardTurn: false,
    }
  },
  mounted() {
    this.data_ready = true;

    Emitter.on('turnPlayerNumber', (playerNumber) => {
      this.updateCurrentWizard(playerNumber as number);
    });
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
      return require('@/assets/wizards/Wizard_shine.png')
    },
    updateCurrentWizard(playerNumber: number): void {
      console.log("update wizard!" + playerNumber)
      console.log("current wizard: "+this.playerNumber)
      if(playerNumber == this.playerNumber!){
        this.currentWizardTurn = true;
      }else{
        this.currentWizardTurn = false;
      }
      console.log("currentWizardTurn: "+ this.currentWizardTurn)
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
