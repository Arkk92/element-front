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
      <div class="col">
        Fire:
      </div>
      <div class="col-3">
        <div class="circle fire"></div>
      </div>
      <div class="col">
        x{{ countElementsDrawn('fire') }}
      </div>
      <div class="col btn-group">

        <a class="btn"><i class="bi-plus-lg" role="img" aria-label="addFire"
            v-on:click="addElementToList('fire')"></i></a>
        <a class="btn"><i class="bi-dash-lg" role="img" aria-label="removeFire"
            v-on:click="removeElementFromList('fire')"></i></a>

      </div>
    </div>
    <div class="row align-items-center">
      <div class="col">
        Water:
      </div>
      <div class="col-3">
        <div class="circle water"></div>
      </div>
      <div class="col">
        x{{ countElementsDrawn('water') }}
      </div>
      <div class="col btn-group">

        <a class="btn"><i class="bi-plus-lg" role="img" aria-label="addwater"
            v-on:click="addElementToList('water')"></i></a>
        <a class="btn"><i class="bi-dash-lg" role="img" aria-label="removewater"
            v-on:click="removeElementFromList('water')"></i></a>

      </div>
    </div>
    <div class="row align-items-center">
      <div class="col">
        Earth:
      </div>
      <div class="col-3">
        <div class="circle earth"></div>
      </div>
      <div class="col">
        x{{ countElementsDrawn('earth') }}
      </div>
      <div class="col btn-group">

        <a class="btn"><i class="bi-plus-lg" role="img" aria-label="addearth"
            v-on:click="addElementToList('earth')"></i></a>
        <a class="btn"><i class="bi-dash-lg" role="img" aria-label="removeearth"
            v-on:click="removeElementFromList('earth')"></i></a>

      </div>
    </div>
    <div class="row align-items-center">
      <div class="col">
        Wind:
      </div>
      <div class="col-3">
        <div class="circle wind"></div>
      </div>
      <div class="col">
        x{{ countElementsDrawn('wind') }}
      </div>
      <div class="col btn-group">

        <a class="btn"><i class="bi-plus-lg" role="img" aria-label="addwind"
            v-on:click="addElementToList('wind')"></i></a>
        <a class="btn"><i class="bi-dash-lg" role="img" aria-label="removewind"
            v-on:click="removeElementFromList('wind')"></i></a>

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

type Elements = 'fire' | 'water' | 'wind' | 'earth'

const MAX_ALLOWED_ELEMENTS: number = 3;
const MIN_SAGE_MOVEMENTS: number = 2;

export default defineComponent({
  name: 'DrawElementsAction',
  props: {
    elementPoolManager: ElementPoolManagerModel,
    roomId: String,
  },
  data() {
    return {
      sageMovements: MIN_SAGE_MOVEMENTS,
      elementList: [] as Array<ElementTypes>,
    }
  },

  methods: {
    countElementsDrawn(element: Elements): number {
      return this.elementList.filter(el => el == element as ElementTypes).length;
    },
    addElementToList(element: Elements): void {
      const requested: number = this.countElementsDrawn(element);
      if (this.elementList.length >= MAX_ALLOWED_ELEMENTS) return;
      if (this.elementPoolManager == null) return;
      let poolModel: ElementPoolModel;
      switch (element) {
        case 'fire':
          poolModel = this.elementPoolManager.fire;
          break;
        case 'water':
          poolModel = this.elementPoolManager.water;
          break;
        case 'wind':
          poolModel = this.elementPoolManager.wind;
          break;
        case 'earth':
          poolModel = this.elementPoolManager.earth;
          break;
      }
      if ((poolModel.amount - requested - 1) >= 0) {
        this.elementList.push(element as ElementTypes);
      }
    },
    removeElementFromList(element: Elements): void {
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
