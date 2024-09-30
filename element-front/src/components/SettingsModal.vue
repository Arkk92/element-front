<template>
  <Teleport to="body">

    <div v-if="isOpen" class="modal-backdrop" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>Settings</h2>

        <!-- Music Volume Control Label -->
        <label for="volume" class="volume-label">Music Volume</label>

        <!-- Music Volume Control Slider -->
        <input id="volume" type="range" class="volume-slider" v-model="musicVol" min="0" max="1" step="0.01" @change="updateMusicVolume"/>

        <button class="close-button" @click="closeModal">
          <!-- <span class="button-icon">⚡</span> -->
          Close
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'SettingsModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    musicVolume: {
      type: Number,
      default: 1,
    },
    effectVolume: {
      type: Number,
      default: 1,
    }
  },
  setup(props, { emit }) {
    const musicVol = ref(props.musicVolume);
    const effectVol = ref(props.effectVolume);
    const closeModal = () => {
      emit('close');
    };
    const updateMusicVolume = () => {
      emit('music-volume', musicVol.value)
    }
    return {
      musicVol,
      effectVol,
      closeModal,
      updateMusicVolume

    };
  },
});
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  animation: fadeIn 0.8s forwards;

}

.modal-content {
  background: linear-gradient(135deg, #29293a 0%, #121216 100%);
  padding: 30px;
  border-radius: 15px;
  width: 350px;
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.5), 0 0 30px rgba(255, 0, 255, 0.5);
  text-align: center;
  font-family: 'Cinzel', serif;
  color: #ffffff;
  border: 2px solid #ff7043;
  opacity: 0;
  transform: scale(0.8);
  animation: scaleUp 0.5s 0.3s forwards;
  max-height: 100%;
  overflow-y: hidden;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

@keyframes scaleUp {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

h2 {
  margin-bottom: 20px;
  font-size: 1.75rem;
  color: #f4e0b7;
  text-shadow: 0 0 10px #ff7043, 0 0 20px #ff7043;
}

label {
  font-size: 1.25rem;
  color: #f4e0b7;
  display: block;
  margin-bottom: 10px;
}

.close-button {
  background-color: #ff7043;
  border: none;
  color: white;
  padding: 12px 20px;
  margin-top: 20px;
  font-size: 1.25rem;
  font-weight: bold;
  cursor: pointer;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  transition: background-color 0.3s ease, transform 0.3s ease;
  text-shadow: 0 0 5px #fff, 0 0 10px #ff5722;
  box-shadow: 0 0 20px #ff5722, 0 0 30px #ff7043;
}

.close-button:hover {
  background-color: #ff5722;
  transform: scale(1.05);
}

.button-icon {
  font-size: 1.5rem;
  animation: glow 1.5s infinite alternate;
}

@keyframes glow {
  from {
    text-shadow: 0 0 10px #ffffff, 0 0 20px #ff7043;
  }

  to {
    text-shadow: 0 0 20px #ff7043, 0 0 30px #ff5722;
  }
}

@media screen and (max-width: 785px) {
  h2 {
    margin-bottom: 20px;
    font-size: 1rem !important;
    color: #f4e0b7;
    text-shadow: 0 0 10px #ff7043, 0 0 20px #ff7043;
  }

  label {
    font-size: 1rem !important;
    color: #f4e0b7;
    display: block;
    margin-bottom: 10px;
  }

  .close-button {
    background-color: #ff7043;
    border: none;
    color: white;
    padding: 12px 20px;
    margin-top: 20px;
    font-size: 1rem !important;
    font-weight: bold;
    cursor: pointer;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    transition: background-color 0.3s ease, transform 0.3s ease;
    text-shadow: 0 0 5px #fff, 0 0 10px #ff5722;
    box-shadow: 0 0 20px #ff5722, 0 0 30px #ff7043;
  }

  .button-icon {
    font-size: 1rem !important;
    animation: glow 1.5s infinite alternate;
  }
}

@media screen and (max-height: 500px) {
  .modal-content {
    background: linear-gradient(135deg, #29293a 0%, #121216 100%);
    padding: 30px;
    border-radius: 15px;
    width: 350px;
    box-shadow: 0 0 30px rgba(0, 255, 255, 0.5), 0 0 30px rgba(255, 0, 255, 0.5);
    text-align: center;
    font-family: 'Cinzel', serif;
    color: #ffffff;
    border: 2px solid #ff7043;
    opacity: 0;
    transform: scale(0.8);
    animation: scaleUp 0.5s 0.3s forwards;
    max-height: 100%;
    overflow-y: scroll;
  }
}
</style>
