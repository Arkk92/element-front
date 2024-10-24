<template>
  <div class="wizard-piece col cells" style="padding: 0;" v-on:click.stop="wizardClicked()">
    <img draggable="false" class="boxMarker" :src="getBoxMarkerImage()">
    <div v-if="isPlayerWizard" class="wizard-shadow shinning-fade"></div>
    <img draggable="false" class="pieces wizard-image" :src="getWizardImage()" tabindex="-1">


  </div>
</template>

<script lang="ts">
import { SageModel } from '@/domain/game/models/pieces/sage';
import { defineComponent } from 'vue';

import { useAuthStore } from '@/presentation/stores/auth';
import { usePlayerActionStore } from '@/presentation/stores/playerAction';
import boxMarkerImageUrl from '/assets/boxMarker.png';
import fireWizardImageUrl from '/assets/FireWizardMiniature.png';
import rockWizardImageUrl from '/assets/RockWizardMiniature.png';
import waterWizardImageUrl from '/assets/WaterWizardMiniature.png';
import windWizardImageUrl from '/assets/WindWizardMiniature.png';
import { useRoomStore } from '@/presentation/stores/room';

export default defineComponent({
  name: 'WizardPieceComponent',
  props: {
    piece: SageModel,
  },
  setup() {
    const authStore = useAuthStore();
    const roomStore = useRoomStore();
    const playerActionStore = usePlayerActionStore();
    return { authStore, roomStore, playerActionStore }
  },
  computed: {
    playerId(): string {
      return this.authStore.playerId;
    },
    playerList() {
      return this.roomStore.model.game.player_list;
    },
    playerNumber(): number {
      return this.playerList.filter(player => player.sage.uuid === this.piece!.uuid)[0].player_number;
    },
    isPlayerWizard(): boolean {
      return this.playerList.filter(player => player.uuid === this.playerId)[0].sage.uuid === this.piece!.uuid;
    }
  },
  methods: {
    getBoxMarkerImage(): string {
      return boxMarkerImageUrl
    },
    getWizardImage(): any {
      const numToImageMap = {
        0: rockWizardImageUrl,
        1: fireWizardImageUrl,
        2: waterWizardImageUrl,
        3: windWizardImageUrl
      }
      return numToImageMap[this.playerNumber];
    },
    wizardClicked(): void {
      this.$emit('clicked')

    },
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.cells {
  position: relative;
  width: 100%;
  max-height: 100%;
  text-align: center;
  position: relative;
  aspect-ratio: 1/1;
}

.wizard-shadow {
  background-color: yellow;
  border-radius: 20px;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.pieces {
  position: relative;
  box-sizing: border-box;
  /* max-width: 100%; */
  width: 100%;
  z-index: 2;
  position: absolute;
  bottom: 0%;
  left: 0%;
}

.wizard-image {
  position: absolute;
  max-height: 120%;
  max-width: 100%;
  bottom: 0;
  left: 0;
  /* transform: translateX(-50%); */
  animation: floatAndBreathe 4s infinite ease-in-out;
}

.shinning-fade {
  animation: fadeIn 2s;
  animation-iteration-count: infinite;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }

  50% {
    opacity: .5;
  }

  100% {
    opacity: 0;
  }
}

.boxMarker {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  z-index: 3;
}

.boxMarker:hover {
  /* background-color: yellow; */
  opacity: 1;
  animation: hoverResizing 1s;
  animation-iteration-count: infinite;

}

.boxMarker:active {
  opacity: 1;
  animation: hoverResizing 1s;
  animation-iteration-count: infinite;

}

@keyframes hoverResizing {
  0% {
    width: 100%;
    height: 100%;
  }

  50% {
    width: 70%;
    height: 70%;
  }

  100% {
    width: 100%;
    height: 100%;
  }
}

/* Wizard standing by animation */
@keyframes float {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }

  100% {
    transform: translateY(0);
  }
}

@keyframes breathe {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes floatAndBreathe {
  0% {
    transform: translateY(0) scale(1);
  }

  25% {
    transform: translateY(-5px) scale(1.03);
  }

  50% {
    transform: translateY(0) scale(1.05);
  }

  75% {
    transform: translateY(-5px) scale(1.03);
  }

  100% {
    transform: translateY(0) scale(1);
  }
}
</style>
