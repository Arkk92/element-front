<template>
  <div class="board" v-if="data_ready">
    <div class="row" v-for="row in board!.grid!.cells" :key="row">
      <div class="col cell-div" v-for="cell in row" :key="cell" v-on:click="cellClicked(cell)">
        <Wizard v-if="cell.type == PieceTypes.Sage" :piece="cell"
          :player-number="getPlayerNumberBySage(cell as SageModel)" />
        <Element v-else-if="cell.type == PieceTypes.Element" :piece="cell" />
        <Empty v-else :piece="cell" />

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { BoardModel } from '@/game/models/board';
import { PieceModel, PieceTypes } from '@/game/models/pieces/pieces';
import { SageModel } from '@/game/models/pieces/sage';
import { PlayerModel } from '@/game/models/player';
import { defineComponent, PropType } from 'vue';
import Wizard from './pieces/Wizard.vue';
import Empty from './pieces/Empty.vue';
import Element from './pieces/Element.vue';

import { Emitter } from '@/main'

export default defineComponent({
  name: 'BoardComponent',
  components: {
    Wizard,
    Empty,
    Element,
  },
  enums: {
    PieceTypes,
  },
  props: {
    board: BoardModel,
    players: Array as PropType<Array<PlayerModel>>,
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
    getPlayerNumberBySage(sage: SageModel): number | null {
      if (this.players == null) {
        return null;
      }
      const players: Array<PlayerModel> = this.players as Array<PlayerModel>
      for (let player of players) {
        if (player.sage.uuid === sage.uuid) {
          return player.player_number;
        }
      }
      return 0;
    },
    cellClicked(piece: PieceModel): void {
      Emitter.emit('clickedCell', piece);
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.cell-div {
  margin: 0;
  padding: 0;
  max-width: 64px;
  max-height: 64px;
}
</style>
