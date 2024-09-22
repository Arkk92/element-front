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
                    imageUrl = require('@/assets/elements/Fire.png')
                    break;
                case ElementTypes.Water:
                    imageUrl = require('@/assets/elements/Water.png')
                    break;
                case ElementTypes.Earth:
                    imageUrl = require('@/assets/elements/Earth.png')
                    break;
                case ElementTypes.Wind:
                    imageUrl = require('@/assets/elements/Wind.png')
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