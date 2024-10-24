import { defineStore } from 'pinia';

export const useSoundStore = defineStore('soundStore', {
  state: () => ({
    sounds: {} as Record<string, HTMLAudioElement>,
    musicVolume: 1, // Default music volume
    effectsVolume: 1, // Default sound effects volume
    musicKeys: new Set<string>(), // Keys for music
  }),

  actions: {
    // Load sounds and categorize them as music or effects
    loadSounds(soundFiles: Record<string, { path: string; type: 'music' | 'effect' }>) {
      for (const [key, { path, type }] of Object.entries(soundFiles)) {
        const audio = new Audio(path);
        this.sounds[key] = audio;

        if (type === 'music') {
          this.musicKeys.add(key);
        }
      }
    },

    // Play a specific sound with optional loop
    playSound(key: string, loop: boolean = false) {
      const sound = this.sounds[key];
      if (sound) {
        sound.currentTime = 0; // Rewind sound to the start
        sound.loop = loop; // Set loop if provided

        // Adjust volume based on whether it's music or effect
        if (this.musicKeys.has(key)) {
          sound.volume = this.musicVolume;
        } else {
          sound.volume = this.effectsVolume;
        }

        sound.play();
      } else {
        console.warn(`Sound with key "${key}" not found.`);
      }
    },

    // Play background music in a loop
    playBackgroundMusic(key: string) {
      this.playSound(key, true); // Automatically loop music
    },

    // Stop a specific sound (e.g., to stop looping music)
    stopSound(key: string) {
      const sound = this.sounds[key];
      if (sound) {
        sound.pause();
        sound.currentTime = 0; // Reset to the beginning
      }
    },

    // Set volume for music
    setMusicVolume(volume: number) {
      this.musicVolume = volume;

      // Apply volume to all currently playing music
      for (const key of this.musicKeys) {
        const sound = this.sounds[key];
        if (!sound.paused) {
          sound.volume = volume;
        }
      }
    },

    // Get the current music volume
    getMusicVolume(): number {
      return this.musicVolume;
    },

    // Set volume for sound effects
    setEffectsVolume(volume: number) {
      this.effectsVolume = volume;
    },

    // Get the current effects volume
    getEffectsVolume(): number {
      return this.effectsVolume;
    },
  },
});
