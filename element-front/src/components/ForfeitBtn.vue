<template>
  <div class="forfeit">
    <!-- Button trigger modal -->
    <div class="rock-button-container" v-if="show || showBtn" data-bs-toggle="modal" data-bs-target="#forfeitModal">
      <RockButton :button-width="'100%'" :button-height="'100%'" :padding="'0px 0px 0px 0px'" :text="'Forfeit'" />
    </div>


    <!-- Modals -->
    <teleport to="body">
      <div class="modal fade" id="forfeitModal" tabindex="-1" aria-labelledby="forfeitModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">

            </div>
            <div class="modal-body">
              <img class="modal-background-image" :src="require('@/assets/header/forfeitModal.png')">
              <div class="image-message">
                <span class="give-up-message">Are you sure you want to give up?</span>
              </div>
              <div class="button-group-center">
                <div class="modal-rock-button-container" v-on:click="giveUpButton()">
                  <RockButton :button-width="'100%'" :button-height="'100%'" :padding="'10px 0px 0px 0px'"
                    :text="'Give up'" />
                </div>
                <div class="modal-rock-button-container" data-bs-dismiss="modal">
                  <RockButton :button-width="'100%'" :button-height="'100%'" :padding="'10px 0px 0px 0px'"
                    :text="'Cancel'" />
                </div>
              </div>
            </div>
            <div class="modal-footer">

            </div>
          </div>




        </div>
      </div>
    </teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { SocketInstance } from '@/main'
import { useCookies } from "vue3-cookies";
import { ForfeitData } from '@/sockets/socketUtils';
import RockButton from './RockButton.vue';

export default defineComponent({
  name: 'ForfeitButton',
  components: {
    RockButton
  },
  setup() {
    const { cookies } = useCookies();
    return { cookies };
  },
  props: {
    show: Boolean,
  },
  data() {
    return {
      showBtn: false,
      showModal: false,
    }
  },
  mounted() {
    if (this.cookies.get('userId') != null) {
      this.showBtn = true;
    }
  },
  methods: {

    giveUpButton() {
      const data: ForfeitData = { userId: this.cookies.get('userId'), roomId: this.cookies.get('roomId') }
      SocketInstance.emit('forfeit', data);
      this.cookies.remove('roomId')
      this.cookies.remove('userId')
      window.location.reload();
    },
    onShowModal() {
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.forfeit {
  height: 100%;
}

.image-message {
  position: absolute;
  width: 70%;
  height: auto;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* Soft Gold color for buttons or specific text */
  background-color: rgba(0, 0, 0, .8);
  /* Ensure background doesn't override */
  border: 1px solid #D4AF37;
  /* Gold border to enhance button design */
  padding: 10px 20px;
  text-align: center;
}

.give-up-message {
  font-family: 'Cinzel', serif;
  color: #D4AF37;
  font-weight: bold;
  font-size: large;
  /* Adding some padding for a better look */
  text-transform: uppercase;
  /* Make the text stand out more */
  letter-spacing: 1px;
  /* Slight letter spacing for a classic feel */
  cursor: pointer;
}

.rock-button-container {
  position: absolute;
  top: 10%;
  right: 5%;
  width: 25%;
  height: 85%;
}

.modal-rock-button-container {
  position: relative;
  margin-top: 2%;
  height: 25%;
}

.modal-background-image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.modal-background-image {
  position: relative;
  width: 100%;
}

.modal-content {
  display: inline-block;
  height: 100%;
}

.modal-body {
  position: relative;
  height: 100%;
  width: 100%;
  padding: 0;
}

.modal-header {
  width: 100%;
  background-image: url("@/assets/header/upperNavHeader3.jpg");
}

.modal-footer {
  width: 100%;
  background-image: url("@/assets/header/footerNavHeader.jpg");
}

.button-group-center {
  display: inline-block;
  position: absolute;
  width: 35%;
  height: 40%;
  top: 80%;
  left: 51%;
  transform: translate(-50%, -50%);
}
</style>
