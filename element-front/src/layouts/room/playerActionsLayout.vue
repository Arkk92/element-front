<template>
  <div class="player-actions-layout">

    <div class="d-flex actions">
      <PlayerMenu :element-pool-manager="elementPoolManager" :room-id="roomId" :turn="turn" :player="player"/>
    </div>

  </div>
</template>

<script lang="ts">
import { ElementPoolManagerModel } from '@/game/models/element_pool';
import { TurnModel } from '@/game/models/turn';
import { defineComponent } from 'vue';
import PlayerMenu from '@/composables/PlayerMenu.vue';

export default defineComponent({
  name: 'PlayerActionsLayout',
  components: {
    PlayerMenu
  },
  props: {
    turn: TurnModel,
    elementPoolManager: ElementPoolManagerModel,
    roomId: String,
    player: String,
  },
  data() {
    return {
      selectedElement: 'None',
    }
  },
  methods: {
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
</style>
