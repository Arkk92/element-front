<template>
    <div class="gameboard-layout">

        <div class="board-wrapper">
            <img class="image" src="@/assets/background/Board.png">
        </div>
        <div class="grid-wrapper">
            <Board class="board-grid" :board="board" :players="players as Array<any>" :current-player="currentPlayer" />
        </div>

    </div>
</template>
<script lang="ts">
import { BoardModel } from '@/game/models/board';
import { defineComponent } from 'vue';
import Board from './Board.vue';

export default defineComponent({
    name: 'GameLayout',
    components: {
        Board,
    },
    props: {
        board: BoardModel,
        players: Array,
        currentPlayer: Number,
    }
})
</script>
<style scoped>
.gameboard-layout {
    position: relative;
    top: 0;
    left: 50%;
    min-height: 100%;
    max-width: 100%;
    height: 100%;
    width: 100%;
    transform: translateX(-50%);
}

.board-wrapper {
    position: relative;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    height: 100%;

    width: 80%
}
.grid-wrapper {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    height: 100%;
    width: 80%;
}
@media only screen and (max-width: 1080px) {
    .board-wrapper {
        width: 100%;
    }
    .grid-wrapper {
        width: 100%;
    }
}

.image {
    position: relative;
    height: 100%;
    width: 100%;
}



.board-grid {
    position: absolute;
    z-index: 2;
    top: 10%;
    bottom: 15%;
    left: 10%;
    max-width: 80%;
    max-height: 80%;
    /* transform: translateX(-50%); */
}
</style>