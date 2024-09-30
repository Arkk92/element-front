export class SoundManager {
  private static sounds: Record<string, HTMLAudioElement> = {};
  private static musicVolume: number = 1; // Default music volume
  private static effectsVolume: number = 1; // Default sound effects volume
  private static musicKeys: Set<string> = new Set(); // Keys for music

  // Preload sounds (including categorizing music)
  static loadSounds(
    soundFiles: Record<string, { path: string; type: "music" | "effect" }>
  ) {
    for (const [key, { path, type }] of Object.entries(soundFiles)) {
      const audio = new Audio(path);
      this.sounds[key] = audio;

      if (type === "music") {
        this.musicKeys.add(key);
      }
    }
  }

  // Play a specific sound with optional loop
  static playSound(key: string, loop: boolean = false) {
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
  }

  // Play background music in a loop
  static playBackgroundMusic(key: string) {
    this.playSound(key, true); // Automatically loop music
  }

  // Stop a specific sound (e.g., to stop looping music)
  static stopSound(key: string) {
    const sound = this.sounds[key];
    if (sound) {
      sound.pause();
      sound.currentTime = 0; // Reset to the beginning
    }
  }

  // Set volume for music
  static setMusicVolume(volume: number) {
    this.musicVolume = volume;

    // Apply volume to all currently playing music
    for (const key of this.musicKeys) {
      const sound = this.sounds[key];
      if (!sound.paused) {
        sound.volume = volume;
      }
    }
  }

  static getMusicVolume(): number {
    return this.musicVolume;
  }

  // Set volume for sound effects
  static setEffectsVolume(volume: number) {
    this.effectsVolume = volume;
  }

  static getEffectsVolume(): number {
    return this.effectsVolume;
  }
}
