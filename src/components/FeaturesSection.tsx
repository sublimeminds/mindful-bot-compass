
import { Bot, Heart, User, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TreeLogo from "@/components/ui/TreeLogo";

const features = [
  {
    icon: Bot,
    title: "AI-Powered Therapy",
    description: "Advanced AI trained on therapeutic techniques to provide personalized support and guidance.",
    useTreeLogo: true
  },
  {
    icon: Heart,
    title: "Emotional Support",
    description: "Get help with anxiety, depression, trauma, and other emotional challenges in a safe space.",
    useTreeLogo: false
  },
  {
    icon: User,
    title: "Personalized Sessions",
    description: "Tailored therapy sessions that adapt to your unique needs and progress over time.",
    useTreeLogo: true
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Connect with others on similar journeys through our supportive community features.",
    useTreeLogo: false
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <TreeLogo 
              size="lg"
              animated={true}
              variant="breathing"
              className="drop-shadow-sm"
            />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Why Choose TherapySync?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI therapy platform combines cutting-edge technology with proven therapeutic approaches 
            to provide you with the support you need, when you need it.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in gradient-card group hover:animate-tree-grow"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-therapy-500 to-calm-500 rounded-xl mx-auto mb-4 group-hover:animate-tree-breathe">
                  {feature.useTreeLogo ? (
                    <TreeLogo 
                      size="md"
                      animated={true}
                      variant="hovering"
                      className="filter brightness-0 invert"
                    />
                  ) : (
                    <feature.icon className="h-8 w-8 text-white" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Brand reinforcement section */}
        <div className="mt-16 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <span>Powered by</span>
            <TreeLogo 
              size="sm"
              animated={true}
              variant="breathing"
              className="opacity-60"
            />
            <span className="font-medium text-therapy-600">TherapySync AI</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
