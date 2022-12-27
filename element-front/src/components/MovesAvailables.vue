<template>
  <div class="moves-available-action">
    <div class="row justify-content-center">
      <div class="row align-items-center justify-content-center">
        <div class="col">
          Available elements to place: {{ turn?.chosen_elements.length }}
        </div>
        <div class="col">
          Sage movements: {{ turn?.available_sage_moves }}
        </div>
      </div>
      <div class="row align-items-center justify-content-center"
        v-if="turn?.chosen_elements.includes(ElementTypes.Fire)"
        :class="isSelectedElement(ElementTypes.Fire) ? 'border border-primary border-3 rounded-pill' : ''"
        v-on:click="selectElement(ElementTypes.Fire)">
        <div class="col element-div">
          <img class="element" :src="require('@/assets/elements/Fire.png')">
        </div>
        <div class="col">
          x{{ countElements(ElementTypes.Fire) }}
        </div>
      </div>

      <div class="row align-items-center justify-content-center"
        v-if="turn?.chosen_elements.includes(ElementTypes.Water)"
        :class="isSelectedElement(ElementTypes.Water) ? 'border border-primary border-3 rounded-pill' : ''"
        v-on:click="selectElement(ElementTypes.Water)">

        <div class="col element-div">
          <img class="element" :src="require('@/assets/elements/Water.png')">
        </div>
        <div class="col">
          x{{ countElements(ElementTypes.Water) }}
        </div>
      </div>

      <div class="row align-items-center justify-content-center"
        v-if="turn?.chosen_elements.includes(ElementTypes.Earth)"
        :class="isSelectedElement(ElementTypes.Earth) ? 'border border-primary border-3 rounded-pill' : ''"
        v-on:click="selectElement(ElementTypes.Earth)">
        <div class="col element-div">
          <img class="element" :src="require('@/assets/elements/Earth.png')">
        </div>
        <div class="col">
          x{{ countElements(ElementTypes.Earth) }}
        </div>
      </div>

      <div class="row align-items-center justify-content-center"
        v-if="turn?.chosen_elements.includes(ElementTypes.Wind)"
        :class="isSelectedElement(ElementTypes.Wind) ? 'border border-primary border-3 rounded-pill' : ''"
        v-on:click="selectElement(ElementTypes.Wind)">
        <div class="col element-div">
          <img class="element" :src="require('@/assets/elements/Wind.png')">
        </div>
        <div class="col">
          x{{ countElements(ElementTypes.Wind) }}
        </div>
      </div>
    </div>
    <div class="row align-items-center justify-content-center">
      <button class="btn btn-primary" v-on:click="endTurn()">End turn</button>
    </div>

  </div>
</template>

<script lang="ts">
import { ElementTypes } from '@/game/models/elements/elements';
import { TurnModel } from '@/game/models/turn';
import { SocketInstance } from '@/main';
import { EndTurn, MoveSage, PlaceElement } from '@/sockets/socketUtils';
import { defineComponent } from 'vue';
import { Emitter } from '@/main';
import { PieceModel } from '@/game/models/pieces/pieces';
import { Position } from '@/game/utils/position_utils';
import { PlayerModel } from '@/game/models/player';

// eslint-disable-next-line
enum NoneElement {
  // eslint-disable-next-line
  None = 'None'
}
type Elements = ElementTypes | NoneElement;

type ClickedData = {
  piece: PieceModel,
  river: Array<Position>
}

export default defineComponent({
  name: 'MovesAvailablesAction',
  props: {
    turn: TurnModel,
    roomId: String,
    player: PlayerModel,
  },
  enums: {
    ElementTypes,
  },
  mounted() {
    Emitter.on('clickedCell', clickedData => {
      if (this.selectedElement === NoneElement.None) {
        return;
      }
      
      let data: PlaceElement = {
        roomId: this.roomId!,
        element: this.selectedElement,
        position: (clickedData as ClickedData).piece.position,
      };
      if((clickedData as ClickedData).river != null ){
        data.reaction = (clickedData as ClickedData).river
      }
      console.log(data)
      SocketInstance.emit('placeElement', data);
      this.selectedElement = NoneElement.None

    });

    Emitter.on('sagePositionDestination', (position) => {
      if (this.turn!.available_sage_moves > 0) {
        const data: MoveSage = {
          roomId: this.roomId!,
          position: position as Position,
          playerId: this.player!.uuid
        }
        SocketInstance.emit('moveSage', data);
      }
    })

  },
  data() {
    return {
      selectedElement: NoneElement.None as Elements,
      elementList: [] as Array<ElementTypes>,
    }
  },

  methods: {
    countElements(element: ElementTypes): number {
      return this.turn!.chosen_elements.filter(el => el == element as ElementTypes).length;
    },
    selectElement(element: ElementTypes): void {
      switch (element) {
        case ElementTypes.Fire:
          this.selectedElement = this.selectedElement === ElementTypes.Fire ? NoneElement.None : ElementTypes.Fire;
          break;
        case ElementTypes.Water:
          this.selectedElement = this.selectedElement === ElementTypes.Water ? NoneElement.None : ElementTypes.Water;
          break;
        case ElementTypes.Earth:
          this.selectedElement = this.selectedElement === ElementTypes.Earth ? NoneElement.None : ElementTypes.Earth;
          break;
        case ElementTypes.Wind:
          this.selectedElement = this.selectedElement === ElementTypes.Wind ? NoneElement.None : ElementTypes.Wind;
          break;
        default:
          this.selectedElement = NoneElement.None;
          return;
      }
      Emitter.emit('elementSelected', this.selectedElement);
    },
    isSelectedElement(element: ElementTypes): boolean {
      return element === this.selectedElement;
    },
    endTurn(): void {
      const data: EndTurn = {
        roomId: this.roomId!
      }
      SocketInstance.emit('endTurn', data);
    },
    isEndOfTurn(): boolean {
      return this.turn!.available_sage_moves == 0 && this.turn!.chosen_elements.length == 0;
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.element {
  height: 40px;
  width: 40px;
  border: solid;
  border-width: 1px;
  border-radius: 40px;
  vertical-align: middle;
  text-align: center;
}

.element-div {
  text-align: right;
}
</style>
