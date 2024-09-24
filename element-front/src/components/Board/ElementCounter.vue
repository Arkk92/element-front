<template>
    <div class="element-counter">
        <div class="element-counter-container">
            <img class="image" :src="getImageUrl()">
            <div class="counter">
                {{ counter }}
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { ElementTypes } from '@/game/models/elements/elements';
import { defineComponent } from 'vue';

import fireImageUrl from '@/assets/elements/Fire.png'
import waterImageUrl from '@/assets/elements/Water.png'
import earthImageUrl from '@/assets/elements/Earth.png'
import windImageUrl from '@/assets/elements/Wind.png'

export default defineComponent({
    name: 'ElementCounterComponent',
    components: {
    },
    setup() {

    },
    props: {
        counter: Number,
        element: String,
    },
    data() {
        return {

        }
    },
    mounted() {
    },
    methods: {
        getImageUrl(): string {
            let imageUrl = "";
            switch (this.element!) {
                case ElementTypes.Fire:
                    imageUrl = fireImageUrl
                    break;
                case ElementTypes.Water:
                    imageUrl = waterImageUrl
                    break;
                case ElementTypes.Earth:
                    imageUrl = earthImageUrl
                    break;
                case ElementTypes.Wind:
                    imageUrl = windImageUrl
                    break;
            }
            return imageUrl;
        }

    }
})
</script>
<style scoped>
.element-counter {
    position: absolute;
    height: 100%;
    width: 100%;
}

.element-counter-container {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.counter {
    color: yellow;
    font-size: 35px;
    font-weight: bold;
    -webkit-text-stroke: 1.5px black;
    /* width and color */
    position: absolute;
    bottom: 0;
    right: 0;
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