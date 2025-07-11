import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Globe, 
  Lock, 
  FileText,
  Users,
  Database,
  Eye,
  CheckCircle,
  Building,
  Award,
  Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CompliancePage = () => {
  const navigate = useNavigate();

  const complianceStandards = [
    {
      id: 'hipaa',
      icon: Shield,
      title: 'HIPAA Compliance',
      description: 'Health Insurance Portability and Accountability Act',
      details: [
        'End-to-end encryption for all patient data',
        'Secure data transmission and storage protocols',
        'Comprehensive audit logging and monitoring',
        'Regular risk assessments and security updates',
        'Staff training on privacy and security practices'
      ]
    },
    {
      id: 'gdpr',
      icon: Globe,
      title: 'GDPR Compliance',
      description: 'General Data Protection Regulation',
      details: [
        'User consent management and tracking',
        'Right to data portability and erasure',
        'Data minimization and purpose limitation',
        'Regular data protection impact assessments',
        'Appointed Data Protection Officer (DPO)'
      ]
    },
    {
      id: 'soc2',
      icon: Lock,
      title: 'SOC 2 Type II',
      description: 'Service Organization Control 2',
      details: [
        'Annual third-party security audits',
        'Continuous monitoring of security controls',
        'Incident response and management procedures',
        'Vendor risk management program',
        'Business continuity and disaster recovery plans'
      ]
    },
    {
      id: 'ccpa',
      icon: FileText,
      title: 'CCPA Compliance',
      description: 'California Consumer Privacy Act',
      details: [
        'Transparent data collection practices',
        'Consumer rights to know, delete, and opt-out',
        'Non-discrimination for privacy rights exercise',
        'Secure methods for identity verification',
        'Annual privacy policy updates and disclosures'
      ]
    },
    {
      id: 'iso27001',
      icon: Award,
      title: 'ISO 27001',
      description: 'Information Security Management System',
      details: [
        'Comprehensive information security framework',
        'Risk-based approach to security management',
        'Continuous improvement of security processes',
        'Regular internal and external audits',
        'Employee security awareness training'
      ]
    },
    {
      id: 'ferpa',
      icon: Users,
      title: 'FERPA Compliance',
      description: 'Family Educational Rights and Privacy Act',
      details: [
        'Protection of student educational records',
        'Parental consent for data sharing',
        'Student rights upon reaching 18 years',
        'Secure handling of academic and counseling records',
        'Annual notification of privacy rights'
      ]
    }
  ];

  const securityFeatures = [
    {
      icon: Database,
      title: 'Data Encryption',
      description: 'All data encrypted at rest and in transit using AES-256 encryption'
    },
    {
      icon: Eye,
      title: 'Access Controls',
      description: 'Multi-factor authentication and role-based access controls'
    },
    {
      icon: Shield,
      title: 'Network Security',
      description: 'Advanced firewall protection and intrusion detection systems'
    },
    {
      icon: FileText,
      title: 'Audit Logging',
      description: 'Comprehensive logging of all system activities and access attempts'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-therapy-50/20">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Shield className="h-12 w-12 text-therapy-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-therapy-600">
              Security & Compliance
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            TherapySync is committed to maintaining the highest standards of security and privacy. 
            We comply with all major healthcare and data protection regulations to ensure your information is safe.
          </p>
        </div>

        {/* Trust Banner */}
        <div className="bg-gradient-to-r from-therapy-500 to-calm-500 text-white rounded-2xl p-8 mb-16 text-center">
          <Heart className="h-16 w-16 mx-auto mb-4 opacity-90" />
          <h2 className="text-2xl font-bold mb-4">Your Trust is Our Priority</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Mental health data requires the highest level of protection. That's why we've implemented 
            enterprise-grade security measures and maintain compliance with the most stringent global standards.
          </p>
        </div>

        {/* Security Features Overview */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Security Infrastructure</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityFeatures.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow group">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Compliance Standards */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Compliance Standards</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {complianceStandards.map((standard) => (
              <Card key={standard.id} className="hover:shadow-xl transition-shadow group">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <standard.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{standard.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{standard.description}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Compliant
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold mb-3 text-therapy-700">How we ensure compliance:</h4>
                  <ul className="space-y-3">
                    {standard.details.map((detail, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm leading-relaxed">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Certifications & Audits */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-therapy-50 to-calm-50 border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <Building className="h-16 w-16 text-therapy-600 mx-auto mb-6" />
              <h3 className="text-3xl font-bold mb-6">Independent Audits & Certifications</h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
                Our compliance standards are verified through regular independent audits by certified third-party organizations. 
                We undergo continuous monitoring and annual assessments to maintain our certifications.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                <Badge variant="outline" className="px-6 py-3 text-sm font-medium border-therapy-200 hover:bg-therapy-50">
                  Annual SOC 2 Audits
                </Badge>
                <Badge variant="outline" className="px-6 py-3 text-sm font-medium border-therapy-200 hover:bg-therapy-50">
                  ISO 27001 Certified
                </Badge>
                <Badge variant="outline" className="px-6 py-3 text-sm font-medium border-therapy-200 hover:bg-therapy-50">
                  HIPAA Validated
                </Badge>
                <Badge variant="outline" className="px-6 py-3 text-sm font-medium border-therapy-200 hover:bg-therapy-50">
                  Penetration Testing
                </Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact & Privacy Dashboard */}
        <section>
          <Card className="bg-gradient-to-r from-therapy-500 to-calm-500 text-white border-0">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Questions About Our Security?</h3>
              <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                Our compliance team is ready to assist with documentation, security questions, or audit support.
                For personal privacy controls, visit your privacy dashboard.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="outline" 
                  className="bg-white text-therapy-600 border-white hover:bg-therapy-50"
                  onClick={() => navigate('/privacy')}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Privacy Dashboard
                </Button>
                <Button 
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-therapy-600"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Download Compliance Report
                </Button>
              </div>
              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-sm opacity-75">
                  Compliance Team: <span className="font-medium">compliance@therapysync.ai</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default CompliancePage;