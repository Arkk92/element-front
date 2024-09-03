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
import { defineComponent } from 'vue';
import RockButton from '../RockButton.vue';

export default defineComponent({
    name: 'DrawingButtonGroupComponent',
    components: {
        RockButton
    },
    methods: {
        addElementToList() {
            this.$emit('add');
        },
        removeElementFromList() {
            this.$emit('remove');
        }
        ,
        drawElements() {
            this.$emit('draw');
        },
    }
})
</script>
<style scoped>
.draw-button-group {

    width: 100%;
    height: 100%;
    max-height: 15%;
    min-height: 15%;

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