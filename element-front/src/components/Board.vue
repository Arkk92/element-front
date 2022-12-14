<template>
  <div class="room" v-if="data_ready">
    <div class="row" v-for="row in grid!.cells" :key="row">
      <div class="col border border-dark border-1 cells" v-for="cell in row" :key="cell" style="padding: 0;">
        <img class="pieces" :src="getImage(cell)">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { BoardModel } from '@/game/models/board';
import { ElementModel, ElementTypes } from '@/game/models/elements/elements';
import { GridModel } from '@/game/models/grid';
import { PieceModel, PieceTypes } from '@/game/models/pieces/pieces';
import { SageModel } from '@/game/models/pieces/sage';
import { PlayerModel } from '@/game/models/player';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BoardComponent',
  props: {
    board: BoardModel,
    players: Array,
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
  },
  methods: {
    getImage(piece: PieceModel): any {
      let player_number: number | null;
      switch (piece.type) {
        case PieceTypes.Sage:
          player_number = this.getPlayerNumberBySage(piece as SageModel);
          if(player_number == null){
            return ""
          }
          return require("@/assets/wizards/Wizard_" + (player_number + 1) + ".png");

        case PieceTypes.Empty:
          return require('@/assets/pieces/Empty.png');

        case PieceTypes.Element:
          switch ((piece as ElementModel).element_type) {
            case ElementTypes.Fire:
              return require("@/assets/elements/Fire.png");
            case ElementTypes.Water:
              return require("@/assets/elements/Water.png");
            case ElementTypes.Earth:
              return require("@/assets/elements/Earth.png");
            case ElementTypes.Wind:
              return require("@/assets/elements/Wind.png")
          }

      }
    },

    getPlayerNumberBySage(sage: SageModel): number | null {
      if(this.players == null){
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
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.cells {
  height: 64px;
  max-width: 64px;
  max-height: 64px;
  text-align: center;
  position: relative;

}

.pieces {
  box-sizing: border-box;
  max-width: 100%;
  width: 100%;
  z-index: 1;
  position: absolute;
  bottom: 0%;
  left: 0%;
}
</style>
