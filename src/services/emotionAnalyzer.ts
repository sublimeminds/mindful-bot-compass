
export class EmotionAnalyzer {
  analyze(text: string): string {
    // Simple emotion analysis based on keywords
    const emotions = {
      anxious: ['worried', 'anxious', 'nervous', 'scared', 'fear', 'panic'],
      sad: ['sad', 'depressed', 'down', 'hopeless', 'empty', 'lonely'],
      angry: ['angry', 'mad', 'furious', 'irritated', 'frustrated'],
      happy: ['happy', 'joy', 'excited', 'great', 'wonderful', 'amazing'],
      calm: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil']
    };

    const lowerText = text.toLowerCase();
    
    for (const [emotion, keywords] of Object.entries(emotions)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return emotion;
      }
    }
    
    return 'neutral';
  }
}
