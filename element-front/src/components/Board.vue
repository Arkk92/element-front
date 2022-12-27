<template>
  <div class="board" v-if="data_ready">
    {{ waterSelected }}
    {{ chosingRiver }}
    <div class="row" v-for="row in board!.grid!.cells" :key="row">
      <div class="col cell-div" v-for="cell in row" :key="cell" v-on:click="cellClicked(cell)">
        <Wizard v-if="cell.type == PieceTypes.Sage" :piece="cell"
          :player-number="getPlayerNumberBySage(cell as SageModel)" :current-player="currentPlayer" />
        <Element v-else-if="cell.type == PieceTypes.Element" :piece="cell" />
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
import Wizard from './pieces/Wizard.vue';
import Empty from './pieces/Empty.vue';
import Element from './pieces/Element.vue';

import { Emitter } from '@/main'
import { ElementTypes } from '@/game/models/elements/elements';
import { WaterController } from '@/game/controllers/elements/water_controller';
import { WaterModel } from '@/game/models/elements/water';
import { Position, PositionUtils } from '@/game/utils/position_utils';
import GridController from '@/game/controllers/grid_controller';

enum WaterElementSM {
  None,
  WaterSelected,
  PlacingElement,
  ShowingRiversAvailable,
  PlacingNewRiver,
  SendingData
}

type River = Array<Position>

type ClickedData = {
  piece: PieceModel,
  oldRiver?: River,
  newRiver?: River
}



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
      data_ready: false,
      placedWater: new WaterModel(),
      availableRivers: Array<River>(),
      oldRiver: Array<Position>(),
      newRiver: Array<Position>(),
      waterElementSM: WaterElementSM.None,
      newRiverLength: 0,
    }
  },
  mounted() {
    this.data_ready = true;

    Emitter.on('elementSelected', (element) => {
      if ((element as ElementTypes) === ElementTypes.Water) {
        if (this.waterElementSM == WaterElementSM.None) {
          this.waterElementSM = WaterElementSM.PlacingElement;
        }
      }
    })

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
      switch (this.waterElementSM) {
        case WaterElementSM.PlacingElement:
          this.placingWater(piece as WaterModel)
          break;
        case WaterElementSM.ShowingRiversAvailable:
          this.chosingRiver(piece);
          break;
        case WaterElementSM.PlacingNewRiver:
          this.buildNewRiver(piece);
          break;
        default:
          this.sendClickedCellData({
            piece: piece
          });
          break;
      }

    },
    placingWater(piece: WaterModel): void {
      const waterController: WaterController = new WaterController(piece as WaterModel);
      this.availableRivers = waterController.getRivers(this.board!.grid!, piece.position);
      if (this.availableRivers.length == 0) {
        const clickedData: ClickedData = {
          piece: piece,
        }
        this.sendClickedCellData(clickedData);
        this.waterElementSM = WaterElementSM.None;
      }
      for (const river of this.availableRivers) {
        for (const water of river) {
          Emitter.emit('riverHighlight', water);
        }
      }
      this.waterElementSM = WaterElementSM.ShowingRiversAvailable;
      this.placedWater = piece as WaterModel;
    },

    chosingRiver(piece: PieceModel): void {
      for (const river of this.availableRivers) {
        if (river.filter(water => PositionUtils.isSamePosition(water, piece.position)).length > 0) {
          this.oldRiver = river;
          this.newRiverLength = river.length;
          this.waterElementSM = WaterElementSM.PlacingNewRiver;
          return;
        }
      }
    },

    buildNewRiver(piece: PieceModel): void {
      if (this.newRiverLength == 0) {
        const data: ClickedData = {
          piece: this.placedWater,
          oldRiver: this.oldRiver,
          newRiver: this.newRiver
        }
        this.sendClickedCellData(data);
        this.waterElementSM = WaterElementSM.None;
        return;
      }

      // TODO!
      checkRuleOfReplacement
      appendToNewRiverList
    },

    sendClickedCellData(data: ClickedData): void {
      this.waterElementSM = WaterElementSM.None;
      Emitter.emit('clickedCell', data);
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
