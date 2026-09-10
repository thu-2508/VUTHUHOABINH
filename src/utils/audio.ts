// Audio manager using Web Audio API and Web Speech Synthesis API

class AudioManager {
  private audioCtx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private bgmPlaying: boolean = false;
  private bgmTimer: number | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private speechActiveListeners: Set<(isSpeaking: boolean, text: string) => void> = new Set();
  private activeSpeakingText: string | null = null;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private getContext(): AudioContext | null {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    if (!enabled) {
      this.stopBGM();
      this.stopSpeech();
    }
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  // --- Sound Effects ---

  public playCardSelect() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // ignore
    }
  }

  public playCorrect() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.15, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.26);
      });
    } catch {
      // ignore
    }
  }

  public playIncorrect() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.linearRampToValueAtTime(180, now + 0.2);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // ignore
    }
  }

  public playTimeWarning() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // ignore
    }
  }

  public playCompletionFanfare() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const chords = [
        [523.25, 659.25, 783.99], // C
        [587.33, 739.99, 880.00], // D
        [659.25, 830.61, 987.77], // E
        [783.99, 987.77, 1174.66, 1567.98], // G & C
      ];

      chords.forEach((chord, step) => {
        const stepTime = now + step * 0.22;
        chord.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, stepTime);
          gain.gain.setValueAtTime(0.1, stepTime);
          gain.gain.exponentialRampToValueAtTime(0.001, stepTime + (step === 3 ? 0.8 : 0.25));

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(stepTime);
          osc.stop(stepTime + (step === 3 ? 0.82 : 0.26));
        });
      });
    } catch {
      // ignore
    }
  }

  // --- Background Soft Melody ---
  public toggleBGM(): boolean {
    if (this.bgmPlaying) {
      this.stopBGM();
      return false;
    } else {
      this.startBGM();
      return true;
    }
  }

  public isBGMPlaying(): boolean {
    return this.bgmPlaying;
  }

  public startBGM() {
    if (!this.soundEnabled) return;
    if (this.bgmPlaying) return;
    this.bgmPlaying = true;

    const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C major pentatonic
    let step = 0;

    const playNote = () => {
      if (!this.bgmPlaying || !this.soundEnabled) return;
      const ctx = this.getContext();
      if (ctx) {
        try {
          const freq = scale[step % scale.length];
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          gain.gain.setValueAtTime(0.02, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          osc.stop(ctx.currentTime + 0.42);
        } catch {
          // ignore
        }
      }
      step = (step + 1) % scale.length;
      this.bgmTimer = window.setTimeout(playNote, 500);
    };

    playNote();
  }

  public stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  // --- Web Speech Synthesis API ---

  public subscribeSpeaking(listener: (isSpeaking: boolean, text: string) => void) {
    this.speechActiveListeners.add(listener);
    return () => {
      this.speechActiveListeners.delete(listener);
    };
  }

  private notifySpeaking(isSpeaking: boolean, text: string) {
    this.activeSpeakingText = isSpeaking ? text : null;
    this.speechActiveListeners.forEach((l) => l(isSpeaking, text));
  }

  public getActiveSpeakingText(): string | null {
    return this.activeSpeakingText;
  }

  public stopSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.notifySpeaking(false, '');
  }

  public speak(textToSpeak: string, contextPhrase?: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    // Stop any current speech
    this.stopSpeech();

    // If contextPhrase is specified (e.g. for past "read" /red/: "Yesterday, I read a book.")
    // Speak the context phrase so the synthesis pronounces it correctly in past tense!
    const utteranceText = contextPhrase || textToSpeak;
    const utterance = new SpeechSynthesisUtterance(utteranceText);

    // Rate: 0.8 as requested in Section IX
    utterance.rate = 0.8;
    utterance.pitch = 1.0;

    // Pick English UK voice if available, fallback English US, fallback en
    const voices = window.speechSynthesis.getVoices();
    const ukVoice = voices.find((v) => v.lang === 'en-GB' || v.lang.startsWith('en_GB'));
    const usVoice = voices.find((v) => v.lang === 'en-US' || v.lang.startsWith('en_US'));
    const anyEn = voices.find((v) => v.lang.startsWith('en'));

    utterance.voice = ukVoice || usVoice || anyEn || null;
    utterance.lang = ukVoice ? 'en-GB' : usVoice ? 'en-US' : 'en-US';

    utterance.onstart = () => {
      this.notifySpeaking(true, textToSpeak);
    };

    utterance.onend = () => {
      this.notifySpeaking(false, textToSpeak);
      this.currentUtterance = null;
    };

    utterance.onerror = () => {
      this.notifySpeaking(false, textToSpeak);
      this.currentUtterance = null;
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }
}

export const audioService = new AudioManager();
