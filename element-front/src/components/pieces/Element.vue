<template>
  <div class="element-piece col border border-dark border-1 cells" style="padding: 0;" v-if="data_ready"
  :class="getCssClass()" >

    <img class="pieces" :src="getImage()" style="opacity: 100%;">
    <span v-if="isWind()" class="bottom-left" style="z-index: 1000;">
      {{(piece as WindModel).stacked_winds}}
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

    Emitter.on('riverHighlight', (position) => {
      if(PositionUtils.isSamePosition(this.piece!.position, position as Position)){
        this.state = 'River';
      }
    })

    Emitter.on('riverHead', (position) => {
      if(PositionUtils.isSamePosition(this.piece!.position, position as Position)){
        this.state = 'RiverHead';
      }
    })
  },
  methods: {
    getImage(): any {
      switch (this.piece?.element_type) {
        case ElementTypes.Fire:
          return require('@/assets/elements/Fire.png');
        case ElementTypes.Water:
          return require('@/assets/elements/Water.png');
        case ElementTypes.Earth:
          if((this.piece! as EarthModel).is_mountain || (this.piece! as EarthModel).is_range){
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
      switch(this.state){
        case 'River':
          cssClass = 'moveAvailable';
          break;
        case 'RiverHead':
          cssClass = 'shinning-fade';
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

.bottom-left {
  position: absolute;
  bottom: -5px;
  left: 0px;
}
.moveAvailable {
  border-color: red !important;
  background-color: rgba(252, 146, 146, 0.959);
}

.riverHead {
  background-color: blue;
  opacity: 20%;
}

.shinning-fade { animation: fadeIn 2s; animation-iteration-count: infinite; }
@keyframes fadeIn {
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
}
</style>
