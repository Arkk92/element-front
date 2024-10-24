<template>
  <div class="logger">
    <div class="overlay">
      <div class="scroll-box">
        <div class="text-box" ref="textBoxRef" v-html="formattedText"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Emitter } from '@/main';
import { computed, defineComponent, nextTick, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'ScrollableTextBox',
  setup() {
    // Store each line of text with its corresponding color
    const textEntries = ref<{ text: string; color: string }[]>([]);
    const textBoxRef = ref<HTMLDivElement | null>(null);

    // Computed property to generate formatted text with colors
    const formattedText = computed(() => {
      return textEntries.value
        .map((entry) => {
          const words = entry.text.trim().split(' ');
          if (words.length > 0) {
            words[0] = `<span style="color: ${entry.color};font-weight: bold;">${words[0]}</span>`;
          }
          return words.join(' ');
        })
        .join('<br>');
    });

    // Method to scroll to the bottom of the text box
    const scrollToBottom = () => {
      nextTick(() => {
        if (textBoxRef.value) {
          textBoxRef.value.scrollTop = textBoxRef.value.scrollHeight;
        }
      });
    };

    // Method to add text with a specific color
    const addText = (newText: string, color: string) => {
      textEntries.value.push({ text: newText, color: color });
      scrollToBottom();
    };

    onMounted(() => {
      Emitter.on('sysLog', text => {
        const log = `system: ${text}`
        addText(log, 'grey');
        scrollToBottom();
      })

      Emitter.on('errorLog', text => {
        const log = `error: ${text}`
        addText(log, 'red');
        scrollToBottom();
      })
    });


    return {
      textEntries,
      formattedText,
      textBoxRef,
    };
  },
});
</script>

<style scoped>
.logger {
  position: relative;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  /* Dark overlay */
  display: flex;
  justify-content: center;
  align-items: center;
}

.scroll-box {
  width: 100%;
  height: 100%;
  padding: 2%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.text-box {
  width: 100%;
  height: 100%;
  border: 1px solid white;
  /* White rounded border */
  outline: none;
  resize: none;
  /* Prevent resizing of the textarea */
  background-color: transparent;
  /* Transparent background */
  color: white;
  font-size: small;
  /* White text */
  padding: 1rem;
  border-radius: 8px;
  overflow-y: auto;
  /* Vertical scroll only */
  overflow-x: hidden;
  /* Disable horizontal scrolling */
  box-sizing: border-box;
}
</style>