<template>
  <div class="game-layout">
    <div class="row">
      <BoardLayout :board="game?.board" :players="game?.player_list" :current-player="turnPlayerNumber"></BoardLayout>
    </div>
    <div class="row" v-if="isUserTurn">
      <PlayerActionsLayout :element-pool-manager="game?.board.elementPool" :turn="game?.turn" :room-id="roomId"
        :player="getPlayerById(currentPlayerId!)">
      </PlayerActionsLayout>
    </div>
  </div>
</template>

<script lang="ts">
import { GameModel } from '@/game/models/game';
import { EmptyPieceCreator } from '@/game/models/pieces_factory';
import { PlayerModel } from '@/game/models/player';
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
      turnPlayerNumber: this.isUserTurn ? this.game?.turn.player : -1,
    }
  },
  watch: {
    isUserTurn(isUserTurn) {
      if(isUserTurn){
        this.turnPlayerNumber = this.game?.turn.player;
      } else {
        this.turnPlayerNumber = -1
      }
    }
  },
  methods: {
    getPlayerById(id: string): PlayerModel | undefined{
      for (let player of this.game!.player_list) {
        if (player.uuid === id) {
          return player;
        }
      }
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
