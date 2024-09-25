<template>
    <div class="main-menu-wrapper">
        <!-- <a href="https://ratherdashinggames.com/games/element.html" target="_blank">Find the rules here!</a> -->
        <div class="menu-container">
          <div class="menu-item">
            <QueueVue :is-ranked="false" class="play-button"/>
          </div>
          <div class="menu-item">
            <QueueVue :is-ranked="true" class="play-button"/>
          </div>
          <div class="menu-item">
            <Settings class="settings-button"/>
          </div>
          <div class="menu-item">
            <AboutUs class="about-us-button"/>
          </div>
          
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import QueueVue from './Queue.vue';
import Settings from './Settings.vue';
import AboutUs from './AboutUs.vue';

export default defineComponent({
    name: 'MainMenuComponent',
    components: {
      QueueVue,
      Settings,
      AboutUs
    }
})
</script>
<style lang="css" scoped>
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
  height: 20%;
  top: 5%;
  width: 20%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 1%;
  
}

.play-button {
  /* top: 15%; */
  /* left: 48%; */
}

.settings-button {
  /* top: 45%; */
  /* left: 47%; */
}

.about-us-button {
  /* top: 70%; */
  /* left: 46.5%; */
}

</style>