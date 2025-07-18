import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  FileText, 
  Database, 
  Lock, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Shield,
  Globe,
  FileSpreadsheet,
  Archive,
  Share2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';

const DataExport = () => {
  const navigate = useNavigate();

  const exportFormats = [
    {
      icon: FileText,
      title: "Clinical PDF Reports",
      description: "Professional therapy reports in PDF format for healthcare providers and personal records",
      features: ["Session summaries", "Progress charts", "Clinical notes", "HIPAA compliant"],
      badge: "Popular",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      icon: FileSpreadsheet,
      title: "Data Spreadsheets",
      description: "Raw therapy data in Excel/CSV format for personal analysis and research purposes",
      features: ["Mood tracking data", "Session logs", "Goal progress", "Assessment results"],
      badge: "Pro",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: Archive,
      title: "Complete Backup Archive",
      description: "Full account backup including all conversations, media files, and account settings",
      features: ["All conversations", "Voice recordings", "Assessment data", "Account settings"],
      badge: "Complete",
      gradient: "from-purple-500 to-violet-600"
    },
    {
      icon: Database,
      title: "API Data Access",
      description: "Real-time data access through secure APIs for healthcare system integration",
      features: ["Real-time sync", "Automated exports", "Custom formats", "Developer tools"],
      badge: "Enterprise",
      gradient: "from-orange-500 to-amber-600"
    }
  ];

  const exportFeatures = [
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "All exports maintain strict HIPAA compliance with encrypted transmission and storage"
    },
    {
      icon: Lock,
      title: "Password Protection",
      description: "Optional password protection and encryption for sensitive therapy data exports"
    },
    {
      icon: Clock,
      title: "Scheduled Exports",
      description: "Automate regular data exports with customizable schedules and delivery options"
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Export data in compliance with international privacy laws including GDPR"
    }
  ];

  const useCases = [
    {
      title: "Healthcare Provider Sharing",
      description: "Share comprehensive therapy data with your healthcare team",
      icon: Share2,
      benefits: ["Clinical reports", "Progress summaries", "Assessment results", "Treatment history"]
    },
    {
      title: "Personal Records",
      description: "Maintain personal copies of your mental health journey",
      icon: Archive,
      benefits: ["Backup insurance", "Personal analysis", "Long-term tracking", "Data ownership"]
    },
    {
      title: "Research Participation",
      description: "Contribute anonymized data to mental health research studies",
      icon: Database,
      benefits: ["Research contribution", "Anonymous sharing", "Scientific impact", "Data insights"]
    },
    {
      title: "Platform Migration",
      description: "Move your data when switching therapy platforms or providers",
      icon: Globe,
      benefits: ["Platform independence", "Data portability", "Easy transitions", "No vendor lock-in"]
    }
  ];

  return (
    <SafeComponentWrapper name="DataExport">
      <Helmet>
        <title>Data Export & Portability - TherapySync Data Control</title>
        <meta name="description" content="Export your therapy data in multiple formats. HIPAA-compliant PDF reports, Excel exports, complete archives, and API integration for data portability." />
        <meta name="keywords" content="data export, therapy data, HIPAA compliant, PDF reports, data portability, backup" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-therapy-50/30">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-therapy-100 text-therapy-700 text-sm font-medium mb-6">
              <Download className="w-4 h-4 mr-2" />
              Your Data, Your Control
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold therapy-text-gradient mb-6">
              Data Export & Portability
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Take complete control of your therapy data. Export in multiple formats, share with healthcare providers, 
              or maintain personal records with enterprise-grade security and privacy.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="px-8 py-3 therapy-gradient text-white hover:shadow-lg transition-all duration-300"
                onClick={() => navigate('/auth')}
              >
                Export Your Data
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-3 border-therapy-200 text-therapy-600 hover:bg-therapy-50"
                onClick={() => navigate('/privacy')}
              >
                <Shield className="mr-2 h-5 w-5" />
                Privacy & Security
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold therapy-text-gradient">4</div>
                <div className="text-sm text-gray-600">Export Formats</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold therapy-text-gradient">100%</div>
                <div className="text-sm text-gray-600">HIPAA Compliant</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold therapy-text-gradient">24h</div>
                <div className="text-sm text-gray-600">Export Processing</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold therapy-text-gradient">∞</div>
                <div className="text-sm text-gray-600">Export Frequency</div>
              </div>
            </div>
          </div>
        </section>

        {/* Export Formats */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Multiple Export Formats</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose the format that works best for your needs, from clinical reports to raw data analysis
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {exportFormats.map((format, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-therapy-500 to-calm-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                        <format.icon className="h-6 w-6" />
                      </div>
                      <Badge variant="secondary" className="bg-therapy-100 text-therapy-700">
                        {format.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl mb-2">{format.title}</CardTitle>
                    <CardDescription className="text-gray-600 text-base mb-4">
                      {format.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {format.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-therapy-500 mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Export Features */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Enterprise-Grade Security</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Your therapy data is protected with the highest security standards during export and sharing
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {exportFeatures.map((feature, index) => (
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
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Common Export Use Cases</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                See how users leverage data exports for various purposes while maintaining privacy and security
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {useCases.map((useCase, index) => (
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

        {/* Export Process */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Simple Export Process</h2>
              <p className="text-xl text-gray-600">
                Export your data in three easy steps with complete transparency and control
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-therapy-100 rounded-full flex items-center justify-center text-therapy-600 font-bold text-xl mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Choose Format</h3>
                <p className="text-gray-600">Select your preferred export format and customize data inclusion settings</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-therapy-100 rounded-full flex items-center justify-center text-therapy-600 font-bold text-xl mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Processing</h3>
                <p className="text-gray-600">Your data is securely processed and packaged with enterprise-grade encryption</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-therapy-100 rounded-full flex items-center justify-center text-therapy-600 font-bold text-xl mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">Download & Share</h3>
                <p className="text-gray-600">Receive your export via secure download link or share directly with providers</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="bg-gradient-to-r from-therapy-500 to-calm-500 rounded-3xl p-12 text-white">
              <h2 className="text-4xl font-bold mb-6">Take Control of Your Data</h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Your therapy data belongs to you. Export, share, and maintain complete control with enterprise-grade security.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="px-8 py-3 bg-white text-therapy-600 hover:bg-gray-100"
                  onClick={() => navigate('/auth')}
                >
                  Start Data Export
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="px-8 py-3 border-white text-white hover:bg-white/10"
                  onClick={() => navigate('/contact')}
                >
                  <FileText className="mr-2 h-5 w-5" />
                  Enterprise Solutions
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </SafeComponentWrapper>
  );
};

export default DataExport;