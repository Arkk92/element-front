<template>
    <div class="moves-counter">
        <div class="moves-counter-container">
            <img class="image" :src="require('@/assets/icons/boots.png')">
            <div class="moves-number">
                {{ counter }}
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'MovesCounterComponent',
    components: {
    },
    setup() {

    },
    props: {
        counter: Number
    },
    data() {
        return {
            cnt: 0,
        }
    },
    mounted() {
    },
    methods: {

    }
})
</script>
<style scoped>
.moves-counter {
    position: absolute;
    height: 100%;
    width: 100%;
}
.moves-counter-container {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.moves-number {
    color: yellow;
    font-size: 40px;
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
</style>