<template>
  <div class="footer-nav-bar">
    <div class="row align-items-center justify-content-between" style="height: 100%;">
      <div class="col-4" align="start">
        <span class="welcome-message mystical-link font-size">Element Online v2.1.0</span>
      </div>
      <div class="col-4" align="center">
        <span class="users-connected mystical-link font-size">Connected Users: {{ activeUsers }}</span>
      </div>
      <div class="col-4 px-5" align="right">
        <span class="users-connected mystical-link font-size">Server Status: </span>
        <span v-if="serverUp" class="server-up">🟢 Online</span>
        <span v-else class="server-down">🔴 Offline</span>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useServerStore } from '../stores/server';

export default defineComponent({
  name: 'UpperNavBarComponent',
  components: {
  },
  data() {
    return {
      username: "Guest",
      forfeitBtnShow: false,
    }
  },
  setup() {
    const serverStore = useServerStore();
    return {
      serverStore
    }
  },
  computed: {
    activeUsers() {
      return this.serverStore.numOfActiveUsers;
    },
    serverUp(): boolean {
      return this.serverStore.serverUp;
    }

  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.footer-nav-bar {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 1000;
  height: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
  height: 6%;
  /* Sets the image height to 60px */
  object-fit: fill;
  /* Ensures the image covers the specified height and width */
}

.welcome-message {
  padding-left: 50px;
}

.mystical-link {
  position: relative;
  font-family: 'Palatino', 'Garamond', 'Georgia', 'Times New Roman', serif;
  color: #d4af37;
  /* Golden mystical color */
  text-decoration: none;
  transition: color 0.3s ease, text-shadow 0.3s ease;
  text-shadow: 0 0 8px rgba(212, 175, 55, 0.8), 0 0 15px rgba(255, 255, 255, 0.2);
  letter-spacing: 1px;
  cursor: default;
}

.server-up {
  color: #28a745;
}

.server-down {
  color: #dc3545;
}

.font-size {
  font-size: 1rem;
}

@media screen and (max-width: 785px) {
  .font-size {
    font-size: 1rem;
  }
}
</style>
