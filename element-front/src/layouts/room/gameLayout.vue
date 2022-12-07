<template>
  <div class="game-layout">
    <div class="row">
      <Board :board="game?.board"></Board>
    </div>
    <div class="row" v-if="isUserTurn">
      <PlayerActionsLayout :element-pool-manager="game?.board.elementPool" :turn="game?.turn" :room-id="roomId">
      </PlayerActionsLayout>
    </div>
  </div>
</template>

<script lang="ts">
import Board from '@/components/Board.vue';
import { GameModel } from '@/game/models/game';
import { defineComponent } from 'vue';
import PlayerActionsLayout from './playerActionsLayout.vue';


export default defineComponent({
  name: 'GameLayout',
  components: {
    Board,
    PlayerActionsLayout
  },
  props: {
    game: GameModel,
    isUserTurn: Boolean,
    roomId: String,
  },
  data() {
    return {
    }
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
