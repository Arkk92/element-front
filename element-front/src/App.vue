<template>
  <div id="app">

    <PreloadScreen>
      <div v-if="isPortrait" class="landscape-warning">
        Please rotate your device to landscape mode.
      </div>
      <div v-else class="app-content">
        <UpperNavBarVue />
        <RoomViewVue />
        <FooterNavBarVue />
      </div>
    </PreloadScreen>
  </div>

</template>

<script lang="ts">
import RoomViewVue from './views/RoomView.vue';
import UpperNavBarVue from './layouts/UpperNavBar.vue';
import FooterNavBarVue from './layouts/FooterNavBar.vue';

import { ref, onMounted, onBeforeUnmount, defineComponent } from 'vue';
import PreloadScreen from './views/PreloadScreen.vue';

export default defineComponent({
  setup() {
    const isPortrait = ref(false);

    const checkOrientation = () => {
      isPortrait.value = window.innerHeight > window.innerWidth;
    };

    onMounted(() => {
      checkOrientation();
      window.addEventListener('resize', checkOrientation);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', checkOrientation);
    });

    return {
      isPortrait
    };
  },
  components: {
    RoomViewVue,
    UpperNavBarVue,
    FooterNavBarVue,
    PreloadScreen
  }
});
</script>
<style scoped>
.landscape-warning {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: black;
  color: white;
  font-size: 24px;
  text-align: center;
}
</style>