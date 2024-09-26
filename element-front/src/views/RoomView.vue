<template>
  <div class="room">
    <RoomLayout />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import RoomLayout from '@/layouts/room/RoomLayout.vue';

export default defineComponent({
  name: 'RoomView',
  components: {
    RoomLayout
},
  data() {
    return {
    }
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.room {
  display: inline-block;
  overflow: hidden;
  position: fixed;
  top: 0%;
  width: 100vw;
  height: 100vh;
  /* min-height: calc(100vh - 120px); 
  max-height: calc(100vh - 120px);  */
}
</style>
