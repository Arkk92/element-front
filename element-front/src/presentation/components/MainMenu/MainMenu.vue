<template>
  <div class="main-menu-wrapper">
    <!-- <a href="https://ratherdashinggames.com/games/element.html" target="_blank">Find the rules here!</a> -->
    <ul class="menu-container">
      <li class="menu-item">
        <QueueVue :game-type="'Quick'" class="play-button" />
      </li>
      <li class="menu-item">
        <QueueVue :game-type="'Ranked'" class="play-button" />
      </li>
      <li class="menu-item">
        <QueueVue :game-type="'Custom'" class="play-button" />
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import QueueVue from './Queue.vue';

export default defineComponent({
  name: 'MainMenuComponent',
  components: {
    QueueVue
  }
})
</script>
<style lang="css" scoped>
ul {
  list-style-type: none;
}

.main-menu-wrapper {
  position: absolute;
  width: 100%;
  height: 30%;
  top: 65%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0) 100%);
}

.menu-container {
  position: relative;
  height: 100%;
  padding-top: 1%;
  padding-bottom: 3%;
}

.menu-item {
  position: relative;
  height: 28%;
  top: 5%;
  width: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 1%;

}
</style>