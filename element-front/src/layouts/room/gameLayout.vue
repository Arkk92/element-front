<template>
  <div class="game-layout">
    <div class="row">
      <BoardLayout :board="game?.board" :players="game?.player_list"></BoardLayout>
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
import { EmptyPieceCreator } from '@/game/models/pieces_factory';
import { Emitter } from '@/main';
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
    currentPlayerId: String,
  },
  data() {
    return {
      boardClickedElement: new EmptyPieceCreator().createPieceModel(),
    }
  },
  watch: {
    isUserTurn(isUserTurn) {
      console.log("new turn!")
      console.log(isUserTurn);
      if(isUserTurn){
        Emitter.emit('turnPlayerNumber', this.getPlayerNumberById(this.currentPlayerId!));
      }
    }
  },
  methods: {
    getPlayerNumberById(id: string): number {
      for (let player of this.game!.player_list) {
        if (player.uuid === id) {
          return player.player_number;
        }
      }
      return -1;
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
