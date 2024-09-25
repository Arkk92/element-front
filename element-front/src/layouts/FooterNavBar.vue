<template>
  <div class="footer-nav-bar">
    <div class="row align-items-center" style="height: 100%;">
      <div class="col">
        <span class="welcome-message mystical-link font-size">Element Online v2.0.0</span>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

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
  mounted() {

  },
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
  /* background-image: url("@/assets/header/footerNavHeader.jpg");
  background-position: center; */
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

.font-size {
  font-size: 1.5rem;
}

@media screen and (max-width: 785px) {
  .font-size {
    font-size: 1rem;
  }
}
</style>
