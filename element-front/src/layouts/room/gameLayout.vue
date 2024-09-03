<template>
  <div class="game-layout">

    <BoardLayout :board="game?.board" :players="game?.player_list" :current-player="turnPlayerNumber"></BoardLayout>

  </div>
</template>

<script lang="ts">
import { GameModel } from '@/game/models/game';
import { defineComponent } from 'vue';
import BoardLayout from './boardLayout.vue';
import { BoardModel } from '@/game/models/board';

export default defineComponent({
  name: 'GameLayout',
  components: {
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
      turnPlayerNumber: this.isUserTurn ? this.game?.turn.player : -1,
      reactBoard: new BoardModel()
    }
  },
  watch: {
    isUserTurn(isUserTurn) {
      if (isUserTurn) {
        this.turnPlayerNumber = this.game?.turn.player;
      } else {
        this.turnPlayerNumber = -1
      }
    }
  },
  mounted(){
    
  },
  methods: {
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.game-layout {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
}
</style>
