<template>
  <div class="settings">
    <!-- Button trigger modal -->
    <div>
      <NavButton v-on:click="isMenuOpen = true" :text="'Settings'" :disabled="true"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useCookies } from "vue3-cookies";
import NavButton from '@/components/NavButton.vue';


export default defineComponent({
  name: 'SettingsComponent',
  components: {
    NavButton,
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

    }
  },
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
