<template>
  <div type="button" class="rock-button" :style="`width: ${computedWidth}; height: ${computedHeight};`"
    v-on:click="onButtonPressed()">
    <div type="button" class="button-container">
      <img class="rock-button-image" src="@/assets/header/StoneButton.png">
      <a type="button" class="button-overlay">{{ text }}</a>
      <i class="button-overlay" :class="icon" role="img" aria-label="rock-button-icon"></i>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'RockButtonComponent',
  components: {
  },
  setup() {

  },
  props: {
    text: String,
    buttonWidth: String,
    buttonHeight: String,
    icon: String
  },
  data() {
    return {
      computedWidth: '100px',
      computedHeight: '50px',
    }
  },
  mounted() {
    this.computedWidth = this.buttonWidth!;
    this.computedHeight = this.buttonHeight!;
  },
  methods: {
    onButtonPressed() {
      this.$emit('clicked');
    }
  }
})
</script>
<style scoped>
.rock-button {
  position: relative;
  --width: 100%;
  --height: 100%;
}

.rock-button-image {
  border-radius: 15px;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.button-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@media screen and (max-width: 785px) {
  .button-overlay {
    position: absolute;
    color: black;
    font-size: 1rem;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    z-index: 2;
  }
}

.button-overlay {
  position: absolute;
  color: black;
  font-size: 1.5625rem;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  z-index: 2;
}
</style>