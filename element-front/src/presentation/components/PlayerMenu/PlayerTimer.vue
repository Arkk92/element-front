<template>
    <div class="player-timer">
        <div class="player-timer-container">
            <div class="timer-digits" :class="getTimerClass()">
                {{ remainingTime }}
            </div>
            <div v-if="isWarningTime" class="spinning-sand-clock pulse-animation">
                ⌛
            </div>
            <div v-else class="spinning-sand-clock">
                ⏳
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { useRoomStore } from '@/presentation/stores/room';
import { defineComponent } from 'vue';

const WARNING_TIME_THRESHOLD = { minutes: 0, seconds: 10 };
const DANGER_TIME_THRESHOLD = { minutes: 0, seconds: 5 };

function getTimeRemaining(endtime: Date) {
    var t = Date.parse(endtime.toISOString()) - Date.parse(new Date().toISOString());
    const seconds = Math.floor((t / 1000) % 60);
    const minutes = Math.floor((t / 1000 / 60) % 60);
    return {
        'total': t,
        'minutes': minutes,
        'seconds': seconds
    };
}

export default defineComponent({
    name: 'PlayerTimerComponent',
    components: {
    },
    setup() {
        const roomStore = useRoomStore()
        return { roomStore }
    },
    data() {
        return {
            deadline: new Date(),
            interval: 0,
            stop: false,
            remainingMinutes: 0,
            remainingSeconds: 0
        }
    },
    mounted() {
        this.interval = setInterval(this.updateTimer, 1000);
        this.startTimer(this.remainingTurnTime)
        this.updateTimer();

    },
    methods: {
        updateTimer() {
            if (this.stop) return;
            const t = getTimeRemaining(this.deadline);
            if (t.total <= 0) {
                this.onTimeOut();
                return;
            }
            this.remainingMinutes = t.minutes;
            this.remainingSeconds = t.seconds;
        },
        onTimeOut() {
            this.stopTimer();
        },
        startTimer(time: number) {
            this.deadline = new Date(Date.parse(new Date().toISOString()) + time);
            this.stop = false;
        },
        stopTimer() {
            this.stop = true;
        },
        getTimerClass(): string {
            if (this.isDangerTime) {
                return 'danger-time-color pulse-animation'
            } else if (this.isWarningTime) {
                return 'warning-time-color'
            } else {
                return ''
            }
        },
    },
    computed: {
        remainingTime(): string {
            const minutes = ('0' + this.remainingMinutes).slice(-2);
            const seconds = ('0' + this.remainingSeconds).slice(-2);
            return `${minutes}:${seconds}`;
        },
        isWarningTime(): boolean {
            return (this.remainingMinutes == WARNING_TIME_THRESHOLD.minutes) && (this.remainingSeconds < WARNING_TIME_THRESHOLD.seconds);
        },
        isDangerTime(): boolean {
            return (this.remainingMinutes == DANGER_TIME_THRESHOLD.minutes) && (this.remainingSeconds < DANGER_TIME_THRESHOLD.seconds);
        },
        remainingTurnTime(): number {
            return this.roomStore.model.game.turn.remainingTurnTime;
        }
    },
    watch: {
        remainingTurnTime() {
            this.startTimer(this.remainingTurnTime)
            this.updateTimer();
        }
    }
})
</script>
<style scoped>
.player-timer {
    position: absolute;
    height: 100%;
    width: 100%;
}

.player-timer-container {
    position: absolute;
    display: block;
    top: 0;
    right: 0;
    width: fit-content;
    height: fit-content;
}

.timer-digits {
    position: absolute;
    color: yellow;
    width: fit-content;
    height: fit-content;
    font-size: 2.5rem;
    right: 0;
    transform: translateX(-5%);
    font-weight: bold;
    -webkit-text-stroke: 1px black;
    /* width and color */
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    z-index: 2;

}

.warning-time-color {
    color: orange;
}

.danger-time-color {
    color: red;
}

.spinning-sand-clock {
    position: absolute;
    right: 0;
    top: 2.5rem;
    font-size: 2rem;
    width: fit-content;
    animation-name: spin;
    animation-duration: 5000ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
}

.pulse-animation {
    animation: pulse 1s infinite;
}

@keyframes spin {
    from {
        transform: translateX(-5%) rotate(0deg);
    }

    to {
        transform: translateX(-5%) rotate(360deg);
    }
}

@keyframes pulse {
    0% {
        transform: translateX(-5%) scale(1);
        /* Normal size */
    }

    50% {
        transform: translateX(-5%) scale(1.2);
        /* Enlarged */
    }

    100% {
        transform: translateX(-5%) scale(1);
        /* Back to normal size */
    }
}

@media screen and (max-width: 785px) {
    .timer-digits {
        color: yellow;
        font-size: 1.5rem;
        font-weight: bold;
        -webkit-text-stroke: 1px black;
        /* width and color */
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        justify-content: center;
        align-items: center;
        text-decoration: none;
        z-index: 2;

    }
}
</style>