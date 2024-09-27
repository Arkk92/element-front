<template>
    <div class="draw-button-group d-flex">
        <div type="button" class="end-turn-button" v-on:click="endTurn()">
            <RockButton :button-width="'100%'" :button-height="'100%'" :padding="'0px 0px 0px 0px'" :text="'End turn'" />
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import RockButton from '../RockButton.vue';

export default defineComponent({
    name: 'PlayingButtonGroupComponent',
    components: {
        RockButton
    },
    methods: {
        endTurn() {
            this.$emit('endTurn');
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
.end-turn-button {
  max-width: 100%;
  min-width: 100%;
}
</style>