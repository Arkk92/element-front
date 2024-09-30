<template>
  <div class="settings">
    <!-- Button trigger modal -->
    <div>
      <NavButton v-on:click="isMenuOpen = true" :text="'Settings'" />
    </div>
  </div>
  <SettingsModal :isOpen="isMenuOpen" @close="isMenuOpen = false" :musicVolume="musicVolume" @music-volume="updateMusicVolume"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useCookies } from "vue3-cookies";
import NavButton from '@/components/NavButton.vue';
import SettingsModal from '@/components/SettingsModal.vue';
import { SoundManager } from '@/services/soundManager';


export default defineComponent({
  name: 'SettingsComponent',
  components: {
    NavButton,
    SettingsModal
  },
  setup() {
    const { cookies } = useCookies();

    return {
      cookies
    };
  },
  data() {
    return {
      isMenuOpen: false,
      musicVolume: 1,
      effectVolume: 1,
    }
  },
  mounted() {
      this.musicVolume = SoundManager.getMusicVolume();
  },
  methods: {
    updateMusicVolume(volume: number){
      SoundManager.setMusicVolume(volume);
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.settings {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
