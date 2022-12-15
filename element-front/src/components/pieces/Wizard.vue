<template>
  <div class="wizard-piece col border border-dark border-1 cells" style="padding: 0;" v-if="data_ready">

    <img class="pieces" :src="getImage()">

  </div>
</template>

<script lang="ts">
import { EmptyModel } from '@/game/models/pieces/empty';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'WizardPieceComponent',
  props: {
    piece: EmptyModel,
    playerNumber: Number,
  },
  data() {
    return {
      data_ready: false,

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
</style>
