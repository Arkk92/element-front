<template>
  <div class="user-interactor" :class="isUserTurn ? '' : 'non-user-interactor'">

    <div class="elements-and-moves-container">
      <div class="all-elements-container">
        <ElementContainer :elements-hidden="isDrawingElements()" :list="getElementList()" :reset="resetElementView"
          @elementClickedIndex="onElementSelect" />
      </div>
      <div class="moves-counter-wrap">
        <MovesCounter :counter="getSageMovements()" />
      </div>
    </div>
    <div class="turn-timer">
      <PlayerTimer :restart="restartTimer" :minutes="0" :seconds="10" @time-out="endTurn()" />
    </div>
    <div v-if="isUserTurn" class="button-group-container">
      <DrawingButtonGroup v-if="isDrawingElements()" @add="addElementToList()" @remove="removeElementFromList()"
        @draw="drawElements()" />
      <PlayingButtonGroup v-else-if="isMovementsAvailable()" @endTurn="endTurn()" />
    </div>
    <div v-else class="button-group-container">
      <TurnStateButton :state="getStringState()" />
    </div>
  </div>
</template>

<script lang="ts">
import { ElementTypes } from '@/game/models/elements/elements';
import { ElementPoolManagerModel } from '@/game/models/element_pool';
import { Emitter } from '@/main';
import { defineComponent } from 'vue';
import MovesCounter from '@/components/PlayerMenu/MovesCounter.vue';
import ElementContainer from '@/components/PlayerMenu/ElementContainer.vue';
import { TurnModel, TurnStates } from '@/game/models/turn';
import DrawingButtonGroup from '@/components/PlayerMenu/DrawingButtonGroup.vue';
import PlayingButtonGroup from '@/components/PlayerMenu/PlayingButtonGroup.vue';
import UserInterfaceUtils from './PlayerMenu/UserInterfaceUtils';
import { ClickedData, Elements, NoneElement } from '@/components/PlayerMenu/types';
import { Position } from '@/game/utils/position_utils';
import PlacementUtils from './PlayerMenu/PlacementUtils';
import TurnStateButton from '@/components/PlayerMenu/TurnStateButton.vue';
import PlayerTimer from '@/components/PlayerMenu/PlayerTimer.vue';

const TurnStatesToStringMap = new Map<Number, String>([
  [TurnStates.DrawingElements, 'Drawing'],
  [TurnStates.MovesAvailables, 'Playing'],
  [TurnStates.EndTurn, 'Finished'],
]);

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
  props: {
    elementPoolManager: ElementPoolManagerModel,
    roomId: String,
    turn: TurnModel,
    player: String,
    isUserTurn: Boolean
  },
  beforeMount(){
    this.resetTimer();
  },
  data() {
    return {
      sageMovements: UserInterfaceUtils.MIN_SAGE_MOVEMENTS,
      elementList: [] as Array<ElementTypes>,
      drawType: 'random',
      selectedElement: NoneElement.None as Elements,
      resetElementView: false,
      restartTimer: true,
      currentPlayer: null as Number | null,
      dataReady: false
    }
  },
  mounted() {
    Emitter.on('drawType', (drawType => {
      this.drawType = drawType as string;
    }))

    Emitter.on('clickedCell', clickedData => {
      if (this.selectedElement === NoneElement.None) {
        return;
      }
      PlacementUtils.placeElement(this.roomId!, this.selectedElement, clickedData as ClickedData);
      this.selectedElement = NoneElement.None;
      this.resetElementView = true;

    });

    Emitter.on('sagePositionDestination', (position) => {
      if (this.turn!.state == TurnStates.MovesAvailables) {
        PlacementUtils.placeSage(this.turn!, this.player!, position as Position, this.roomId!)
      } else {
        Emitter.emit('errorLog', "Move is not allowed until cast")
      }
    })

    Emitter.on('resetPlayerMenu', () => {
      this.resetElementView = true;
    })
  },
  methods: {

    addElementToList() {
      this.elementList = UserInterfaceUtils.addElementToList(this.elementList, this.elementPoolManager!, ElementTypes.Fire);
    },
    removeElementFromList() {
      this.elementList = UserInterfaceUtils.removeElementFromList(this.elementList, ElementTypes.Fire);
    },
    drawElements() {
      UserInterfaceUtils.drawElements(this.elementList, this.roomId!)
    },
    getElementList(): Array<ElementTypes> {
      return this.isDrawingElements() ? this.elementList : this.turn!.chosen_elements;
    },
    getAvailableElementToDraw(): number {
      return UserInterfaceUtils.MAX_ALLOWED_ELEMENTS - this.elementList.length;
    },
    getSageMovements(): number {
      return this.isDrawingElements() ? UserInterfaceUtils.MIN_SAGE_MOVEMENTS + this.getAvailableElementToDraw() : this.turn!.available_sage_moves;
    },
    isDrawingElements(): boolean {
      return this.turn!.state == TurnStates.DrawingElements;
    },
    isMovementsAvailable(): boolean {
      return this.turn!.state == TurnStates.MovesAvailables;
    },
    isEndTurn(): boolean {
      return this.turn!.state == TurnStates.EndTurn;
    },
    endTurn(): void {
      if(this.isUserTurn){
        UserInterfaceUtils.endTurn(this.roomId!)
      }
      this.resetTimer();
      this.$emit('endTurn');
    },
    isEndOfTurn(): boolean {
      return this.turn!.available_sage_moves == 0 && this.turn!.chosen_elements.length == 0;
    },
    onElementSelect(index: Number) {
      this.resetElementView = false;
      if ((index as number >= 0) && (index as number < this.turn!.chosen_elements.length)) {
        this.selectedElement = this.turn!.chosen_elements[index as number];
        Emitter.emit('sysLog', `${this.selectedElement} selected.`)
      } else {
        this.selectedElement = NoneElement.None;
      }
      Emitter.emit('elementSelected', this.selectedElement);
    },
    getStringState(): string {
      return TurnStatesToStringMap.get(this.turn!.state) as any;
    },
    resetTimer(){
      this.restartTimer = true;
        this.$nextTick(()=>{
          this.restartTimer = false;
        })
    }
  },
  computed: {
    playerChange(){
      return this.turn!.player;
    }
  },
  watch: {
    playerChange(){
      if(this.turn!.player != this.currentPlayer){
        this.currentPlayer = this.turn!.player;
        this.resetTimer();
      }
    }
  }
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
