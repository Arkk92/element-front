<template>
  <div class="draw-elements-action">
    <div class="row align-items-center">
      <div class="col">
        Available elements to draw: {{ getAvailableElementToDraw() }}
      </div>
      <div class="col">
        Sage movements: {{ getSageMovements() }}
      </div>
    </div>
    <div class="row align-items-center">
      <div class="col element-div">
        <img class="element" :src="require('@/assets/elements/Fire.png')">
      </div>
      <div class="col">
        x{{ countElementsDrawn(ElementTypes.Fire) }}
      </div>
      <div class="col btn-group">

        <a class="btn"><i class="bi-plus-lg" role="img" aria-label="addFire"
            v-on:click="addElementToList(ElementTypes.Fire)"></i></a>
        <a class="btn"><i class="bi-dash-lg" role="img" aria-label="removeFire"
            v-on:click="removeElementFromList(ElementTypes.Fire)"></i></a>

      </div>
    </div>
    <div class="row align-items-center">
      <div class="col element-div">
        <img class="element" :src="require('@/assets/elements/Water.png')">
      </div>
      <div class="col">
        x{{ countElementsDrawn(ElementTypes.Water) }}
      </div>
      <div class="col btn-group">

        <a class="btn"><i class="bi-plus-lg" role="img" aria-label="addwater"
            v-on:click="addElementToList(ElementTypes.Water)"></i></a>
        <a class="btn"><i class="bi-dash-lg" role="img" aria-label="removewater"
            v-on:click="removeElementFromList(ElementTypes.Water)"></i></a>

      </div>
    </div>
    <div class="row align-items-center">
      <div class="col element-div">
        <img class="element" :src="require('@/assets/elements/Earth.png')">
      </div>
      <div class="col">
        x{{ countElementsDrawn(ElementTypes.Earth) }}
      </div>
      <div class="col btn-group">

        <a class="btn"><i class="bi-plus-lg" role="img" aria-label="addearth"
            v-on:click="addElementToList(ElementTypes.Earth)"></i></a>
        <a class="btn"><i class="bi-dash-lg" role="img" aria-label="removeearth"
            v-on:click="removeElementFromList(ElementTypes.Earth)"></i></a>

      </div>
    </div>
    <div class="row align-items-center">
      <div class="col element-div">
        <img class="element" :src="require('@/assets/elements/Wind.png')">
      </div>
      <div class="col">
        x{{ countElementsDrawn(ElementTypes.Wind) }}
      </div>
      <div class="col btn-group">

        <a class="btn"><i class="bi-plus-lg" role="img" aria-label="addwind"
            v-on:click="addElementToList(ElementTypes.Wind)"></i></a>
        <a class="btn"><i class="bi-dash-lg" role="img" aria-label="removewind"
            v-on:click="removeElementFromList(ElementTypes.Wind)"></i></a>

      </div>
    </div>
    <div class="row">
      <button class="btn btn-primary" v-on:click="drawElements()">Draw elements</button>
    </div>
  </div>
</template>

<script lang="ts">
import { ElementTypes } from '@/game/models/elements/elements';
import { ElementPoolManagerModel, ElementPoolModel } from '@/game/models/element_pool';
import { SocketInstance } from '@/main';
import { DrawElements } from '@/sockets/socketUtils';
import { defineComponent } from 'vue';

const MAX_ALLOWED_ELEMENTS: number = 3;
const MIN_SAGE_MOVEMENTS: number = 2;

export default defineComponent({
  name: 'DrawElementsAction',
  props: {
    elementPoolManager: ElementPoolManagerModel,
    roomId: String,
  },
  enums: {
    ElementTypes,
  },
  data() {
    return {
      sageMovements: MIN_SAGE_MOVEMENTS,
      elementList: [] as Array<ElementTypes>,
    }
  },

  methods: {
    countElementsDrawn(element: ElementTypes): number {
      return this.elementList.filter(el => el == element as ElementTypes).length;
    },
    addElementToList(element: ElementTypes): void {
      const requested: number = this.countElementsDrawn(element);
      if (this.elementList.length >= MAX_ALLOWED_ELEMENTS) return;
      if (this.elementPoolManager == null) return;
      let poolModel: ElementPoolModel;
      switch (element) {
        case ElementTypes.Fire:
          poolModel = this.elementPoolManager.fire;
          break;
        case ElementTypes.Water:
          poolModel = this.elementPoolManager.water;
          break;
        case ElementTypes.Wind:
          poolModel = this.elementPoolManager.wind;
          break;
        case ElementTypes.Earth:
          poolModel = this.elementPoolManager.earth;
          break;
      }
      if ((poolModel.amount - requested - 1) >= 0) {
        this.elementList.push(element as ElementTypes);
      }
    },
    removeElementFromList(element: ElementTypes): void {
      const requested: number = this.countElementsDrawn(element);
      if (requested > 0) {
        this.elementList.splice(this.elementList.indexOf(element as ElementTypes), 1);
      }
    },
    getAvailableElementToDraw(): number {
      return MAX_ALLOWED_ELEMENTS - this.elementList.length;
    },
    getSageMovements(): number {
      return MIN_SAGE_MOVEMENTS + this.getAvailableElementToDraw();
    },
    drawElements(): void {
      const data: DrawElements = {
        roomId: this.roomId!,
        elements: this.elementList
      };
      SocketInstance.emit('drawElements', data)
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

.element-div{
  text-align: center;
}
</style>
