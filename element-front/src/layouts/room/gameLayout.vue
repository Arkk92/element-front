<template>
  <div class="game-layout">
    <div class="row">
      <BoardLayout :board="game?.board" :players="game?.player_list" @clickedCell="onBoardClickEvent"></BoardLayout>
    </div>
    <div class="row" v-if="isUserTurn">
      <PlayerActionsLayout :element-pool-manager="game?.board.elementPool" :turn="game?.turn" :room-id="roomId"
        :clickedCell="boardClickedElement">
      </PlayerActionsLayout>
    </div>
  </div>
</template>

<script lang="ts">
import { GameModel } from '@/game/models/game';
import { PieceModel } from '@/game/models/pieces/pieces';
import { EmptyPieceCreator } from '@/game/models/pieces_factory';
import { defineComponent } from 'vue';
import BoardLayout from './boardLayout.vue';
import PlayerActionsLayout from './playerActionsLayout.vue';


export default defineComponent({
  name: 'GameLayout',
  components: {
    PlayerActionsLayout,
    BoardLayout
  },
  props: {
    game: GameModel,
    isUserTurn: Boolean,
    roomId: String,
  },
  data() {
    return {
      boardClickedElement: new EmptyPieceCreator().createPieceModel(),
    }
  },
  methods: {
    onBoardClickEvent(piece: PieceModel): void {
      this.boardClickedElement = piece;
      console.log("He clickao!")
      console.log(piece);
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
