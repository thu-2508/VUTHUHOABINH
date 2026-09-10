import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { audioService } from '../utils/audio';

interface SpeakerButtonProps {
  textToSpeak: string;
  contextPhrase?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SpeakerButton: React.FC<SpeakerButtonProps> = ({
  textToSpeak,
  contextPhrase,
  className = '',
  size = 'md',
}) => {
  const [isSpeakingThis, setIsSpeakingThis] = useState(false);

  useEffect(() => {
    const unsubscribe = audioService.subscribeSpeaking((speaking, text) => {
      if (speaking && text === textToSpeak) {
        setIsSpeakingThis(true);
      } else {
        setIsSpeakingThis(false);
      }
    });
    return () => unsubscribe();
  }, [textToSpeak]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!audioService.isSoundEnabled()) {
      return;
    }
    audioService.speak(textToSpeak, contextPhrase);
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      id={`speaker-btn-${textToSpeak.replace(/[^a-zA-Z0-9]/g, '-')}`}
      type="button"
      onClick={handleClick}
      title={`Listen pronunciation of "${textToSpeak}"`}
      aria-label={`Listen pronunciation of ${textToSpeak}`}
      className={`inline-flex items-center justify-center rounded-full transition-all duration-200 p-2 cursor-pointer focus:outline-none ${
        isSpeakingThis
          ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-300/60 shadow-[0_0_20px_rgba(251,191,36,0.8)] scale-110 animate-pulse'
          : 'bg-slate-800/80 text-cyan-300 hover:text-white hover:bg-cyan-600/60 border border-cyan-500/30 hover:border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
      } ${className}`}
    >
      {audioService.isSoundEnabled() ? (
        <Volume2 className={`${iconSizes[size]} transition-transform ${isSpeakingThis ? 'scale-125' : ''}`} />
      ) : (
        <VolumeX className={`${iconSizes[size]} text-slate-500`} />
      )}
    </button>
  );
};
