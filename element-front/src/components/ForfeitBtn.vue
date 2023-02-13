<template>
  <div class="forfeit">
    <!-- Button trigger modal -->
    <div v-if="show || showBtn">
      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#forfeitModal">
        Forfeit
      </button>
    </div>


    <!-- Modals -->
    <div class="modal fade" id="forfeitModal" tabindex="-1" aria-labelledby="forfeitModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="forfeitModalLabel">Forfeit</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            Are you sure you want to forfeit?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" v-on:click="giveUpButton()">Yes, I give up</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { SocketInstance } from '@/main'
import { useCookies } from "vue3-cookies";


export default defineComponent({
  name: 'ForfeitButton',
  components: {
  },
  setup() {
    const { cookies } = useCookies();
    return { cookies };
  },
  props: {
    show: Boolean,
  },
  data() {
    return {
      showBtn: false,
    }
  },
  mounted() {
    if (this.cookies.get('userId') != null){
      this.showBtn = true;
    }
  },
  methods: {

    giveUpButton() {
      SocketInstance.emit('forfeit', this.cookies.get('userId'));
      this.cookies.remove('roomId')
      this.cookies.remove('userId')
      window.location.reload();
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
