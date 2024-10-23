<template>
    <div>
        <div v-if="isLoading" class="loading-screen">
            <div class="loading-container">
                <img class="company-logo" src="/assets/companyLogo.png">
                <p class="assets-progress-text">{{ loadedAssets }}/{{ totalAssets }} assets loaded</p>
                <div class="gauge-container">
                    <div class="gauge-bar" :style="{ width: (loadedAssets / totalAssets) * 100 + '%' }">
                    </div>
                </div>
                <span class="loading-text">Loading game assets, please wait...</span>
            </div>
        </div>
        <div v-else>
            <slot></slot>
        </div>
        <div v-if="errorMessage">
            <p>{{ errorMessage }}</p>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import assetsData from '@/presentation/assets/assets.json'; // Import the generated assets.json

import { preloadAssets } from '@/presentation/assets/assetsLoader';
import { useAppStore } from '@/presentation/stores/app';

export default defineComponent({
  setup() {
    const appStore = useAppStore();
    const isLoading = ref(true);
    const errorMessage = ref('');
    const loadedAssets = ref(0);
    const totalAssets = ref(assetsData.assets.length); // Use total assets count from JSON

    onMounted(() => {
      preloadAssets(assetsData.assets, (loaded: number) => {
        loadedAssets.value = loaded;
      })
        .then(() => {
          isLoading.value = false; // All assets loaded
          console.log('Assets preloaded, start the game!');
          appStore.onLoadingFinished();
        })
        .catch((error) => {
          errorMessage.value = 'Error loading assets!';
          console.error(error);
        });
    });

    return {
      isLoading,
      errorMessage,
      loadedAssets,
      totalAssets
    };
  }
});
</script>

<style lang="css">
.loading-screen {
    position: fixed;
    height: 100vh;
    width: 100vw;
    background-color: black;
}

.loading-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: fit-content;
    width: fit-content;
}

.loading-text {
    color: white;
    font-size: 2rem;
}

.gauge-container {
    border: 1px solid white;
    width: 100%;
    height: 20px;
}

.gauge-bar {
    height: 100%;
    background-color: white;
}

.assets-progress-text {
    color: white;
    font-size: 1.5rem;
}

.company-logo {
    height: 50%;
    width: 50%;
    transform: translateX(50%);
    padding-bottom: 10%;
}
</style>