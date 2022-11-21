<template>
  <div class="board">
    <table>
      <tr v-for="row in grid?.getHeight()">
        <td v-for="column in grid?.getWidth()">
          <PieceVue>
            string_representation="{{grid?.getGridCellByPosition({row: row, column: column}).string_representation}}"
          </PieceVue>
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import Grid from "@/models/grid";
import { defineComponent } from "vue";
import ElementPoolManager from "@/models/element_pool_manager"
import PieceVue from "./Piece.vue";

export default defineComponent({
  name: 'Board',
  components: {
    PieceVue
  },
  props: {
    grid: Grid,
    element_pool: ElementPoolManager    
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
