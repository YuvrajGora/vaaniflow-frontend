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
      return <Stethoscope size={18} />;
    case 'auto_repair':
      return <Wrench size={18} />;
    case 'real_estate':
      return <Building size={18} />;
    case 'law_firm':
      return <Scale size={18} />;
    case 'salon_spa':
      return <Sparkles size={18} />;
    case 'restaurant':
      return <Utensils size={18} />;
    default:
      return <Cpu size={18} />;
  }
};

export const BusinessTypeSelector: React.FC<BusinessTypeSelectorProps> = ({
  templates,
  selectedCategory,
  onSelect
}) => {
  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
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
                backgroundColor: isSelected ? 'var(--accent-subtle)' : 'var(--bg-surface-warm)',
                border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-default)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.85rem 1rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.25rem'
                }}
              >
                <div
                  style={{
                    color: isSelected ? 'var(--accent-primary)' : 'var(--text-muted)'
                  }}
                >
                  {getTemplateIcon(tpl.id)}
                </div>
                <h4
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)'
                  }}
                >
                  {tpl.label}
                </h4>
              </div>

              <p
                style={{
                  fontSize: '0.74rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.35,
                  margin: 0
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
