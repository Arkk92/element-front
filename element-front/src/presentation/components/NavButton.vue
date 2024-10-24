<template>
  <div type="button" class="nav-button" v-on:click="onButtonPressed()">
    <a type="button" :class="disabled ? 'disabled-link' : 'mystical-link'" @mouseenter="playSound">{{ text }}</a>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useSoundStore } from '@/presentation/stores/sound';

export default defineComponent({
  name: 'NavButtonComponent',
  components: {
  },
  setup() {
    const soundStore = useSoundStore();
    return { soundStore }
  },
  props: {
    text: String,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

    }
  },
  mounted() {
  },
  methods: {
    onButtonPressed() {
      this.$emit('clicked');
    },
    playSound() {
      if (!this.disabled) {
        this.soundStore.playSound('hoverNav');
      }
    }

  }
})
</script>
<style scoped>
.nav-button {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0%;
  left: 0%;
  display: flex;
  justify-content: center;
  /* Horizontal centering */
  align-items: center;
  /* Vertical centering */
}

@media screen and (max-width: 785px),
screen and (max-height: 400px) {
  .mystical-link {
    position: relative;
    font-family: 'Palatino', 'Garamond', 'Georgia', 'Times New Roman', serif;
    font-size: 1rem !important;
    color: #d4af37;
    /* Golden mystical color */
    text-decoration: none;
    transition: color 0.3s ease, text-shadow 0.3s ease;
    text-shadow: 0 0 8px rgba(212, 175, 55, 0.8), 0 0 15px rgba(255, 255, 255, 0.2);
    letter-spacing: 1px;
  }

  .disabled-link {
    font-family: 'Palatino', 'Garamond', 'Georgia', 'Times New Roman', serif;
    font-size: 1rem !important;
    color: #a9a9a9;
    /* Grey color to indicate disabled state */
    text-decoration: none;
    pointer-events: none;
    /* Disables clicks */
    opacity: 0.6;
    /* Makes it look visually inactive */
    cursor: not-allowed;
    /* Shows 'not-allowed' cursor on hover */
    text-shadow: none;
    /* Removes any glow or shadow */
  }
}

.mystical-link {
  position: relative;
  font-family: 'Palatino', 'Garamond', 'Georgia', 'Times New Roman', serif;
  font-size: 1.5rem;
  color: #d4af37;
  /* Golden mystical color */
  text-decoration: none;
  transition: color 0.3s ease, text-shadow 0.3s ease;
  text-shadow: 0 0 8px rgba(212, 175, 55, 0.8), 0 0 15px rgba(255, 255, 255, 0.2);
  letter-spacing: 1px;
}

.mystical-link:hover {
  text-decoration: underline;
  color: #f0e68c;
  /* Lighter golden on hover */
  text-shadow: 0 0 12px rgba(255, 215, 0, 1), 0 0 20px rgba(255, 255, 255, 0.6);
}

.disabled-link {
  font-family: 'Palatino', 'Garamond', 'Georgia', 'Times New Roman', serif;
  font-size: 1.5rem;
  color: #a9a9a9;
  /* Grey color to indicate disabled state */
  text-decoration: none;
  pointer-events: none;
  /* Disables clicks */
  opacity: 0.6;
  /* Makes it look visually inactive */
  cursor: not-allowed;
  /* Shows 'not-allowed' cursor on hover */
  text-shadow: none;
  /* Removes any glow or shadow */
}

.disabled-link:hover {
  text-decoration: none;
  /* Prevent underline on hover */
  color: #a9a9a9;
  /* Keep grey color on hover */
}
</style>