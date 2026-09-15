/**
 * AudioController — manages background music playback for Barcino.
 *
 * Features:
 *  - Autoplay-policy safe: audio only starts after an explicit user gesture.
 *  - Looping background music that persists across screen transitions.
 *  - Global mute toggle and volume control.
 *  - Floating mute/unmute button in the UI action bar.
 */

class AudioController {
  constructor() {
    this.audio = null;
    this.initialized = false;
    this.muted = localStorage.getItem('audioMuted') === 'true';
    this.volume = 0.5;
    this.trackUrl = 'assets/audio/barcino.mp3';
  }

  /**
   * Initialise the audio controller.
   * Creates the <audio> element, sets loop and volume, and binds
   * UI event handlers. Safe to call multiple times.
   */
  init() {
    if (this.initialized) return;

    this.audio = new Audio();
    this.audio.loop = true;
    this.audio.volume = this.volume;
    this.audio.muted = this.muted;
    this.audio.preload = 'auto';

    this._setupEventListeners();
    this._updateToggleIcon();

    // Set up autoplay fallback on reload when audio is not muted.
    if (!this.muted) {
      const navEntry = performance.getEntriesByType('navigation')[0];
      if (navEntry && navEntry.type === 'reload') {
        this._setupAutoplayFallback();
      }
    }

    this.initialized = true;
  }

  /**
   * Attach one-time document listeners to recover autoplay after a reload.
   * On the first click or pointerdown, attempts to play audio and then
   * removes both listeners.
   */
  _setupAutoplayFallback() {
    const fallback = () => {
      if (!this.muted && this.audio) {
        this.playMusic(this.trackUrl);
      }
      document.removeEventListener('click', fallback);
      document.removeEventListener('pointerdown', fallback);
    };

    document.addEventListener('click', fallback);
    document.addEventListener('pointerdown', fallback);
  }

  /**
   * Bind click handlers to the start button and the audio toggle button.
   * Uses event delegation so the handlers survive SPA screen transitions.
   */
  _setupEventListeners() {
    document.addEventListener('click', (e) => {
      // Start button — first user gesture, triggers audio playback.
      if (e.target.closest('#btn-start')) {
        this.playMusic(this.trackUrl);
      }

      // Audio toggle button — mute / unmute.
      if (e.target.closest('#btn-audio-toggle')) {
        this.toggleMute();
      }
    });
  }

  /**
   * Start (or resume) background music playback.
   * Wrapped in try/catch to gracefully handle NotAllowedError
   * when the browser blocks autoplay before a user gesture.
   */
  playMusic(trackUrl) {
    if (!this.initialized) {
      this.init();
    }

    // If the same track is already playing, do nothing.
    if (this.audio.src && this.audio.src.includes(trackUrl)) {
      if (this.audio.paused) {
        this.audio.play().catch((err) => {
          console.warn('Audio playback prevented:', err);
        });
      }
      return;
    }

    this.audio.src = trackUrl;
    this.audio.load();

    this.audio.play().catch((err) => {
      console.warn('Audio playback prevented:', err);
    });
  }

  /**
   * Toggle global mute state and update the UI icon.
   * Returns the new muted state.
   */
  toggleMute() {
    this.muted = !this.muted;
    if (this.audio) {
      this.audio.muted = this.muted;
    }
    localStorage.setItem('audioMuted', String(this.muted));

    // If we just unmuted and the audio source was never loaded
    // (e.g. user muted before playMusic() was ever called, then reloaded),
    // start playback now so the music actually plays.
    if (!this.muted && this.audio && !this.audio.src) {
      this.playMusic(this.trackUrl);
    }

    this._updateToggleIcon();
    return this.muted;
  }

  /**
   * Set the master output volume (0.0 – 1.0).
   * Clamps the value to stay within bounds.
   */
  setVolume(level) {
    this.volume = Math.max(0, Math.min(1, level));
    if (this.audio) {
      this.audio.volume = this.volume;
    }
  }

  /**
   * Update the icon inside the floating toggle button.
   * Shows 🔊 when unmuted, 🔇 when muted.
   */
  _updateToggleIcon() {
    const icon = document.querySelector('#btn-audio-toggle .audio-icon');
    if (icon) {
      icon.textContent = this.muted ? '🔇' : '🔊';
    }

    const button = document.querySelector('#btn-audio-toggle');
    if (button) {
      button.setAttribute('aria-pressed', String(this.muted));
    }
  }
}

// Expose a singleton instance globally.
window.audioController = new AudioController();

// Initialise event handlers as soon as the DOM is ready.
document.addEventListener('DOMContentLoaded', () => {
  window.audioController.init();
});
