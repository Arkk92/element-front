<template>
  <div class="room">
    <table class="table align-middle" v-if="data_ready">
      <tr v-for="row in grid!.cells" :key="row">
        <td v-for="cell in row" :key="cell" width="20px">
          <div :class="cell.string_representation == 'S' ? 'piece' : ''">
            {{ cell.string_representation }}
          </div>

        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { BoardModel } from '@/game/models/board';
import { GridModel } from '@/game/models/grid';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BoardComponent',
  props: {
    board: BoardModel,
  },
  data() {
    return {
      grid: new GridModel(),
      data_ready: false,

    }
  },
  mounted() {
    this.grid = this.board!.grid;

    this.data_ready = true;
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.piece {
  height: 75%;
  width: 75%;
  background-color: rgb(136, 150, 56);
  border-radius: 50%;
  display: inline-block;
}

table, th, td {
  border: 1px solid;
  border-color: black;
  text-align: center;
}

table {
  width: 100%;
}
</style>
