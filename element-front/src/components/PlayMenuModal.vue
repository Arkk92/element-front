<template>
  <Teleport to="body">

    <div v-if="isOpen" class="modal-backdrop" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>Play Menu</h2>
        
        <!-- Player Selector -->
        <div class="player-selector">
          <label for="num-players">Select type of match:</label>
          <div class="select-wrapper">
            <select v-model="selectedPlayers" id="num-players">
              <option value="2">
                <span>🔥💧</span> Duel (1 vs 1)
              </option>
              <option value="3">
                <span>🔥💧🌿</span> Tri-Royale (1 vs 2)
              </option>
              <option value="4">
                <span>🔥💧🌿💨</span> Full Royale (1 vs 3)
              </option>
            </select>
          </div>
        </div>
  
        <!-- Start Game Button -->
        <button class="start-game-button" @click="startGame">
          <span class="button-icon">⚡</span> 
          Play
        </button>
  
        <!-- <ul class="menu-options">
          <li @click="selectOption('Options')">Options</li>
          <li @click="selectOption('Exit')">Exit</li>
        </ul> -->
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'PlayMenuModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const selectedPlayers = ref(2);

    const closeModal = () => {
      emit('close');
    };

    const startGame = () => {
      emit('start-game', selectedPlayers.value);
    };

    const selectOption = (option: string) => {
      emit('select', option);
    };

    return {
      selectedPlayers,
      closeModal,
      startGame,
      selectOption,
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
  font-size: 28px;
  color: #f4e0b7;
  text-shadow: 0 0 10px #ff7043, 0 0 20px #ff7043;
}

.player-selector {
  margin: 25px 0;
}

label {
  font-size: 20px;
  color: #f4e0b7;
  display: block;
  margin-bottom: 10px;
}

.select-wrapper {
  position: relative;
}

select {
  padding: 10px 14px;
  font-size: 18px;
  background-color: #29293a;
  color: #ffffff;
  border-radius: 8px;
  border: 2px solid #ff7043;
  text-align: center;
  outline: none;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  appearance: none;
  width: 100%;
}

select option {
  padding: 10px;
  font-size: 16px;
}

select option span {
  font-size: 18px;
  margin-right: 5px;
}

.start-game-button {
  background-color: #ff7043;
  border: none;
  color: white;
  padding: 12px 20px;
  margin-top: 20px;
  font-size: 20px;
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

.start-game-button:hover {
  background-color: #ff5722;
  transform: scale(1.05);
}

.button-icon {
  font-size: 24px;
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

ul.menu-options {
  list-style: none;
  padding: 0;
  margin: 30px 0 0;
}

ul.menu-options li {
  margin: 10px 0;
  padding: 12px;
  cursor: pointer;
  border: 2px solid transparent;
  font-size: 18px;
  font-weight: bold;
  transition: all 0.3s ease;
  color: #ffffff;
}

ul.menu-options li:hover {
  border: 2px solid #ff7043;
  color: #ff7043;
  text-shadow: 0 0 5px #ff7043, 0 0 10px #ff5722;
  transform: scale(1.05);
}
</style>
