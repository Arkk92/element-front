<template>
  <Teleport to="body">

    <div v-if="isOpen" class="modal-backdrop" @click="closeModal">
      <div v-if="!gameFound" class="modal-content" @click.stop>
        <h2>Looking for game...</h2>
        <button class="cancel-button" @click="cancelSearch">
          <span class="button-icon">❌</span>
          Cancel
        </button>

      </div>
      <div v-else class="modal-content" @click.stop>
        <h2>Game found</h2>
        <!-- Join Game Button -->
        <button class="join-game-button" @click="joinGame">
          <span class="button-icon">⚔️</span>
          Join
        </button>
        <button class="cancel-button" @click="joinGame">
          <span class="button-icon">❌</span>
          Cancel
        </button>

      </div>
    </div>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PlayMenuModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    gameFound: {
      type: Boolean,
      default: false,
    }
  },
  setup(props, { emit }) {
    const closeModal = () => {
      emit('close');
    };

    const joinGame = () => {
      emit('join-game');
    };

    const cancelSearch = () => {
      emit('cancel-search')
    }

    return {
      closeModal,
      joinGame,
      cancelSearch,
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

@media screen and (max-width: 785px) {
  h2 {
    margin-bottom: 20px;
    font-size: 1rem;
    color: #f4e0b7;
    text-shadow: 0 0 10px #ff7043, 0 0 20px #ff7043;
  }


  .join-game-button {
    background-color: #ff7043;
    border: none;
    color: white;
    padding: 12px 20px;
    margin-top: 20px;
    font-size: 1rem;
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

  .cancel-button {
    background-color: #ff7043;
    border: none;
    color: white;
    padding: 12px 20px;
    margin-top: 20px;
    font-size: 1rem;
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
    font-size: 1rem;
    animation: glow 1.5s infinite alternate;
  }
}

h2 {
  margin-bottom: 20px;
  font-size: 1.75rem;
  color: #f4e0b7;
  text-shadow: 0 0 10px #ff7043, 0 0 20px #ff7043;
}


.join-game-button {
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

.cancel-button {
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
  font-size: 1.25rem;
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
</style>
