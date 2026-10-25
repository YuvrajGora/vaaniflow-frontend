import React from 'react';
import { Stethoscope, Wrench, Building, Scale, Sparkles, Utensils, Cpu } from 'lucide-react';
import type { BusinessCategory, BusinessTemplate } from '../../types/agent';

interface BusinessTypeSelectorProps {
  templates: BusinessTemplate[];
  selectedCategory: BusinessCategory;
  onSelect: (template: BusinessTemplate) => void;
}

const getTemplateIcon = (id: BusinessCategory) => {
  switch (id) {
    case 'dental':
      return <Stethoscope size={20} />;
    case 'auto_repair':
      return <Wrench size={20} />;
    case 'real_estate':
      return <Building size={20} />;
    case 'law_firm':
      return <Scale size={20} />;
    case 'salon_spa':
      return <Sparkles size={20} />;
    case 'restaurant':
      return <Utensils size={20} />;
    default:
      return <Cpu size={20} />;
  }
};

export const BusinessTypeSelector: React.FC<BusinessTypeSelectorProps> = ({
  templates,
  selectedCategory,
  onSelect
}) => {
  return (
    <div style={{ marginBottom: '1.75rem' }}>
      <label className="vf-label" style={{ marginBottom: '0.75rem' }}>
        <span>1. Select Business Category</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--cyan-400)' }}>
          Loads industry-specific receptionist prompt & FAQs
        </span>
      </label>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '0.75rem'
        }}
      >
        {templates.map((tpl) => {
          const isSelected = selectedCategory === tpl.id;
          return (
            <div
              key={tpl.id}
              onClick={() => onSelect(tpl)}
              style={{
                backgroundColor: isSelected ? 'var(--cyan-subtle)' : 'var(--bg-surface)',
                border: isSelected ? '1px solid var(--cyan-400)' : '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                padding: '0.9rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                boxShadow: isSelected ? '0 0 15px rgba(6, 182, 212, 0.15)' : 'none'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  marginBottom: '0.35rem'
                }}
              >
                <div
                  style={{
                    color: isSelected ? 'var(--cyan-300)' : 'var(--text-secondary)'
                  }}
                >
                  {getTemplateIcon(tpl.id)}
                </div>
                <h4
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: isSelected ? '#fff' : 'var(--text-primary)'
                  }}
                >
                  {tpl.label}
                </h4>
              </div>

              <p
                style={{
                  fontSize: '0.74rem',
                  color: isSelected ? 'var(--text-secondary)' : 'var(--text-muted)',
                  lineHeight: 1.35
                }}
              >
                {tpl.shortDesc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
