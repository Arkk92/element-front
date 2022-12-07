<template>
  <div class="draw-button">
    <!-- Button trigger modal -->
    <button type="button" class="btn btn-primary" v-on:click="requestElements"> Draw Elemenets!!!
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { SocketInstance } from '@/main'
import { DrawElements } from '@/sockets/socketUtils';
import { ElementTypes } from '@/game/models/elements/elements';

export default defineComponent({
  name: 'DrawButton',
  components: {
  },
  props: {
    roomId: String,
  },
  data() {
    return {
      localRoomId: "",

    }
  },
  mounted() {

    if (this.roomId != null) {

      this.localRoomId = this.roomId;
    }

  },
  methods: {
    requestElements(): void {
      const elements: DrawElements = {
        roomId: this.localRoomId,
        elements: [ElementTypes.Fire, ElementTypes.Water],
      }
      console.log(elements);
      SocketInstance.emit('drawElements', elements)
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
