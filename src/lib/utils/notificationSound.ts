let audioContext: AudioContext | null = null;
let isAudioUnlocked = false;

let alertIntervalId: any = null;
let alertIterationCount = 0;
const MAX_ALERT_ITERATIONS = 40; // Max ~1.5 minutes if unacknowledged
let onAlertStateChangeCallbacks: Array<(ringing: boolean) => void> = [];

/**
 * Initializes and unlocks AudioContext on first user interaction to satisfy browser autoplay policies
 */
export function unlockAudioContext() {
  if (typeof window === "undefined" || isAudioUnlocked) return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    if (!audioContext) {
      audioContext = new AudioCtx();
    }
    if (audioContext.state === "suspended") {
      audioContext.resume().then(() => {
        isAudioUnlocked = true;
      }).catch(() => {});
    } else {
      isAudioUnlocked = true;
    }
  } catch (err) {
    console.warn("Could not unlock audio context:", err);
  }
}

/**
 * Checks if notification sound is enabled in local storage (default: true)
 */
export function isSoundEnabled(): boolean {
  if (typeof window === "undefined") return true;
  const val = localStorage.getItem("vps_notif_sound_enabled");
  return val === null ? true : val === "true";
}

/**
 * Sets notification sound preference
 */
export function setSoundEnabled(enabled: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem("vps_notif_sound_enabled", String(enabled));
  if (!enabled) {
    stopRepeatingAlert();
  }
}

export function isAlertRinging(): boolean {
  return alertIntervalId !== null;
}

export function subscribeAlertState(cb: (ringing: boolean) => void) {
  onAlertStateChangeCallbacks.push(cb);
  return () => {
    onAlertStateChangeCallbacks = onAlertStateChangeCallbacks.filter((c) => c !== cb);
  };
}

function notifyAlertState(ringing: boolean) {
  onAlertStateChangeCallbacks.forEach((cb) => {
    try {
      cb(ringing);
    } catch {}
  });
}

/**
 * Plays a rich, pleasant solar notification chime.
 * Uses Web Audio API for zero-latency synthesized harmonics, with HTML5 Audio as fallback.
 */
export function playNotificationSound() {
  if (typeof window === "undefined") return;
  if (!isSoundEnabled()) return;

  // Attempt 1: Web Audio API (instant, synthesized high-clarity bell chime)
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      if (!audioContext) {
        audioContext = new AudioCtx();
      }
      if (audioContext.state === "suspended") {
        audioContext.resume().catch(() => {});
      }

      const now = audioContext.currentTime;

      // Note 1: 587.33 Hz (D5) -> Note 2: 880 Hz (A5)
      const osc1 = audioContext.createOscillator();
      const osc2 = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      osc1.type = "sine";
      osc2.type = "triangle";

      osc1.frequency.setValueAtTime(587.33, now);
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12);

      osc2.frequency.setValueAtTime(880, now);
      osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.15); // D6

      // Envelope: gentle attack + clean bell decay
      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(0.4, now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(audioContext.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.7);
      osc2.stop(now + 0.7);
      return;
    }
  } catch (err) {
    // Fall back to HTML5 Audio
  }

  // Attempt 2: HTML5 Audio Element Fallback
  try {
    const audio = new Audio("/sounds/notification.wav");
    audio.volume = 0.5;
    audio.play().catch((playErr) => {
      console.warn("Audio playback notice:", playErr);
    });
  } catch (fallbackErr) {
    console.warn("Audio element error:", fallbackErr);
  }
}

/**
 * Starts a repeating chime alert with a 2-second pause between chimes.
 * Continues ringing until stopRepeatingAlert() is called or user acknowledges.
 */
export function startRepeatingAlert() {
  if (typeof window === "undefined") return;
  if (!isSoundEnabled()) return;

  unlockAudioContext();

  // Stop any existing loop first
  stopRepeatingAlert();

  alertIterationCount = 0;

  // Play immediately for turn 1
  playNotificationSound();
  alertIterationCount++;
  notifyAlertState(true);

  // Each chime lasts ~0.65s + 2s pause = 2.65s (2650ms) interval
  // Ensures exact 2-second pause between sounds as requested
  alertIntervalId = setInterval(() => {
    if (!isSoundEnabled() || alertIterationCount >= MAX_ALERT_ITERATIONS) {
      stopRepeatingAlert();
      return;
    }
    playNotificationSound();
    alertIterationCount++;
  }, 2650);
}

/**
 * Stops the repeating chime alert
 */
export function stopRepeatingAlert() {
  if (alertIntervalId) {
    clearInterval(alertIntervalId);
    alertIntervalId = null;
  }
  alertIterationCount = 0;
  notifyAlertState(false);
}
