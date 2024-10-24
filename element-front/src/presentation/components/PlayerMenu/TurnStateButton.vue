<template>
    <div class="turn-state-button-group d-flex">
        <div type="button" class="turn-state-button">
            <RockButton :button-width="'100%'" :button-height="'100%'" :padding="'0px 0px 0px 0px'" :text="state" />
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
    props: {
        state: String
    },
    methods: {

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