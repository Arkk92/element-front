<template>
  <div class="upper-nav-bar">
    <div class="welcome-message-container">
      <span class="welcome-message mystical-link">Welcome, {{ username }}</span>
    </div>
    <div class="menu-container">
      <NavButton v-if="menuButtonShow" v-on:click="isMenuOpen = true" :text="'Menu'" />
    </div>
  </div>
  <InGameMenuModal :isOpen="isMenuOpen" @close="isMenuOpen = false" @select="handleSelect" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Emitter, SocketInstance } from '@/main';
import NavButton from '@/components/NavButton.vue';
import InGameMenuModal from '@/components/InGameMenuModal.vue';
import { ForfeitData } from '@/sockets/socketUtils';
import { useCookies } from 'vue3-cookies';

type InGameMenuSelectOptions = 'Forfeit' | 'Options' | 'Exit';

export default defineComponent({
  name: 'UpperNavBarComponent',
  components: {
    NavButton,
    InGameMenuModal
  },
  setup() {
    const { cookies } = useCookies();
    return { cookies };
  },
  data() {
    return {
      username: "Guest",
      menuButtonShow: false,
      isMenuOpen: false,
    }
  },
  mounted() {
    Emitter.on('GameAccepted', () => {
      this.menuButtonShow = true;
    })
    Emitter.on('restart', () => {
      this.menuButtonShow = false;
    })
  },
  methods: {
    handleSelect(option: InGameMenuSelectOptions) {
      console.log('Selected option:', option);
      switch (option) {
        case 'Forfeit':
          this.forfeit()
          break;
        case 'Options':
          break;

        default:
          /* Do nothing */
          break;
      }
      this.isMenuOpen = false;
    },
    forfeit() {
      const data: ForfeitData = { userId: this.cookies.get('userId'), roomId: this.cookies.get('roomId') }
      SocketInstance.emit('forfeit', data);
      this.cookies.remove('roomId')
      this.cookies.remove('userId')
      this.menuButtonShow = false;
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.upper-nav-bar {
  position: fixed;
  width: 100%;
  z-index: 1000;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
  height: 6%;
  /* object-fit: fill; */
  /* Ensures the image covers the specified height and width */
}

.welcome-message-container {
  position: absolute;
  width: 33%;
  height: 100%;
  top: 25%;
}

.menu-container {
  position: absolute;
  width: 10%;
  height: 100%;
  right: 0%;
}

.forfeit-btn-alignment {
  position: absolute;
  width: 100%;
  height: 100%;
  right: 0;
}

.welcome-message {
  padding-left: 50px;

}

.forfeit-button-column {
  padding-right: 50px;
  height: 100%;
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
  cursor: default;
}

@media screen and (max-width: 785px) {
  .mystical-link {
    position: relative;
    font-family: 'Palatino', 'Garamond', 'Georgia', 'Times New Roman', serif;
    font-size: 1rem;
    color: #d4af37;
    /* Golden mystical color */
    text-decoration: none;
    transition: color 0.3s ease, text-shadow 0.3s ease;
    text-shadow: 0 0 8px rgba(212, 175, 55, 0.8), 0 0 15px rgba(255, 255, 255, 0.2);
    letter-spacing: 1px;
    cursor: default;
  }
}
</style>
