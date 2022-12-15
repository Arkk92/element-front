<template>
  <div class="moves-available-action">
    <div class="row align-items-center">
      <div class="col">
        Available elements to place: {{ turn?.chosen_elements.length }}
      </div>
      <div class="col">
        Sage movements: {{ turn?.available_sage_moves }}
      </div>
    </div>
    <div class="row align-items-center" v-if="turn?.chosen_elements.includes(ElementTypes.Fire)"
      :class="isSelectedElement(ElementTypes.Fire) ? 'border border-primary border-3 rounded-pill' : ''"
      v-on:click="selectElement(ElementTypes.Fire)">
      <div class="col">
        Fire:
      </div>
      <div class="col-3">
        <div class="circle fire"></div>
      </div>
      <div class="col">
        x{{ countElements(ElementTypes.Fire) }}
      </div>
    </div>

    <div class="row align-items-center" v-if="turn?.chosen_elements.includes(ElementTypes.Water)"
      :class="isSelectedElement(ElementTypes.Water) ? 'border border-primary border-3 rounded-pill' : ''"
      v-on:click="selectElement(ElementTypes.Water)">
      <div class="col">
        Water:
      </div>
      <div class="col-3">
        <div class="circle water"></div>
      </div>
      <div class="col">
        x{{ countElements(ElementTypes.Water) }}
      </div>
    </div>

    <div class="row align-items-center" v-if="turn?.chosen_elements.includes(ElementTypes.Earth)"
      :class="isSelectedElement(ElementTypes.Earth) ? 'border border-primary border-3 rounded-pill' : ''"
      v-on:click="selectElement(ElementTypes.Earth)">
      <div class="col">
        Earth:
      </div>
      <div class="col-3">
        <div class="circle earth"></div>
      </div>
      <div class="col">
        x{{ countElements(ElementTypes.Earth) }}
      </div>
    </div>

    <div class="row align-items-center" v-if="turn?.chosen_elements.includes(ElementTypes.Wind)"
      :class="isSelectedElement(ElementTypes.Wind) ? 'border border-primary border-3 rounded-pill' : ''"
      v-on:click="selectElement(ElementTypes.Wind)">
      <div class="col">
        Wind:
      </div>
      <div class="col-3">
        <div class="circle wind"></div>
      </div>
      <div class="col">
        x{{ countElements(ElementTypes.Wind) }}
      </div>
    </div>


  </div>
</template>

<script lang="ts">
import { ElementTypes } from '@/game/models/elements/elements';
import { TurnModel } from '@/game/models/turn';
import { SocketInstance } from '@/main';
import { PlaceElement } from '@/sockets/socketUtils';
import { defineComponent } from 'vue';
import { Emitter } from '@/main';
import { PieceModel } from '@/game/models/pieces/pieces';

const MIN_SAGE_MOVEMENTS: number = 2;

// eslint-disable-next-line
enum NoneElement {
  // eslint-disable-next-line
  None = 'None'
}
type Elements = ElementTypes | NoneElement;

export default defineComponent({
  name: 'MovesAvailablesAction',
  props: {
    turn: TurnModel,
    roomId: String
  },
  enums: {
    ElementTypes,
  },
  mounted() {
    Emitter.on('clickedCell', piece => {
      if(this.selectedElement !== NoneElement.None){
        const data: PlaceElement = {
          roomId: this.roomId!,
          element: this.selectedElement,
          position: (piece as PieceModel).position,
        }
        SocketInstance.emit('placeElement', data);
        this.selectedElement = NoneElement.None
      }
    });
    
  },
  data() {
    return {
      selectedElement: NoneElement.None as Elements,
      sageMovements: MIN_SAGE_MOVEMENTS,
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
          break;
      }
    },
    isSelectedElement(element: ElementTypes): boolean {
      return element === this.selectedElement;
    }

  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.circle {
  width: 20px;
  height: 20px;
  -webkit-border-radius: 25px;
  -moz-border-radius: 25px;
  border: solid;
  border-width: 1px;
  border-radius: 25px;
  text-align: center;
}

.fire {
  background: red;
}

.wind {
  background: white;
}

.water {
  background: blue;
}

.earth {
  background: brown;
}
</style>
