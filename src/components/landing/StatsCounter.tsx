
import React, { useState, useEffect } from 'react';
import { Users, MessageCircle, Heart, Star } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: 25000,
    label: "Users Helped",
    suffix: "+"
  },
  {
    icon: MessageCircle,
    value: 150000,
    label: "Sessions Completed",
    suffix: "+"
  },
  {
    icon: Heart,
    value: 98,
    label: "Satisfaction Rate",
    suffix: "%"
  },
  {
    icon: Star,
    value: 4.9,
    label: "Average Rating",
    suffix: "/5"
  }
];

const AnimatedNumber = ({ value, suffix, isVisible }: { value: number; suffix: string; isVisible: boolean }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <span>
      {suffix === "/5" ? displayValue.toFixed(1) : displayValue.toLocaleString()}{suffix}
    </span>
  );
};

const StatsCounter = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('stats-counter');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="stats-counter" className="py-16 bg-gradient-to-r from-harmony-500 via-balance-500 to-flow-600">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center text-white">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-white/30 rounded-full border border-white/40 shadow-lg">
                    <IconComponent className="h-6 w-6" />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-2">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} isVisible={isVisible} />
                </div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
