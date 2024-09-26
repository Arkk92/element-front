<template>
    <div>
        <div v-if="isLoading" class="loading-screen">
            <div class="loading-container">
                <img class="company-logo" src="@/assets/companyLogo.png">
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
import { preloadAssets } from '@/utils/assetsLoader';

export default defineComponent({
    setup() {
        const isLoading = ref(true);
        const errorMessage = ref('');
        const loadedAssets = ref(0);
        const totalAssets = ref(0);

        // Dynamically import all images and videos from the assets folder and subfolders
        const imageAssets = import.meta.glob('@/assets/**/*.{png,jpg,jpeg}', { eager: true });
        const videoAssets = import.meta.glob('@/assets/**/*.mp4', { eager: true });

        // Extract URLs from imageAssets and videoAssets
        const imagePaths = Object.keys(imageAssets);
        const videoPaths = Object.keys(videoAssets);

        // Combined asset paths for preloading
        let allAssets = [...imagePaths, ...videoPaths];
        totalAssets.value = allAssets.length; // Set the total number of assets for the progress bar

        // This is intended for production
        if (allAssets.length == 0) {
            // Extract filenames from the paths
            const assetFilenames = allAssets.map(assetPath => {
                // Split by '/' and get the last part, which is the filename
                return assetPath.split('/').pop();
            });
            if(assetFilenames != undefined){
                allAssets = assetFilenames as any;
            } else {
                console.error('Could find any assets')
            }
        }
        console.log(allAssets);
        onMounted(() => {
            preloadAssets(allAssets, (loaded: number, total: number) => {
                loadedAssets.value = loaded; // Update the loaded assets count
            })
                .then(() => {
                    isLoading.value = false;
                    console.log('All assets preloaded, start the game!');
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