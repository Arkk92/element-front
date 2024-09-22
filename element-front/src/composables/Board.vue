<template>
  <div class="board" v-if="data_ready">
    <div class="custom-row" v-for="row in board!.grid!.cells" :key="row as any">
      <div class="cell-div" v-for="cell in row" :key="cell as any" v-on:click="cellClicked(cell)">
        <Wizard v-if="isWizardCell(cell.type)" :piece="cell as any"
          :player-number="getPlayerNumberBySage(cell as SageModel) as (number | undefined)"
          :current-player="currentPlayer" />
        <Element v-else-if="isElementCell(cell.type)" :piece="cell as any" />
        <Empty v-else :piece="cell" :grid="board!.grid" />

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
import Wizard from '@/components/pieces/Wizard.vue';
import Empty from '@/components/pieces/Empty.vue';
import Element from '@/components/pieces/Element.vue';

import { Emitter } from '@/main'
import { ElementTypes } from '@/game/models/elements/elements';
import { WaterModel } from '@/game/models/elements/water';
import WaterUtils from './Board/WaterUtils';

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
    currentPlayer: Number,
  },
  data() {
    return {
      waterUtils: null as WaterUtils | null,
      data_ready: false,
    }
  },
  mounted() {
    this.data_ready = true;

    this.waterUtils = new WaterUtils();

    Emitter.on('elementSelected', (element) => {
      if ((element as ElementTypes) === ElementTypes.Water) {
        if (this.waterUtils!.waterElementSM === 'None') {
          this.waterUtils!.waterElementSM = 'PlacingElement';
        }
      }
    })
    Emitter.on('riverCancel', () => {
      this.waterUtils?.cancelBuildingRiver(this.board!);
      Emitter.emit('resetPlayerMenu');
    })
    Emitter.on('riverUndo', () => {
      this.waterUtils!.waterElementSM = 'Undoing';
      this.waterUtils?.undoRiverBuildingStep(this.board!);
      this.waterUtils!.waterElementSM = 'PlacingNewRiver';
    })
  },
  methods: {
    isWizardCell(cell: PieceTypes): boolean {
      return cell == PieceTypes.Sage;
    },
    isEmptyCell(cell: PieceTypes): boolean {
      return cell == PieceTypes.Empty;
    },
    isElementCell(cell: PieceTypes): boolean {
      return cell == PieceTypes.Element;
    },
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
      switch (this.waterUtils!.waterElementSM) {
        case 'PlacingElement':
          this.waterUtils!.placingWater(piece as WaterModel, this.board!);
          break;
        case 'ShowingRiversAvailable':
          this.waterUtils!.chosingRiver(piece as WaterModel, this.board!);
          break;
        case 'PlacingNewRiver':
          this.waterUtils!.buildNewRiver(piece as WaterModel, this.board!);
          break;
        default:
          this.waterUtils!.sendClickedCellData({
            piece: piece
          });
          break;
      }

    },

  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.custom-row {
  position: relative;
  display: flex;
  height: calc(100%/11);
  width: 100%;
}

.cell-div {
  flex: 1;
  width: calc(100%/11);
  height: 100%;
}

.board {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
