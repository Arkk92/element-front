<template>
  <div class="room">
    <BoardVue>
      grid="{{board?.getGrid()}}"
    </BoardVue>
  </div>
</template>

<script lang="ts">
import Board from '@/models/board';
import { defineComponent } from 'vue';
import BoardVue from './Board.vue';

export default defineComponent({
  name: 'Room',
  components: {
    BoardVue
  },
  props: {
    board: Board
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
