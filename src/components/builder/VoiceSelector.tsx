import React, { useState } from 'react';
import { Volume2, VolumeX, Check } from 'lucide-react';
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

  const isSpeechAvailable = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const handlePlaySample = (e: React.MouseEvent, voice: VoiceOption) => {
    e.stopPropagation();

    if (playingVoiceId === voice.id) {
      if (isSpeechAvailable) {
        window.speechSynthesis.cancel();
      }
      setPlayingVoiceId(null);
      return;
    }

    if (isSpeechAvailable) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(voice.previewSampleText);

      const availableVoices = window.speechSynthesis.getVoices();
      if (voice.gender === 'female') {
        const femaleVoice = availableVoices.find((v) => /female|samantha|zira|victoria|karen/i.test(v.name));
        if (femaleVoice) utterance.voice = femaleVoice;
      } else {
        const maleVoice = availableVoices.find((v) => /male|david|george|daniel|alex/i.test(v.name));
        if (maleVoice) utterance.voice = maleVoice;
      }

      utterance.rate = 0.98;
      utterance.pitch = voice.gender === 'female' ? 1.05 : 0.95;

      utterance.onend = () => setPlayingVoiceId(null);
      utterance.onerror = () => setPlayingVoiceId(null);

      setPlayingVoiceId(voice.id);
      window.speechSynthesis.speak(utterance);
    } else {
      // Audio preview unavailable in this environment
      setPlayingVoiceId(null);
    }
  };

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
        <label className="vf-label" style={{ margin: 0 }}>
          <span>Curated ElevenLabs Voice Persona</span>
        </label>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          {isSpeechAvailable ? 'Click "Sample Voice" to hear tone' : 'Browser audio preview unavailable'}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
        {voices.map((voice) => {
          const isSelected = selectedVoiceId === voice.id;
          const isPlaying = playingVoiceId === voice.id;

          return (
            <div
              key={voice.id}
              onClick={() => onSelectVoice(voice)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                backgroundColor: isSelected ? 'var(--accent-subtle)' : 'var(--bg-surface-warm)',
                border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-default)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                gap: '1rem',
                flexWrap: 'wrap'
              }}
            >
              {/* Left: Radio check + Voice details */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '220px' }}>
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: isSelected ? '2px solid var(--accent-primary)' : '2px solid var(--border-default)',
                    backgroundColor: isSelected ? 'var(--accent-primary)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    flexShrink: 0
                  }}
                >
                  {isSelected && <Check size={11} strokeWidth={3} />}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {voice.name}
                    </span>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        color: 'var(--text-muted)',
                        backgroundColor: 'var(--bg-surface-muted)',
                        padding: '0.1rem 0.4rem',
                        borderRadius: 'var(--radius-xs)'
                      }}
                    >
                      {voice.accent} • {voice.gender}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, marginTop: '0.15rem' }}>
                    {voice.tone}
                  </p>
                </div>
              </div>

              {/* Right: Audio preview button */}
              <button
                type="button"
                onClick={(e) => handlePlaySample(e, voice)}
                disabled={!isSpeechAvailable}
                title={isSpeechAvailable ? 'Preview voice audio sample' : 'Audio preview not supported in this browser'}
                style={{
                  background: isPlaying ? 'var(--accent-primary)' : 'var(--bg-surface)',
                  border: isPlaying ? '1px solid var(--accent-primary)' : '1px solid var(--border-default)',
                  color: isPlaying ? '#FFFFFF' : 'var(--text-secondary)',
                  padding: '0.35rem 0.65rem',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  cursor: isSpeechAvailable ? 'pointer' : 'not-allowed',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {isPlaying ? (
                  <>
                    <VolumeX size={13} />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Volume2 size={13} />
                    <span>Sample Voice</span>
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
