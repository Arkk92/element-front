<template>
  <div class="winner-layout">
    <div class="modal fade display" id="winnerModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="winnerModalTitle">Game Over</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" v-if="isCurrentUserWinner">
            <h1>VICTORY</h1>
            <hr>
            You have defeated your target!
          </div>
          <div class="modal-body" v-else>
            <h1>DEFEAT</h1>
            <hr>
            Another player has defeted his target!
          </div>

          <div class="modal-footer">
            
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
              v-on:click="closeModal()">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { RoomModel } from '@/game/models/room';
import { defineComponent, PropType } from 'vue';
import { Modal } from 'bootstrap'

export default defineComponent({
  name: 'WinnerLayout',
  components: {
    
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
      dataReady: false,
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
    new Modal(document.getElementById('winnerModal')).show();
    this.dataReady = true;
  },

  methods: {
    closeModal() {
      location.reload();
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
