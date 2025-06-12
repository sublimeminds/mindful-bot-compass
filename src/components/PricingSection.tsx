
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Start your healing journey with basic AI therapy support",
    features: [
      "3 AI therapy sessions per month",
      "Basic mood tracking",
      "Limited goal setting (3 goals max)",
      "Community access",
      "Basic progress reports"
    ],
    buttonText: "Get Started Free",
    popular: false
  },
  {
    name: "Basic",
    price: "$9.99",
    period: "per month",
    yearlyPrice: "$99.99",
    description: "Extended AI therapy with enhanced features and insights",
    features: [
      "15 AI therapy sessions per month",
      "Advanced mood tracking with insights",
      "Unlimited goals with basic templates",
      "Email support",
      "Weekly progress reports",
      "Basic crisis detection"
    ],
    buttonText: "Start Basic Plan",
    popular: false
  },
  {
    name: "Premium",
    price: "$24.99",
    period: "per month",
    yearlyPrice: "$249.99",
    description: "Comprehensive AI therapy with unlimited access and advanced features",
    features: [
      "Unlimited AI therapy sessions",
      "Advanced therapeutic techniques (CBT, DBT, mindfulness)",
      "Personalized treatment plans",
      "Priority AI responses",
      "Advanced analytics and insights",
      "Crisis intervention protocols",
      "Export session transcripts",
      "Priority support"
    ],
    buttonText: "Start Premium Trial",
    popular: true
  }
];

const PricingSection = () => {
  const navigate = useNavigate();

  const handlePlanSelect = () => {
    navigate('/plans');
  };

  return (
    <section id="pricing" className="py-20 gradient-therapy">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Choose Your Healing Path
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start with our free plan or unlock the full potential of AI therapy with our paid plans. 
            Your mental health journey should be accessible to everyone.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in ${
                plan.popular 
                  ? 'ring-2 ring-therapy-500 scale-105' 
                  : ''
              } gradient-card`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-therapy-500 to-calm-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <Crown className="w-4 h-4" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-foreground mb-2">
                  {plan.name}
                </CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                  {plan.yearlyPrice && (
                    <div className="text-sm text-green-600 mt-1">
                      Save 17% with yearly billing (${plan.yearlyPrice}/year)
                    </div>
                  )}
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="pt-0">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-full flex-shrink-0"></div>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  onClick={handlePlanSelect}
                  className={`w-full py-3 text-lg font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white border-0 shadow-lg hover:shadow-xl'
                      : 'border-therapy-200 text-therapy-600 hover:bg-therapy-50'
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            All plans include end-to-end encryption and HIPAA-compliant security
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-calm-500 rounded-full"></div>
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-therapy-500 rounded-full"></div>
              <span>7-day free trial</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4 text-red-400" />
              <span>30-day money back</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
