import React from 'react';

const sections = [
  { id: 'hero', title: 'Welcome', description: 'Introduction to TherapySync' },
  { id: 'stats', title: 'Impact', description: 'Our global reach and success' },
  { id: 'features', title: 'Features', description: 'Advanced AI capabilities' },
  { id: 'demo', title: 'Demo', description: 'See AI therapy in action' },
  { id: 'testimonials', title: 'Reviews', description: 'User experiences' },
  { id: 'pricing', title: 'Pricing', description: 'Choose your plan' },
  { id: 'cta', title: 'Get Started', description: 'Begin your journey' }
];

class NativeProgressTracker extends React.Component {
  private observer: IntersectionObserver | null = null;
  private containerRef: React.RefObject<HTMLDivElement>;
  
  constructor(props: {}) {
    super(props);
    this.containerRef = React.createRef();
    this.state = {
      activeSection: 'hero',
      completedSections: [] as string[]
    };
  }

  componentDidMount() {
    try {
      this.initializeObserver();
    } catch (error) {
      console.error('NativeProgressTracker: Failed to initialize observer:', error);
    }
  }

  componentWillUnmount() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private initializeObserver = () => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          this.setState((prevState: any) => {
            const newCompletedSections = prevState.completedSections.includes(sectionId)
              ? prevState.completedSections
              : [...prevState.completedSections, sectionId];
            
            return {
              activeSection: sectionId,
              completedSections: newCompletedSections
            };
          });
        }
      });
    };

    this.observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    sections.forEach(section => {
      const element = document.getElementById(section.id);
      if (element && this.observer) {
        this.observer.observe(element);
      }
    });
  };

  private scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  render() {
    const state = this.state as { activeSection: string; completedSections: string[] };
    const completionPercentage = Math.round((state.completedSections.length / sections.length) * 100);

    return (
      <div 
        ref={this.containerRef}
        className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 hidden xl:block"
      >
        <div className="w-64 shadow-xl border-0 bg-white/95 backdrop-blur-sm rounded-lg overflow-hidden">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Page Progress</h3>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-therapy-500 to-calm-500 text-white">
                {completionPercentage}%
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-gradient-to-r from-therapy-500 to-calm-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>

            <div className="space-y-2">
              {sections.map((section) => {
                const isActive = state.activeSection === section.id;
                const isCompleted = state.completedSections.includes(section.id);
                
                return (
                  <button
                    key={section.id}
                    onClick={() => this.scrollToSection(section.id)}
                    className={`w-full text-left p-2 rounded-lg transition-all duration-200 hover:bg-therapy-50 ${
                      isActive ? 'bg-therapy-50 border-l-2 border-therapy-500' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isCompleted 
                          ? 'bg-therapy-500 border-therapy-500' 
                          : 'border-gray-400'
                      }`}>
                        {isCompleted && (
                          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                            <path d="M3 6L1.5 4.5 0 6l3 3 6-6-1.5-1.5L3 6z"/>
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className={`text-xs font-medium ${
                          isActive ? 'text-therapy-700' : isCompleted ? 'text-gray-700' : 'text-gray-500'
                        }`}>
                          {section.title}
                        </div>
                        <div className="text-xs text-gray-500 leading-tight">
                          {section.description}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NativeProgressTracker;