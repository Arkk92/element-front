<template>
  <div class="player-actions-layout">
    <div v-if="isDrawingElements()">
      <DrawElementsAction
      :element-pool-manager="elementPoolManager"
      :room-id="roomId"
      ></DrawElementsAction>
    </div>
    <div v-else-if="isMovementsAvailable()">
      <MovesAvailables
      :turn="turn"
      :room-id="roomId"
      ></MovesAvailables>
    </div>
    <div v-else>
      END OF TURN
    </div>
  </div>
</template>

<script lang="ts">
import { ElementPoolManagerModel } from '@/game/models/element_pool';
import { TurnModel, TurnStates } from '@/game/models/turn';
import MovesAvailables from '@/components/MovesAvailables.vue'
import DrawElementsAction from '@/components/DrawElements.vue'
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PlayerActionsLayout',
  components: {
    MovesAvailables,
    DrawElementsAction,
  },
  enums: {
    TurnStates,
  },
  props: {
    turn: TurnModel,
    elementPoolManager: ElementPoolManagerModel,
    roomId: String,
    clickedCell: null,
  },
  data() {
    return {
      selectedElement: 'None',
    }
  },
  methods: {
    isDrawingElements(): boolean {
      return this.turn!.state == TurnStates.DrawingElements;
    },
    isMovementsAvailable(): boolean {
      return this.turn!.state == TurnStates.MovesAvailables;
    },
    isEndTurn(): boolean {
      return this.turn!.state == TurnStates.EndTurn;
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
