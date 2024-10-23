<template>
  <div class="user-interactor" :class="isUserTurn ? '' : 'non-user-interactor'">
    <div class="elements-and-moves-container">
      <div class="all-elements-container">
        <ElementContainer :elements-hidden="isDrawingElements" />
      </div>
      <div class="moves-counter-wrap">
        <MovesCounter :counter="sageMovements" />
      </div>
    </div>
    <div class="turn-timer">
      <PlayerTimer />
    </div>
    <div v-if="isUserTurn" class="button-group-container">
      <DrawingButtonGroup v-if="isDrawingElements" />
      <PlayingButtonGroup v-else-if="isMovementsAvailable" @endTurn="endTurn()" />
    </div>
    <div v-else class="button-group-container">
      <TurnStateButton :state="getStringState" />
    </div>
  </div>
</template>

<script lang="ts">
import { ElementPoolManagerModel } from '@/domain/game/models/element_pool';
import { TurnModel, TurnStates } from '@/domain/game/models/turn';
import DrawingButtonGroup from '@/presentation/components/PlayerMenu/DrawingButtonGroup.vue';
import ElementContainer from '@/presentation/components/PlayerMenu/ElementContainer.vue';
import MovesCounter from '@/presentation/components/PlayerMenu/MovesCounter.vue';
import PlayerTimer from '@/presentation/components/PlayerMenu/PlayerTimer.vue';
import PlayingButtonGroup from '@/presentation/components/PlayerMenu/PlayingButtonGroup.vue';
import TurnStateButton from '@/presentation/components/PlayerMenu/TurnStateButton.vue';
import { useAuthStore } from '@/presentation/stores/auth';
import { defineComponent } from 'vue';
import { usePlayerActionStore } from '../stores/playerAction';
import { useRoomStore } from '../stores/room';

const TurnStatesToStringMap = {
  [TurnStates.DrawingElements]: 'Drawing',
  [TurnStates.MovesAvailables]: 'Playing',
  [TurnStates.EndTurn]: 'Finished',
};

export default defineComponent({
  name: 'PlayerMenuComponent',
  components: {
    MovesCounter,
    ElementContainer,
    DrawingButtonGroup,
    PlayingButtonGroup,
    TurnStateButton,
    PlayerTimer
  },
  setup() {
    const authStore = useAuthStore();
    const roomStore = useRoomStore();
    const playerActionStore = usePlayerActionStore();
    return {
      authStore,
      roomStore,
      playerActionStore
    }
  },
  data() {
    return {
      resetElementView: false,
      restartTimer: false,
      currentPlayer: null as Number | null,
      dataReady: false
    }
  },
  mounted() {
  },
  methods: {
    endTurn(): void {
      if (this.isUserTurn) {
        this.playerActionStore.endTurn();
      }
      this.$emit('endTurn');
    },
  },
  computed: {
    getStringState(): string {
      return TurnStatesToStringMap[this.turn.state];
    },
    elementPoolManager(): ElementPoolManagerModel {
      return this.roomStore.model.game.board.elementPool;
    },
    roomId(): string {
      return this.authStore.roomId;
    },
    turn(): TurnModel {
      return this.roomStore.model.game.turn;
    },
    player(): string {
      return this.authStore.playerId;
    },
    isUserTurn(): Boolean {
      return this.authStore.playerId === this.roomStore.turnPlayerId;
    },
    elementList() {
      return this.playerActionStore.elementList;
    },
    availableElementsToDraw(): number {
      return this.playerActionStore.numAvailableElementsToDraw;
    },
    isDrawingElements(): boolean {
      return this.turn.state == TurnStates.DrawingElements;
    },
    isMovementsAvailable(): boolean {
      return this.turn.state == TurnStates.MovesAvailables;
    },
    isEndTurn(): boolean {
      return this.turn.state == TurnStates.EndTurn;
    },
    sageMovements(): number {
      return this.isDrawingElements ? this.playerActionStore.numAvailableWizardMoves : this.turn.available_sage_moves;
    },
    isEndOfTurn(): boolean {
      return this.turn.available_sage_moves == 0 && this.turn.chosen_elements.length == 0;
    },
  },

})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.button-group-container {
  width: 100%;
  height: 100%;
  z-index: 100;
}

.elements-and-moves-container {
  position: relative;
  max-height: 85%;
  min-height: 85%;
  width: 100%;
  height: 100%;
  z-index: 3;
}

.all-elements-container {
  position: absolute;
  width: 100%;
  min-height: 100%;
  max-height: 100%;
  z-index: 2;
}

.moves-counter-wrap {
  position: absolute;
  right: 0;
  bottom: 0;
  min-width: 30%;
  max-width: 30%;
  min-height: 30%;
  max-height: 30%;
  z-index: 1;
}

.wizard-moves-number {
  color: wheat;
  font-size: 2.5rem;
  -webkit-text-stroke: 1px black;
  /* width and color */
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
}

.wizard-miniature {
  width: 60px;
}

.user-interactor {
  width: 100%;
  height: 100%;
}

.turn-timer {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: fit-content;
}

@media screen and (max-width: 785px) {

  .wizard-moves-number {
    color: wheat;
    font-size: 1rem;
    -webkit-text-stroke: 1px black;
    /* width and color */
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.non-user-interactor {
  pointer-events: none;
}
</style>
