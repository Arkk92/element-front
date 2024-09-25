<template>
  <Teleport to="body">

    <div v-if="isOpen" class="modal-backdrop" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2 v-if="isCompetitive">Ranked Match</h2>
        <h2 v-else>Quick Play</h2>

        <div v-if="!isCompetitive" class="input-container">
          <!-- Label for Username Input -->
          <label for="username" class="input-label">Enter Your Username</label>

          <!-- Username Input Field -->
          <input id="username" type="text" class="input-box" v-model="username" placeholder="Your name here..." />
        </div>

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
    isCompetitive: {
      type: Boolean,
      default: false,
    }
  },
  setup(props, { emit }) {
    const selectedPlayers = ref(2);
    const username = ref('');

    const closeModal = () => {
      emit('close');
    };

    const startGame = () => {
      if (!props.isCompetitive) {
        emit('username', username.value);
      }
      emit('start-game', selectedPlayers.value);
    };



    return {
      selectedPlayers,
      username,
      closeModal,
      startGame,
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

.player-selector {
  margin: 10% 0;
}

label {
  font-size: 1.25rem;
  color: #f4e0b7;
  display: block;
  margin-bottom: 10px;
}

.select-wrapper {
  position: relative;
}

select {
  padding: 10px 14px;
  font-size: 1.125rem;
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
  font-size: 1rem;
}

select option span {
  font-size: 1.125rem;
  margin-right: 5px;
}

.start-game-button {
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

.start-game-button:hover {
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

.input-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
  position: relative;
}

.input-label {
  font-size: 1.125rem;
  font-weight: bold;
  color: #f4e0b7;
  margin-bottom: 10px;
  text-shadow: 0 0 10px #ff7043, 0 0 20px #ff7043;
  font-family: 'Cinzel', serif;
}

.input-box {
  width: 300px;
  padding: 12px;
  font-size: 1rem;
  border: 2px solid #ff7043;
  border-radius: 8px;
  background-color: #29293a;
  color: #fff;
  outline: none;
  text-align: center;
  text-shadow: 0 0 5px #fff;
  box-shadow: 0 0 10px #ff7043, 0 0 15px rgba(255, 112, 67, 0.6);
  transition: all 0.3s ease;
}

.input-box::placeholder {
  color: #bbb;
  text-align: center;
  opacity: 0.7;
}

.input-box:focus {
  border-color: #ff5722;
  box-shadow: 0 0 15px #ff5722, 0 0 20px rgba(255, 112, 67, 0.9);
  transform: scale(1.05);
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

  select {
    padding: 10px 14px;
    font-size: 1rem !important;
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
    font-size: 1rem !important;
  }

  select option span {
    font-size: 1rem !important;
    margin-right: 5px;
  }

  .start-game-button {
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

  .input-label {
    font-size: 1rem !important;
    font-weight: bold;
    color: #f4e0b7;
    margin-bottom: 10px;
    text-shadow: 0 0 10px #ff7043, 0 0 20px #ff7043;
    font-family: 'Cinzel', serif;
  }

  .input-box {
    width: 300px;
    padding: 12px;
    font-size: 1rem !important;
    border: 2px solid #ff7043;
    border-radius: 8px;
    background-color: #29293a;
    color: #fff;
    outline: none;
    text-align: center;
    text-shadow: 0 0 5px #fff;
    box-shadow: 0 0 10px #ff7043, 0 0 15px rgba(255, 112, 67, 0.6);
    transition: all 0.3s ease;
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
