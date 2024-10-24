<template>
    <div class="turn-state-button-group d-flex">
        <div type="button" class="turn-state-button">
            <RockButton :button-width="'100%'" :button-height="'100%'" :padding="'0px 0px 0px 0px'" :text="formattedState" />
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import RockButton from '../RockButton.vue';

const stateToFormattedMap = {
    'Drawing': 'Casting',
    'Playing': 'Playing',
    'EndTurn': 'End Turn'
}

export default defineComponent({
    name: 'PlayingButtonGroupComponent',
    components: {
        RockButton
    },
    props: {
        state: String
    },
    computed: {
        formattedState(): string {
            return stateToFormattedMap[this.state!];
        }
    }
})
</script>
<style scoped>
.turn-state-button-group {
    position: inherit;
    width: 100%;
    height: 100%;
}

.turn-state-button {
    max-width: 100%;
    min-width: 100%;
}
</style>