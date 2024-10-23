<template>
    <Teleport to="body">
        <div v-if="isOpen" class="modal-backdrop" @click="closeModal">
            <div class="modal-content" @click.stop>
                <!-- Winner Announcement -->
                <h2 class="winner-title">{{ winnerName }} Wins!</h2>

                <!-- Trophy or Victory Icon -->
                <div class="victory-icon">
                    🏆
                </div>

                <!-- Return Button -->
                <button class="return-button" @click="returnToMainScreen">
                    Return to Main Screen
                </button>
            </div>
        </div>
    </Teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'WinnerModal',
    props: {
        isOpen: {
            type: Boolean,
            default: false,
        },
        winnerName: {
            type: String,
            required: true,  // Requires the winner's name to display
        },
    },
    setup(props, { emit }) {
        const closeModal = () => {
            emit('close');
        };

        const returnToMainScreen = () => {
            emit('return-main');
        };

        return {
            closeModal,
            returnToMainScreen,
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
    padding: 40px;
    border-radius: 20px;
    width: 400px;
    text-align: center;
    font-family: 'Cinzel', serif;
    color: #ffffff;
    border: 2px solid #ff7043;
    opacity: 0;
    transform: scale(0.8);
    animation: scaleUp 0.5s 0.3s forwards;
    box-shadow: 0 0 40px rgba(0, 255, 255, 0.5), 0 0 40px rgba(255, 0, 255, 0.5);
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

.winner-title {
    font-size: 2.25rem;
    color: #f4e0b7;
    text-shadow: 0 0 15px #ff7043, 0 0 25px #ff7043;
    margin-bottom: 20px;
}

.victory-icon {
    font-size: 4rem;
    margin: 30px 0;
    animation: glowTrophy 1.5s infinite alternate;
}

@keyframes glowTrophy {
    from {
        text-shadow: 0 0 20px #ff7043, 0 0 30px #ff5722;
    }

    to {
        text-shadow: 0 0 30px #ff7043, 0 0 40px #ff5722;
    }
}

.return-button {
    background-color: #ff7043;
    color: white;
    padding: 15px 25px;
    font-size: var(--global-font-size);
    font-weight: bold;
    cursor: pointer;
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 0.3s ease, transform 0.3s ease;
    box-shadow: 0 0 20px #ff5722, 0 0 30px #ff7043;
    border: none;
    text-shadow: 0 0 5px #fff, 0 0 10px #ff5722;
}

.return-button:hover {
    background-color: #ff5722;
    transform: scale(1.05);
}

@media screen and (max-width: 785px) {
    .winner-title {
        font-size: 1rem;
        color: #f4e0b7;
        text-shadow: 0 0 15px #ff7043, 0 0 25px #ff7043;
        margin-bottom: 20px;
    }

    .victory-icon {
        font-size: 1rem;
        margin: 30px 0;
        animation: glowTrophy 1.5s infinite alternate;
    }

    .return-button {
        background-color: #ff7043;
        color: white;
        padding: 15px 25px;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
        border-radius: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: background-color 0.3s ease, transform 0.3s ease;
        box-shadow: 0 0 20px #ff5722, 0 0 30px #ff7043;
        border: none;
        text-shadow: 0 0 5px #fff, 0 0 10px #ff5722;
    }
}
</style>