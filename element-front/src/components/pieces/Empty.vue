<template>
  <div class="empty-piece border border-dark border-1 cells" style="padding: 0;" v-if="data_ready">

    <!-- <img class="empty" :src="getImage()"> -->

  </div>
</template>

<script lang="ts">
import { EmptyModel } from '@/game/models/pieces/empty';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EmptyPieceComponent',
  props: {
    piece: EmptyModel
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
      return require('@/assets/pieces/Empty.png');
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

.empty {
  box-sizing: border-box;
  max-width: 100%;
  width: 100%;
  z-index: 1;
  position: absolute;
  bottom: 0%;
  left: 0%;
}
</style>
