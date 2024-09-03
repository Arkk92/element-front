<template>
  <div class="upper-nav-bar">
    <div class="welcome-message-container">
      <span class="welcome-message message">Welcome, {{ username }}</span>
    </div>
    <div class="queue-container">
      <QueueVue />
    </div>
    <div class="forfeit-container">
      <ForfeitBtn :show="forfeitBtnShow" class="forfeit-btn-alignment"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import QueueVue from '@/components/Queue.vue';
import { Emitter } from '@/main';
import ForfeitBtn from '@/components/ForfeitBtn.vue';

export default defineComponent({
  name: 'UpperNavBarComponent',
  components: {
    QueueVue,
    ForfeitBtn
  },
  data() {
    return {
      username: "Guest",
      forfeitBtnShow: false,
    }
  },
  mounted() {
    Emitter.on('usernameChange', (username) => {
      this.username = username as string;
      this.forfeitBtnShow = true;
    })
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.upper-nav-bar {
  position: fixed;
  width: 100%;
  z-index: 1000;
  background-image: url("@/assets/header/upperNavHeader3.jpg");
  background-position: center;
  height: 6%;
  object-fit: fill;
  /* Ensures the image covers the specified height and width */
}
.welcome-message-container {
  position: absolute;
  width: 33%;
  height: 100%;
  top: 25%;
}
.queue-container {
  position: absolute;
  width: 33%;
  height: 100%;
  left: 33%;
}

.forfeit-container {
  position: absolute;
  width: 33%;
  height: 100%;
  right: 0%;
}
.forfeit-btn-alignment{
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

.message {
  font-family: 'Cinzel', serif;
  color: #D4AF37;
  font-weight: bold;
  font-size: large;
  /* Soft Gold color for buttons or specific text */
  background-color: rgba(0, 0, 0, .3);
  /* Ensure background doesn't override */

  /* Gold border to enhance button design */
  padding: 10px 20px;
  /* Make the text stand out more */
  letter-spacing: 1px;
  /* Slight letter spacing for a classic feel */
  cursor: pointer;
}
</style>
