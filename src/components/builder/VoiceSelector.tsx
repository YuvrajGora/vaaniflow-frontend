import React, { useState } from 'react';
import { Volume2, VolumeX, Mic, Check } from 'lucide-react';
import type { VoiceOption } from '../../types/agent';

interface VoiceSelectorProps {
  voices: VoiceOption[];
  selectedVoiceId: string;
  onSelectVoice: (voice: VoiceOption) => void;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  voices,
  selectedVoiceId,
  onSelectVoice
}) => {
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  const handlePlaySample = (e: React.MouseEvent, voice: VoiceOption) => {
    e.stopPropagation();

    // If currently playing, stop
    if (playingVoiceId === voice.id) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setPlayingVoiceId(null);
      return;
    }

    // Try Web SpeechSynthesis as client-side preview demonstration
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // stop any active speech
      const utterance = new SpeechSynthesisUtterance(voice.previewSampleText);

      // Attempt to pick matching gender or accent voice if available in browser
      const availableVoices = window.speechSynthesis.getVoices();
      if (voice.gender === 'female') {
        const femaleVoice = availableVoices.find(v => /female|samantha|zira|victoria|karen/i.test(v.name));
        if (femaleVoice) utterance.voice = femaleVoice;
      } else {
        const maleVoice = availableVoices.find(v => /male|david|george|daniel|alex/i.test(v.name));
        if (maleVoice) utterance.voice = maleVoice;
      }

      utterance.rate = 1.0;
      utterance.pitch = voice.gender === 'female' ? 1.05 : 0.95;

      utterance.onend = () => {
        setPlayingVoiceId(null);
      };
      utterance.onerror = () => {
        setPlayingVoiceId(null);
      };

      setPlayingVoiceId(voice.id);
      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback: visual simulation for 3 seconds
      setPlayingVoiceId(voice.id);
      setTimeout(() => setPlayingVoiceId(null), 3500);
    }
  };

  return (
    <div style={{ marginBottom: '1.75rem' }}>
      <label className="vf-label" style={{ marginBottom: '0.75rem' }}>
        <span>2. ElevenLabs Curated Voice Persona</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--cyan-400)' }}>
          Click "Preview Voice" to hear speech tone
        </span>
      </label>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '0.75rem'
        }}
      >
        {voices.map((voice) => {
          const isSelected = selectedVoiceId === voice.id;
          const isPlaying = playingVoiceId === voice.id;

          return (
            <div
              key={voice.id}
              onClick={() => onSelectVoice(voice)}
              style={{
                backgroundColor: isSelected ? 'var(--cyan-subtle)' : 'var(--bg-surface)',
                border: isSelected ? '1px solid var(--cyan-400)' : '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                position: 'relative'
              }}
            >
              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    top: '0.65rem',
                    right: '0.65rem',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--cyan-500)',
                    color: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Check size={12} strokeWidth={3} />
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: isSelected ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isSelected ? 'var(--cyan-400)' : 'var(--text-secondary)'
                  }}
                >
                  <Mic size={14} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>
                    {voice.name}
                  </h4>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {voice.accent} • {voice.gender}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', minHeight: '32px' }}>
                {voice.tone}
              </p>

              <button
                type="button"
                onClick={(e) => handlePlaySample(e, voice)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isPlaying ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                  border: isPlaying ? '1px solid var(--cyan-400)' : '1px solid var(--border-hairline)',
                  color: isPlaying ? 'var(--cyan-300)' : 'var(--text-secondary)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {isPlaying ? (
                  <>
                    <VolumeX size={13} />
                    <span>Stop Preview</span>
                  </>
                ) : (
                  <>
                    <Volume2 size={13} />
                    <span>Preview Voice</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
