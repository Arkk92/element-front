<template>
  <div class="element-piece col border border-dark border-1 cells" style="padding: 0;" v-if="data_ready">

    <img class="pieces" :src="getImage()">

  </div>
</template>

<script lang="ts">
import { ElementModel, ElementTypes } from '@/game/models/elements/elements';
import { defineComponent } from 'vue';
import type { PropType } from 'vue'

export default defineComponent({
  name: 'ElementPieceComponent',
  data() {
    return {
      data_ready: false,
    }
  },
  props: {
    piece: Object as PropType<ElementModel>,
  },
  mounted() {
    this.data_ready = true;
  },
  methods: {
    getImage(): any {
      switch (this.piece?.element_type) {
        case ElementTypes.Fire:
          return require('@/assets/elements/Fire.png');
        case ElementTypes.Water:
          return require('@/assets/elements/Water.png');
        case ElementTypes.Earth:
          return require('@/assets/elements/Earth.png');
        case ElementTypes.Wind:
          return require('@/assets/elements/Wind.png');
      }
    }
  }
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
</style>
