<template>
    <div class="element-container">
        <div class="orbit">
            <div class="image-container image-container-1">
                <img v-if="list.length > 0" :src="getImageUrl(list[0])"
                    :class="selectedElement == 0 ? 'image-selected' : 'image'" v-on:click="onElementClick(0)">
            </div>
            <div class="image-container image-container-2">
                <img v-if="list.length > 1" :src="getImageUrl(list[1])"
                    :class="selectedElement == 1 ? 'image-selected' : 'image'" v-on:click="onElementClick(1)">
            </div>
            <div class="image-container image-container-3">
                <img v-if="list.length > 2" :src="getImageUrl(list[2])"
                    :class="selectedElement == 2 ? 'image-selected' : 'image'" v-on:click="onElementClick(2)">
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';

import allElementsImageUrl from '/assets/allElements.png';
import fireImageUrl from '/assets/Fire.png'
import waterImageUrl from '/assets/Water.png'
import earthImageUrl from '/assets/Earth.png'
import windImageUrl from '/assets/Wind.png'


const NON_SELECTED = -1;

export default defineComponent({
    name: 'ElementContainerComponent',
    components: {
    },
    setup() {

    },
    props: {
        elementsHidden: Boolean,
        reset: Boolean,
        list: {
            type: Array as PropType<string[]>,
            default: () => []
        }
    },
    data() {
        return {
            selectedElement: NON_SELECTED,
        }
    },
    mounted() {
    },
    watch: {
        reset() {
            this.onResetView();
        }
    },
    methods: {
        getImageUrl(element: string): string {
            if (this.elementsHidden) {
                return allElementsImageUrl
            }
            let url: string = '';
            switch (element) {
                case 'Fire':
                    url = fireImageUrl;
                    break;
                case 'Water':
                    url = waterImageUrl;
                    break;
                case 'Wind':
                    url = windImageUrl;
                    break;
                case 'Earth':
                    url = earthImageUrl;
                    break;
                default:
                    break;
            }
            return url;

        },
        onElementClick(index: number): void {
            if (!this.elementsHidden) {
                if (this.selectedElement == index) {
                    this.selectedElement = NON_SELECTED;
                    this.$emit('elementClickedIndex', NON_SELECTED);
                } else {
                    this.selectedElement = index;
                    this.$emit('elementClickedIndex', index);
                }
            }
        },
        onResetView() {
            this.selectedElement = NON_SELECTED;
            this.$emit('elementClickedIndex', NON_SELECTED);
        }

    }
})
</script>
<style scoped>
.element-container {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.orbit {
    position: absolute;
    top: 0%;
    left: 0%;
    width: 100%;
    height: 100%;

    border-radius: 50%;
}

.image-container {
    position: absolute;
    /* 30% of the parent height */
    transform-origin: center;
    top: 50%;
    left: 50%;
}

.image-container-1 {
    /* 30% of the parent height */
    transform-origin: center;
    animation: orbit 10s infinite linear;
}

.image-container-2 {
    animation: orbit 10s infinite linear;
    animation-delay: -3.33s;
    /* Adjust the delay to stagger the start */
}

.image-container-3 {
    animation: orbit 10s infinite linear;
    animation-delay: -6.67s;
    /* Adjust the delay to stagger the start */
}

@keyframes orbit {
    0% {
        transform: rotate(0deg) translateX(50%) rotate(0deg);
    }

    100% {
        transform: rotate(360deg) translateX(50%) rotate(-360deg);
    }
}

/* Positioning each image in its orbit position */
.image {
    width: 70%;
    top: 0%;

    transform: translate(-50%, -50%);

}

/* Positioning each image in its orbit position */
.image-selected {
    width: 100%;
    top: 0%;

    transform: translate(-50%, -50%);

}

/* Floating animation */
@keyframes float {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-10px);
    }
}
</style>