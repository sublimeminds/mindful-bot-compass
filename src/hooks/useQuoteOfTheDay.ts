
import { useState, useEffect } from 'react';

const inspirationalQuotes = [
  "Every moment is a fresh beginning.",
  "You are stronger than you think and more capable than you imagine.",
  "Progress, not perfection, is the goal.",
  "Your mental health is just as important as your physical health.",
  "Healing isn't linear, and that's perfectly okay.",
  "You have survived 100% of your worst days so far.",
  "Growth begins at the end of your comfort zone.",
  "Be patient with yourself. You're doing better than you think.",
  "Your feelings are valid, and you deserve support.",
  "Every small step forward is still progress.",
  "You are worthy of love, care, and compassion.",
  "Today is a new opportunity to take care of yourself.",
  "Your journey is unique, and that makes it beautiful.",
  "Self-care isn't selfish; it's necessary.",
  "You have the power to create positive change in your life."
];

export const useQuoteOfTheDay = () => {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    // Get today's date as a seed for consistent daily quotes
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    
    // Use the day of year to select a consistent quote for the day
    const quoteIndex = dayOfYear % inspirationalQuotes.length;
    setQuote(inspirationalQuotes[quoteIndex]);
  }, []);

  return { quote };
};
