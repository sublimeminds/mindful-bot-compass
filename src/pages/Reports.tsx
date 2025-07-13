import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  BarChart3, 
  FileText, 
  Calendar, 
  Users, 
  Brain, 
  CheckCircle, 
  ArrowRight,
  Download,
  Share2,
  Eye,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';

const Reports = () => {
  const navigate = useNavigate();

  const reportTypes = [
    {
      icon: TrendingUp,
      title: "Progress Reports",
      description: "Comprehensive therapy progress with mood trends, goal achievements, and insights",
      features: ["Mood analysis", "Goal tracking", "Session summaries", "AI insights"],
      badge: "Popular",
      frequency: "Weekly, Monthly, Quarterly"
    },
    {
      icon: Brain,
      title: "Mental Health Assessments",
      description: "Clinical assessment results with standardized scoring and recommendations",
      features: ["PHQ-9 scores", "GAD-7 results", "Custom assessments", "Trend analysis"],
      badge: "Clinical",
      frequency: "Per Assessment"
    },
    {
      icon: Users,
      title: "Family Reports",
      description: "Shared family mental health insights with privacy controls and summaries",
      features: ["Family trends", "Individual summaries", "Privacy settings", "Shared goals"],
      badge: "Family",
      frequency: "Monthly"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Advanced analytics with custom metrics, comparisons, and data visualization",
      features: ["Custom metrics", "Data visualization", "Export options", "Real-time updates"],
      badge: "Pro",
      frequency: "Real-time"
    }
  ];

  const reportFeatures = [
    {
      icon: Download,
      title: "Multiple Formats",
      description: "Export reports in PDF, Excel, or CSV formats for easy sharing and analysis"
    },
    {
      icon: Share2,
      title: "Secure Sharing",
      description: "Share reports with healthcare providers, family, or therapists with privacy controls"
    },
    {
      icon: Calendar,
      title: "Automated Scheduling",
      description: "Schedule automatic report generation and delivery via email or app notifications"
    },
    {
      icon: Eye,
      title: "Privacy Controls",
      description: "Fine-grained privacy settings to control what data is included in each report"
    }
  ];

  const use_cases = [
    {
      title: "Individual Therapy",
      description: "Track personal progress and share insights with your therapist",
      icon: Users,
      benefits: ["Self-awareness", "Therapy preparation", "Progress validation"]
    },
    {
      title: "Healthcare Providers",
      description: "Comprehensive patient reports for clinical decision-making",
      icon: FileText,
      benefits: ["Clinical insights", "Treatment planning", "Outcome measurement"]
    },
    {
      title: "Family Support",
      description: "Family mental health overview with individual privacy protection",
      icon: Users,
      benefits: ["Family awareness", "Shared goals", "Support coordination"]
    },
    {
      title: "Research & Analytics",
      description: "Anonymized data insights for research and population health studies",
      icon: BarChart3,
      benefits: ["Research data", "Population insights", "Outcome studies"]
    }
  ];

  return (
    <SafeComponentWrapper name="Reports">
      <Helmet>
        <title>Progress Reports & Analytics - TherapySync Insights</title>
        <meta name="description" content="Comprehensive therapy progress reports and analytics. Track mental health progress, generate clinical reports, and share insights with providers and family." />
        <meta name="keywords" content="therapy reports, progress tracking, mental health analytics, clinical reports, therapy insights" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-therapy-50/30">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-therapy-100 text-therapy-700 text-sm font-medium mb-6">
              <TrendingUp className="w-4 h-4 mr-2" />
              Data-Driven Insights
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold therapy-text-gradient mb-6">
              Progress Reports & Analytics
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your therapy data into actionable insights. Comprehensive reports for individuals, 
              families, and healthcare providers with advanced privacy controls.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="px-8 py-3 therapy-gradient text-white hover:shadow-lg transition-all duration-300"
                onClick={() => navigate('/auth')}
              >
                Generate Your Report
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-3 border-therapy-200 text-therapy-600 hover:bg-therapy-50"
                onClick={() => navigate('/demo')}
              >
                <Eye className="mr-2 h-5 w-5" />
                View Sample Report
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold therapy-text-gradient">50+</div>
                <div className="text-sm text-gray-600">Report Types</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold therapy-text-gradient">100%</div>
                <div className="text-sm text-gray-600">HIPAA Compliant</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold therapy-text-gradient">5</div>
                <div className="text-sm text-gray-600">Export Formats</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold therapy-text-gradient">24/7</div>
                <div className="text-sm text-gray-600">Report Access</div>
              </div>
            </div>
          </div>
        </section>

        {/* Report Types */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Comprehensive Report Suite</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From personal progress tracking to clinical assessments, get the insights you need
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {reportTypes.map((report, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-therapy-500 to-calm-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                        <report.icon className="h-6 w-6" />
                      </div>
                      <Badge variant="secondary" className="bg-therapy-100 text-therapy-700">
                        {report.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl mb-2">{report.title}</CardTitle>
                    <CardDescription className="text-gray-600 text-base mb-4">
                      {report.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      {report.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-therapy-500 mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center text-sm text-therapy-600 font-medium">
                      <Clock className="h-4 w-4 mr-2" />
                      {report.frequency}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Report Features */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Advanced Report Features</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Powerful features to customize, share, and protect your mental health data
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {reportFeatures.map((feature, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white text-center">
                  <CardHeader>
                    <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-r from-therapy-500 to-calm-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 mb-4`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg mb-2">{feature.title}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Who Benefits from Reports</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Tailored reports for different stakeholders in your mental health journey
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {use_cases.map((useCase, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-start mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-therapy-500 to-calm-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 mr-4`}>
                        <useCase.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl mb-2">{useCase.title}</CardTitle>
                        <CardDescription className="text-gray-600 text-base">
                          {useCase.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {useCase.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-therapy-500 mr-2 flex-shrink-0" />
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="bg-gradient-to-r from-therapy-500 to-calm-500 rounded-3xl p-12 text-white">
              <h2 className="text-4xl font-bold mb-6">Start Tracking Your Progress</h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Get detailed insights into your mental health journey with comprehensive reports and analytics
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="px-8 py-3 bg-white text-therapy-600 hover:bg-gray-100"
                  onClick={() => navigate('/auth')}
                >
                  Generate Your First Report
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="px-8 py-3 border-white text-white hover:bg-white/10"
                  onClick={() => navigate('/pricing')}
                >
                  <FileText className="mr-2 h-5 w-5" />
                  View Pricing Plans
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </SafeComponentWrapper>
  );
};

export default Reports;