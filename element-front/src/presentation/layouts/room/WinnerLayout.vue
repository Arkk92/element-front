<template>
  <div class="winner-layout">
    <WinnerModal v-if="isCurrentUserWinner" :is-open="isModalOpen" :winner-name="winnerName" @close="closeModal()"
      @return-main="closeModal()" />
    <LoserModal v-else :is-open="isModalOpen" :winner-name="winnerName" @close="closeModal()"
      @return-main="closeModal()" />
  </div>
</template>

<script lang="ts">
import LoserModal from '@/presentation/components/LoserModal.vue';
import WinnerModal from '@/presentation/components/WinnerModal.vue';
import { useAuthStore } from '@/presentation/stores/auth';
import { useRoomStore } from '@/presentation/stores/room';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'WinnerLayout',
  components: {
    WinnerModal,
    LoserModal
  },

  setup() {
    const roomStore = useRoomStore();
    const authStore = useAuthStore();
    return {
      roomStore, authStore
    }
  },
  data() {
    return {
      winnerName: '',
      isCurrentUserWinner: false,
      isModalOpen: false,
    }
  },
  mounted() {

    for (const userMap of this.roomStore.model.user_to_player_map) {
      if (userMap.player_uuid === this.roomStore.winner) {
        for (const user of this.roomStore.model!.user_list) {
          if (user.uuid === userMap.user_uuid) {
            this.winnerName = user.name;
            if (user.uuid === this.authStore.userId) {
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
<style scoped></style>
