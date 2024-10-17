<template>
  <div class="player-actions-layout" :class="isUserTurn ? '' : 'no-user-turn'">

    <div class="d-flex actions">
      <PlayerMenu/>
    </div>

  </div>
</template>

<script lang="ts">
import PlayerMenu from '@/composables/PlayerMenu.vue';
import { useAuthStore } from '@/stores/auth';
import { useGameStore } from '@/stores/game';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PlayerActionsLayout',
  setup() {
    const authStore = useAuthStore();
    const gameStore = useGameStore();
    return {
      authStore, gameStore
    }  
  },
  components: {
    PlayerMenu
  },
  computed: {
    isUserTurn(): boolean {
      return this.gameStore.getTurnPlayerId() === this.authStore.playerId;
    }
  }

})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.player-actions-layout {
  display: block;
  position: relative;
  overflow: hidden;
  /* background-color: #2a2d32;
  color: white; */
  border-radius: 10px;
  width: 100%;
  height: 100%;
  background-image: url("/assets/WizardBook.png");
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
}

.actions {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.no-user-turn {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
