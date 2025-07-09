import { describe, it, expect } from 'vitest';
import { therapistPersonas } from '@/components/avatar/TherapistAvatarPersonas';

describe('TherapistAvatarPersonas', () => {
  it('contains all required therapist personas', () => {
    const expectedPersonas = [
      'dr-sarah-chen',
      'dr-marcus-rodriguez',
      'dr-aisha-patel',
      'dr-james-wilson',
      'dr-emily-rodriguez',
      'dr-david-kim',
      'dr-michael-torres'
    ];

    expectedPersonas.forEach(personaId => {
      expect(therapistPersonas).toHaveProperty(personaId);
    });
  });

  it('validates persona data structure', () => {
    Object.entries(therapistPersonas).forEach(([id, persona]) => {
      // Check required fields
      expect(persona).toHaveProperty('name');
      expect(persona).toHaveProperty('appearance');
      expect(persona).toHaveProperty('personality');

      // Validate name is not empty
      expect(persona.name).toBeTruthy();
      expect(typeof persona.name).toBe('string');

      // Validate appearance structure
      expect(persona.appearance).toHaveProperty('colorPalette');
      expect(persona.appearance.colorPalette).toHaveProperty('skin');
      expect(persona.appearance.colorPalette).toHaveProperty('hair');
      expect(persona.appearance.colorPalette).toHaveProperty('eyes');

      // Validate color values are hex codes
      expect(persona.appearance.colorPalette.hair).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(persona.appearance.colorPalette.skin).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(persona.appearance.colorPalette.eyes).toMatch(/^#[0-9A-Fa-f]{6}$/);

      // Validate personality values
      expect(persona.personality.gestureFrequency).toBeGreaterThanOrEqual(0);
      expect(persona.personality.gestureFrequency).toBeLessThanOrEqual(1);
    });
  });

  it('has unique names for all personas', () => {
    const names = Object.values(therapistPersonas).map(p => p.name);
    const uniqueNames = new Set(names);
    
    expect(uniqueNames.size).toBe(names.length);
  });

  it('has valid clothing styles', () => {
    const validStyles = ['professional', 'casual', 'warm'];
    
    Object.values(therapistPersonas).forEach(persona => {
      expect(validStyles).toContain(persona.appearance.clothingStyle);
    });
  });

  it('validates personality ranges', () => {
    Object.values(therapistPersonas).forEach(persona => {
      expect(persona.personality.gestureFrequency).toBeGreaterThanOrEqual(0);
      expect(persona.personality.gestureFrequency).toBeLessThanOrEqual(1);
      expect(persona.personality.facialExpressiveness).toBeGreaterThanOrEqual(0);
      expect(persona.personality.facialExpressiveness).toBeLessThanOrEqual(1);
    });
  });

  it('has consistent data structure across all personas', () => {
    const personaKeys = Object.keys(therapistPersonas);
    const firstPersona = therapistPersonas[personaKeys[0]];

    personaKeys.forEach(key => {
      const persona = therapistPersonas[key];
      
      expect(persona).toHaveProperty('name');
      expect(persona).toHaveProperty('appearance');
      expect(persona).toHaveProperty('personality');

      // Ensure appearance has same structure
      Object.keys(firstPersona.appearance).forEach(appearanceKey => {
        expect(persona.appearance).toHaveProperty(appearanceKey);
      });

      // Ensure personality has same structure
      Object.keys(firstPersona.personality).forEach(personalityKey => {
        expect(persona.personality).toHaveProperty(personalityKey);
      });
    });
  });
});