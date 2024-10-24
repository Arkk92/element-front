<template>
    <div class="draw-button-group d-flex">
        <div type="button" class="plus-button" v-on:click="addElementToList()">
            <RockButton :button-width="'100%'" :button-height="'100%'" :padding="'0px 0px 0px 0px'"
                :icon="'bi-plus-lg'" />
        </div>
        <div type="button" class="minus-button" v-on:click="removeElementFromList()">
            <RockButton :button-width="'100%'" :button-height="'100%'" :padding="'0px 0px 0px 0px'"
                :icon="'bi-dash-lg'" />
        </div>
        <div type="button" class="cast-button" v-on:click="drawElements()">
            <RockButton :button-width="'100%'" :button-height="'100%'" :padding="'0px 0px 0px 0px'" :text="'Cast'" />
        </div>
    </div>
</template>
<script lang="ts">
import { usePlayerActionStore } from '@/presentation/stores/playerAction';
import { defineComponent } from 'vue';
import RockButton from '../RockButton.vue';

export default defineComponent({
    name: 'DrawingButtonGroupComponent',
    components: {
        RockButton
    },
    setup() {
        const playerActionStore = usePlayerActionStore();
        return {
            playerActionStore
        }
    },
    methods: {
        addElementToList() {
            this.playerActionStore.addElementToList()
        },
        removeElementFromList() {
            this.playerActionStore.removeElementFromList();
        }
        ,
        drawElements() {
            this.playerActionStore.drawElements()
        },
    }
})
</script>
<style scoped>
.draw-button-group {
    position: inherit;
    width: 100%;
    height: 100%;

}

.minus-button {
    max-width: 30%;
    min-width: 30%;
}

.plus-button {
    max-width: 30%;
    min-width: 30%;
}

.cast-button {
    max-width: 40%;
    min-width: 40%;
}
</style>