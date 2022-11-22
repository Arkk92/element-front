<template>
  <div class="room">
    <table v-if="data_ready">
      <tr v-for="row in grid!.cells" :key="row">
        <td v-for="cell in row" :key="cell" width="20px">
          {{cell.string_representation}}
        </td>
      </tr>
    </table>    
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BoardConmponent',
  props: {
    board: Object
  },
  data() {
    return {
      grid: null,
      data_ready: false,
      
    }
  },
  mounted(){
    this.grid = this.board!.grid;

    this.data_ready = true;
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
