<template>
  <div class="winner-layout">
    <WinnerModal v-if="isCurrentUserWinner" :is-open="isModalOpen" :winner-name="winnerName"
    @close="closeModal()" @return-main="closeModal()"/>
    <LoserModal v-else :is-open="isModalOpen" :winner-name="winnerName"
    @close="closeModal()" @return-main="closeModal()"/>
  </div>
</template>

<script lang="ts">
import { RoomModel } from '@/game/models/room';
import { defineComponent, PropType } from 'vue';
import WinnerModal from '@/components/WinnerModal.vue';
import LoserModal from '@/components/LoserModal.vue';

export default defineComponent({
  name: 'WinnerLayout',
  components: {
    WinnerModal,
    LoserModal
  },
  props: {
    isGameOver: Boolean,
    currentUser: String,
    room: Object as PropType<RoomModel>,
    winner: String,
  },
  data() {
    return {
      winnerName: '',
      isCurrentUserWinner: false,
      isModalOpen: false,
    }
  },
  mounted() {
    
    for (const userMap of this.room!.user_to_player_map) {
      if (userMap.player_uuid === this.winner) {
        for (const user of this.room!.user_list) {
          if (user.uuid === userMap.user_uuid) {
            this.winnerName = user.name;
            if (user.uuid === this.currentUser) {
              this.isCurrentUserWinner = true;
            }
          }
        }
      }
    }
    this.isModalOpen = true;
  },

  methods: {
    closeModal() {
      this.$emit('onClose');
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
