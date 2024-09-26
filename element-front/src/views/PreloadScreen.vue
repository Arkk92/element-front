<template>
    <div>
        <div v-if="isLoading">
            Loading game assets, please wait...
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

        // Dynamically import all images and videos from the assets folder and subfolders
        const imageAssets = import.meta.glob('@/assets/**/*.{png,jpg,jpeg}', { eager: true });
        const videoAssets = import.meta.glob('@/assets/**/*.mp4', { eager: true });

        // Extract URLs from imageAssets and videoAssets
        const imagePaths = Object.keys(imageAssets);
        const videoPaths = Object.keys(videoAssets);

        // Combined asset paths for preloading
        const allAssets = [...imagePaths, ...videoPaths];

        onMounted(() => {
            preloadAssets(allAssets) // Pass the dynamically loaded paths (images + videos)
                .then(() => {
                    // isLoading.value = false;
                    console.log('Assets preloaded, start the game!');
                })
                .catch((error) => {
                    errorMessage.value = 'Error loading assets!';
                    console.error(error);
                });
        });

        return {
            isLoading,
            errorMessage
        };
    }
});
</script>