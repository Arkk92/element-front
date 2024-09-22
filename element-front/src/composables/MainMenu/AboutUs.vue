<template>
  <div class="about-us">
    <!-- Button trigger modal -->
    <div>
      <NavButton v-on:click="isMenuOpen = true" :text="'About Us'" :disabled="true"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useCookies } from "vue3-cookies";
import NavButton from '@/components/NavButton.vue';

export default defineComponent({
  name: 'AboutUsComponent',
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
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.about-us {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
