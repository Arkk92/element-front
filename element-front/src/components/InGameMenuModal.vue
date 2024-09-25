<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-backdrop" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>Game Menu</h2>

        <!-- Modal Buttons -->
        <div class="buttons-wrapper">
          <button class="action-button forfeit" @click="handleAction('Forfeit')">
            💀 Forfeit
          </button>
          <button class="action-button options" @click="handleAction('Options')">
            ⚙️ Options
          </button>
          <button class="action-button exit" @click="handleAction('Exit')">
            ❌ Exit
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'InGameMenuModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const closeModal = () => {
      emit('close');
    };

    const handleAction = (action: string) => {
      emit('select', action);
    };

    return {
      closeModal,
      handleAction,
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

  .action-button {
    background-color: #29293a;
    color: #ffffff;
    padding: 12px 20px;
    font-size: 1rem;
    border-radius: 10px;
    border: 2px solid #ff7043;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

h2 {
  margin-bottom: 20px;
  font-size: 1.75rem;
  color: #f4e0b7;
  text-shadow: 0 0 10px #ff7043, 0 0 20px #ff7043;
}

.buttons-wrapper {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.action-button {
  background-color: #29293a;
  color: #ffffff;
  padding: 12px 20px;
  font-size: 1.25rem;
  border-radius: 10px;
  border: 2px solid #ff7043;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-button:hover {
  transform: scale(1.05);
}

.forfeit {
  text-shadow: 0 0 5px #ff7043, 0 0 10px #ff5722;
}

.options {
  text-shadow: 0 0 5px #3a9df2, 0 0 10px #007bff;
}

.exit {
  text-shadow: 0 0 5px #ff3a3a, 0 0 10px #ff0000;
}

.action-button:hover {
  box-shadow: 0 0 15px #ff7043, 0 0 20px #ff5722;
}
</style>
