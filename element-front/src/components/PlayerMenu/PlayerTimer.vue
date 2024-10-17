<template>
    <div class="player-timer">
        <div class="player-timer-container">
            <!-- <img class="image" src="/assets/boots.png"> -->
            <div class="timer-digits">
                {{ remainingTime }}
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';


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
    props: {
        restart: Boolean,
        time: {
            type: Number,
            required: true
        },
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
        this.startTimer()
        this.updateTimer();
        this.interval = setInterval(this.updateTimer, 1000);
    },
    methods: {
        updateTimer() {
            if(this.stop) return;
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
        startTimer() {
            this.deadline = new Date(Date.parse(new Date().toISOString()) + this.time);
            this.stop = false;
        },
        stopTimer(){
            this.stop = true;
        }
    },
    computed: {
        remainingTime() {
            const minutes = ('0' + this.remainingMinutes).slice(-2);
            const seconds = ('0' + this.remainingSeconds).slice(-2);
            return `${minutes}:${seconds}`;
        }
    },
    watch: {
        restart(){
            this.stopTimer();
            this.startTimer()
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
    width: 100%;
    height: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.timer-digits {
    color: yellow;
    font-size: 2.5rem;
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

.image {
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: 1;
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