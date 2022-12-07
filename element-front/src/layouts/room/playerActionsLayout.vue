<template>
  <div class="player-actions-layout">
    <div v-if="isTurnState('Drawing')">
      <DrawElementsAction
      :element-pool-manager="elementPoolManager"
      :room-id="roomId"
      ></DrawElementsAction>
    </div>
  </div>
</template>

<script lang="ts">
import { ElementPoolManagerModel } from '@/game/models/element_pool';
import { TurnModel, TurnStates } from '@/game/models/turn';
import DrawElementsAction from '@/components/DrawElements.vue'
import { defineComponent } from 'vue';

type TurnStatesStr = 'Drawing' | 'Moves available' | 'End turn'

export default defineComponent({
  name: 'PlayerActionsLayout',
  components: {
    DrawElementsAction,
  },
  props: {
    turn: TurnModel,
    elementPoolManager: ElementPoolManagerModel,
    roomId: String,
  },
  data() {
    return {
    }
  },

  methods: {
    isTurnState(state: TurnStatesStr): boolean {
      switch (this.turn?.state) {
        case TurnStates.DrawingElements:
          return state == 'Drawing';
        case TurnStates.MovesAvailables:
          return state == 'Moves available';
        case TurnStates.EndTurn:
          return state == 'End turn';
      }
      return false;
    },
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
