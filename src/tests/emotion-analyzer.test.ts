import { describe, it, expect, beforeEach } from 'vitest';
import { EnhancedEmotionAnalyzer } from '@/services/enhanced-emotion-analyzer';
import { emotionTestData } from './setup-3d';

describe('EnhancedEmotionAnalyzer', () => {
  let analyzer: EnhancedEmotionAnalyzer;

  beforeEach(() => {
    analyzer = new EnhancedEmotionAnalyzer();
  });

  describe('Basic Emotion Detection', () => {
    it('should detect happy emotions correctly', () => {
      emotionTestData.happy.forEach(text => {
        const result = analyzer.analyze(text);
        expect(result.emotion).toBe('happy');
        expect(result.confidence).toBeGreaterThan(0.5);
        expect(result.valence).toBeGreaterThan(0);
      });
    });

    it('should detect sad emotions correctly', () => {
      emotionTestData.sad.forEach(text => {
        const result = analyzer.analyze(text);
        expect(result.emotion).toBe('sad');
        expect(result.confidence).toBeGreaterThan(0.5);
        expect(result.valence).toBeLessThan(0);
      });
    });

    it('should detect anxious emotions correctly', () => {
      emotionTestData.anxious.forEach(text => {
        const result = analyzer.analyze(text);
        expect(result.emotion).toBe('anxious');
        expect(result.confidence).toBeGreaterThan(0.5);
        expect(result.arousal).toBeGreaterThan(0.7);
      });
    });

    it('should detect angry emotions correctly', () => {
      emotionTestData.angry.forEach(text => {
        const result = analyzer.analyze(text);
        expect(result.emotion).toBe('angry');
        expect(result.confidence).toBeGreaterThan(0.5);
        expect(result.valence).toBeLessThan(0);
        expect(result.arousal).toBeGreaterThan(0.5);
      });
    });

    it('should detect calm emotions correctly', () => {
      emotionTestData.calm.forEach(text => {
        const result = analyzer.analyze(text);
        expect(result.emotion).toBe('calm');
        expect(result.confidence).toBeGreaterThan(0.5);
        expect(result.arousal).toBeLessThan(0.3);
      });
    });

    it('should default to neutral for non-emotional text', () => {
      emotionTestData.neutral.forEach(text => {
        const result = analyzer.analyze(text);
        expect(result.emotion).toBe('neutral');
        expect(result.valence).toBeCloseTo(0, 1);
      });
    });
  });

  describe('Intensity Detection', () => {
    it('should detect higher intensity with intensifiers', () => {
      const basic = analyzer.analyze('I am happy');
      const intensified = analyzer.analyze('I am extremely happy');
      
      expect(intensified.intensity).toBeGreaterThan(basic.intensity);
      expect(intensified.confidence).toBeGreaterThan(basic.confidence);
    });

    it('should detect higher intensity with repetition', () => {
      const basic = analyzer.analyze('I am sad');
      const repeated = analyzer.analyze('I am sad sad sad');
      
      expect(repeated.intensity).toBeGreaterThan(basic.intensity);
    });

    it('should detect higher intensity with longer text', () => {
      const short = analyzer.analyze('Happy');
      const long = analyzer.analyze('I am feeling so incredibly happy and joyful today, everything is wonderful!');
      
      expect(long.intensity).toBeGreaterThan(short.intensity);
    });
  });

  describe('Negation Handling', () => {
    it('should reduce emotion confidence with negation', () => {
      const positive = analyzer.analyze('I am happy');
      const negated = analyzer.analyze('I am not happy');
      
      expect(negated.confidence).toBeLessThan(positive.confidence);
    });

    it('should handle double negatives', () => {
      const result = analyzer.analyze('I am not unhappy');
      expect(result.confidence).toBeGreaterThan(0);
    });
  });

  describe('Context Awareness', () => {
    it('should apply time of day modifiers', () => {
      const morningContext = { timeOfDay: 'morning' as const };
      const nightContext = { timeOfDay: 'night' as const };
      
      const morningResult = analyzer.analyze('I feel okay', morningContext);
      const nightResult = analyzer.analyze('I feel okay', nightContext);
      
      expect(morningResult.valence).toBeGreaterThan(nightResult.valence);
    });

    it('should apply session duration modifiers', () => {
      const shortContext = { sessionDuration: 300 }; // 5 minutes
      const longContext = { sessionDuration: 2400 }; // 40 minutes
      
      const shortResult = analyzer.analyze('I feel tired', shortContext);
      const longResult = analyzer.analyze('I feel tired', longContext);
      
      expect(longResult.valence).toBeLessThan(shortResult.valence);
    });

    it('should consider previous emotion context', () => {
      const context = { previousEmotion: 'sad' };
      const result = analyzer.analyze('I feel better', context);
      
      expect(result).toBeDefined();
      expect(result.emotion).not.toBe('sad');
    });
  });

  describe('Emotional Journey Analysis', () => {
    it('should analyze multiple texts in sequence', () => {
      const texts = [
        'I feel terrible today',
        'Things are getting a bit better',
        'I am feeling much happier now'
      ];
      
      const journey = analyzer.analyzeEmotionalJourney(texts);
      
      expect(journey).toHaveLength(3);
      expect(journey[0].emotion).toBe('sad');
      expect(journey[2].emotion).toBe('happy');
      expect(journey[2].valence).toBeGreaterThan(journey[0].valence);
    });
  });

  describe('Emotion Transitions', () => {
    it('should calculate smooth transitions for similar emotions', () => {
      const transition = analyzer.getEmotionTransition('happy', 'grateful');
      expect(transition.transition).toBe('smooth');
      expect(transition.naturalness).toBeGreaterThan(0.7);
    });

    it('should calculate abrupt transitions for opposite emotions', () => {
      const transition = analyzer.getEmotionTransition('happy', 'sad');
      expect(transition.transition).toBe('abrupt');
      expect(transition.intensity).toBeGreaterThan(0.7);
    });

    it('should handle same emotion transitions', () => {
      const transition = analyzer.getEmotionTransition('neutral', 'neutral');
      expect(transition.transition).toBe('smooth');
      expect(transition.intensity).toBeLessThan(0.3);
    });
  });

  describe('Facial Expression Mapping', () => {
    it('should map happy emotion to appropriate facial expression', () => {
      const expression = analyzer.mapEmotionToFacialExpression('happy', 0.8);
      
      expect(expression.mouth).toBeGreaterThan(0.5);
      expect(expression.eyes).toBeGreaterThan(0.5);
      expect(expression.cheeks).toBeGreaterThan(0.3);
    });

    it('should map sad emotion to appropriate facial expression', () => {
      const expression = analyzer.mapEmotionToFacialExpression('sad', 0.8);
      
      expect(expression.mouth).toBeLessThan(0);
      expect(expression.eyebrows).toBeLessThan(0);
    });

    it('should scale expressions by intensity', () => {
      const lowIntensity = analyzer.mapEmotionToFacialExpression('angry', 0.3);
      const highIntensity = analyzer.mapEmotionToFacialExpression('angry', 0.9);
      
      expect(Math.abs(highIntensity.eyebrows)).toBeGreaterThan(Math.abs(lowIntensity.eyebrows));
      expect(Math.abs(highIntensity.mouth)).toBeGreaterThan(Math.abs(lowIntensity.mouth));
    });

    it('should handle neutral emotion', () => {
      const expression = analyzer.mapEmotionToFacialExpression('neutral', 0.5);
      
      expect(expression.eyebrows).toBeCloseTo(0, 1);
      expect(expression.eyes).toBeCloseTo(0, 1);
      expect(expression.mouth).toBeCloseTo(0, 1);
      expect(expression.cheeks).toBeCloseTo(0, 1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty strings', () => {
      const result = analyzer.analyze('');
      expect(result.emotion).toBe('neutral');
      expect(result.confidence).toBeLessThan(0.7);
    });

    it('should handle very long texts', () => {
      const longText = 'happy '.repeat(1000);
      const result = analyzer.analyze(longText);
      expect(result.emotion).toBe('happy');
      expect(result.intensity).toBeGreaterThan(0.8);
    });

    it('should handle mixed emotions', () => {
      const result = analyzer.analyze('I am happy but also sad and worried');
      expect(result.emotion).toBeTruthy();
      expect(result.secondary).toBeTruthy();
    });

    it('should handle questions', () => {
      const statement = analyzer.analyze('I am confused');
      const question = analyzer.analyze('Am I confused?');
      
      expect(question.confidence).toBeLessThan(statement.confidence);
    });

    it('should handle special characters and punctuation', () => {
      const result = analyzer.analyze('I am SO!!! happy!!! 😊🎉');
      expect(result.emotion).toBe('happy');
      expect(result.intensity).toBeGreaterThan(0.5);
    });
  });

  describe('Performance', () => {
    it('should analyze emotions quickly', () => {
      const start = performance.now();
      
      for (let i = 0; i < 100; i++) {
        analyzer.analyze('I am feeling great today!');
      }
      
      const end = performance.now();
      const avgTime = (end - start) / 100;
      
      expect(avgTime).toBeLessThan(5); // Should be under 5ms per analysis
    });

    it('should handle batch analysis efficiently', () => {
      const texts = Array(50).fill(0).map((_, i) => `Text ${i}: I feel ${i % 2 === 0 ? 'happy' : 'sad'}`);
      
      const start = performance.now();
      const results = analyzer.analyzeEmotionalJourney(texts);
      const end = performance.now();
      
      expect(results).toHaveLength(50);
      expect(end - start).toBeLessThan(100); // Should complete in under 100ms
    });
  });
});