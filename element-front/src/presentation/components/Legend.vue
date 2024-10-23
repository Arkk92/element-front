<template>
  <div class="legend-container">
    <div class="element-counter-container fire">
      <ElementCounter class="element-counter-wrapper" :element="elementTypes['Fire']" :counter="board?.elementPool.fire.amount" />
    </div>
    <div class="element-counter-container water">
      <ElementCounter class="element-counter-wrapper " :element="elementTypes['Water']" :counter="board?.elementPool.water.amount" />
    </div>
    <div class="element-counter-container earth">
      <ElementCounter class="element-counter-wrapper " :element="elementTypes['Earth']" :counter="board?.elementPool.earth.amount" />
    </div>
    <div class="element-counter-container wind">
      <ElementCounter class="element-counter-wrapper " :element="elementTypes['Wind']" :counter="board?.elementPool.wind.amount" />
    </div>
  </div>
</template>
<script lang="ts">
import ElementCounter from '@/presentation/components/Board/ElementCounter.vue';
import { BoardModel } from '@/domain/game/models/board';
import { ElementTypes } from '@/domain/game/models/elements/elements';
import { defineComponent } from 'vue';


export default defineComponent({
  name: 'LegendContainerComposable',
  components: {
    ElementCounter
  },
  props: {
    board: BoardModel
  },
  data() {
    return {
      elementTypes: {
        'Fire': ElementTypes.Fire,
        'Water': ElementTypes.Water,
        'Earth': ElementTypes.Earth,
        'Wind': ElementTypes.Wind,
      }
    }
  }
})
</script>
<style scoped>
.legend-container {
  position: absolute;
  width: 100%;
  height: 100%;
}
.element-counter-container {
  position: absolute;
  width: 100%;
  max-width: 100%;
  height: 100%;
  max-height: 25%;

}

.fire {
  bottom: 75%;
  max-height: 30%;
}
.water {
  bottom: 50%;
  max-height: 23%;
}
.earth {
  bottom: 25%;
}
.wind {
  bottom: 0%;
  max-height: 30%;
}
</style>