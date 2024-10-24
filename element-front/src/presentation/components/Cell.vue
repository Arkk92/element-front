<template>

  <div class="cell">
    <Wizard v-if="isWizardCell(cell.type)" :piece="cell as any" @clicked="onWizardCellClick(cell)" />
    <Element v-else-if="isElementCell(cell.type)" :piece="cell" @clicked="onElementCellClick(cell)" />
    <Empty v-else :piece="cell" @clicked="onEmptyCellClick(cell)" />
  </div>


</template>

<script lang="ts">
import { PieceModel, PieceTypes } from '@/domain/game/models/pieces/pieces';
import Element from '@/presentation/components/pieces/Element.vue';
import Empty from '@/presentation/components/pieces/Empty.vue';
import Wizard from '@/presentation/components/pieces/Wizard.vue';
import { defineComponent, PropType } from 'vue';

import { Position } from '@/domain/game/utils/position_utils';
import { usePieceStore } from '@/presentation/stores/piece';
import { useRoomStore } from '../stores/room';


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
    position: {
      type: Object as PropType<Position>,
      required: true
    }
  },
  setup() {
    const pieceStore = usePieceStore();
    const roomStore = useRoomStore();
    return { pieceStore, roomStore }
  },
  computed: {
    cell(): PieceModel {
      return this.roomStore.model.game.board.grid.cells[this.position.row][this.position.column];
    }
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
    onElementCellClick(piece: PieceModel) {
      this.pieceStore.onElementClick(piece);
    },
    onWizardCellClick(piece: PieceModel) {
      this.pieceStore.onWizardClick(piece);
    },
    onEmptyCellClick(piece: PieceModel) {
      this.pieceStore.onEmptyCellClick(piece);
    }
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.cell {
  flex: 1;
  width: calc(100%/11);
  height: 100%;
}
</style>
