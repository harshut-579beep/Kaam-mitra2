// Hindi Speech Synthesis helper for illiterate/semi-literate workers
let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speakHindiText(text: string, onEnd?: () => void): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  try {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.95; // slightly slower for maximum clarity
    utterance.pitch = 1.0;

    // Try finding a Hindi voice if available in browser
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('Hindi'));
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    utterance.onend = () => {
      currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      currentUtterance = null;
      if (onEnd) onEnd();
    };

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn('Speech synthesis error:', err);
    return false;
  }
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

export function isSpeaking(): boolean {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
}
