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

</style>
