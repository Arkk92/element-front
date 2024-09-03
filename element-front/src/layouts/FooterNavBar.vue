<template>
  <div class="footer-nav-bar">
    <div class="row align-items-center" style="height: 100%;">
      <div class="col">
        <span class="welcome-message message">Element Online v2.0.0</span>
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
.footer-nav-bar{
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 2000;
  height: 100%;
  background-image: url("@/assets/header/footerNavHeader.jpg");
  background-position: center;
  height: 6%; /* Sets the image height to 60px */
  object-fit: fill; /* Ensures the image covers the specified height and width */
}

.welcome-message {
  padding-left: 50px;

}

.message {
  font-family: 'Cinzel', serif;
  color: #D4AF37;
  font-weight: bold;
  font-size: large;
  /* Soft Gold color for buttons or specific text */

  /* Ensure background doesn't override */
  
  /* Gold border to enhance button design */
  padding: 10px 20px;
  /* Make the text stand out more */
  letter-spacing: 1px;
  /* Slight letter spacing for a classic feel */
  cursor: pointer;
}
</style>
