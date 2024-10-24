<template>
  <div class="background">
    <div class="title-wrapper">
      <img class="title-img" src="/assets/title.png">
    </div>
    <div class="background-video-div">
      <video class="background-video" autoplay muted loop id="background-video" playbackRate="1">
        <source src="/assets/mystical-background.mp4" type="video/mp4">
      </video>
    </div>
  </div>

</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { SoundManager } from '@/services/soundManager';

export default defineComponent({
  name: 'BackgroundComponent',
  mounted() {
    SoundManager.playBackgroundMusic('backgroundMusic');
  }
})

</script>
<style lang="css" scoped>
.background {
  display: block;
}

.title-wrapper {
  position: absolute;
  width: 30%;
  height: 40%;
  top: 30%;
  left: 50%;
  transform: translate(-46.5%, -50%);
  z-index: 1;
}

.title-img {
  position: relative;
  height: 100%;
  width: 100%;
}

.background-video-div {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  z-index: 0;
}

.background-video {
  position: relative;
  top: 0;
  min-width: 110%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  min-height: 80%;
}
</style>