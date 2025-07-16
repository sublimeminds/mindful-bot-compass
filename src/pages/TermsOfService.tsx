import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Mail, AlertTriangle, Scale } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <FileText className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-foreground mb-2">Terms of Service</h1>
          <p className="text-muted-foreground text-lg">
            Please read these terms carefully before using our platform.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: {new Date().toLocaleDateString()} | Effective: Immediately
          </p>
        </div>

        {/* Important Notice */}
        <Card className="mb-8 border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="h-5 w-5" />
              Important Medical Disclaimer
            </CardTitle>
          </CardHeader>
          <CardContent className="text-amber-700">
            <p>
              TherapySync is a digital therapy platform providing AI-powered mental health support. 
              Our services are not a substitute for professional medical advice, diagnosis, or treatment. 
              In case of emergency, please contact emergency services immediately.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {/* Acceptance */}
          <Card>
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                By accessing or using TherapySync ("Platform," "Service," "we," "us," or "our"), 
                you ("User," "you," or "your") agree to be bound by these Terms of Service ("Terms"). 
                If you do not agree with these terms, you may not use our services.
              </p>
              <p>
                These Terms constitute a legally binding agreement between you and TherapySync Inc., 
                in compliance with EU consumer protection laws and GDPR requirements.
              </p>
            </CardContent>
          </Card>

          {/* Service Description */}
          <Card>
            <CardHeader>
              <CardTitle>2. Service Description</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <h4>Our Platform Provides:</h4>
              <ul>
                <li>AI-powered therapeutic conversations and support</li>
                <li>Mental health assessments and progress tracking</li>
                <li>Personalized therapy recommendations</li>
                <li>Crisis intervention and emergency resources</li>
                <li>Community support features</li>
              </ul>
              
              <div className="bg-red-50 p-4 rounded-lg mt-4">
                <h4 className="text-red-800 mb-2">⚠️ Important Limitations:</h4>
                <ul className="text-red-700 text-sm">
                  <li>This is not a substitute for professional medical care</li>
                  <li>AI therapists are not licensed mental health professionals</li>
                  <li>Emergency situations require immediate professional help</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* User Responsibilities */}
          <Card>
            <CardHeader>
              <CardTitle>3. User Responsibilities & Conduct</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <h4>You agree to:</h4>
              <ul>
                <li>Provide accurate and complete information</li>
                <li>Maintain the confidentiality of your account credentials</li>
                <li>Use the platform only for its intended therapeutic purposes</li>
                <li>Respect other users' privacy and dignity</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
              
              <h4>Prohibited Activities:</h4>
              <ul>
                <li>Sharing personal information of other users</li>
                <li>Attempting to circumvent security measures</li>
                <li>Using the platform for commercial purposes without permission</li>
                <li>Impersonating others or providing false information</li>
                <li>Engaging in harassment, discrimination, or harmful behavior</li>
              </ul>
            </CardContent>
          </Card>

          {/* Privacy & Data Protection */}
          <Card>
            <CardHeader>
              <CardTitle>4. Privacy & Data Protection (GDPR Compliance)</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h4 className="text-blue-800 mb-2">🛡️ Your Privacy Rights</h4>
                <p className="text-blue-700 text-sm">
                  Under GDPR, you have comprehensive rights over your personal data. 
                  See our Privacy Policy for detailed information.
                </p>
              </div>
              
              <h4>Data Processing:</h4>
              <ul>
                <li>We process your data based on explicit consent and contractual necessity</li>
                <li>Special category health data requires your explicit consent</li>
                <li>You can withdraw consent at any time</li>
                <li>Data retention periods are clearly defined and legally compliant</li>
              </ul>
              
              <p>
                <strong>Data Protection Officer:</strong> dpo@therapysync.com
              </p>
            </CardContent>
          </Card>

          {/* Subscription & Billing */}
          <Card>
            <CardHeader>
              <CardTitle>5. Subscription & Billing (EU Consumer Rights)</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <h4 className="text-green-800 mb-2">🇪🇺 EU Consumer Protection</h4>
                <p className="text-green-700 text-sm">
                  EU consumers have a 14-day cooling-off period for digital services, 
                  except when services have been fully performed with your explicit consent.
                </p>
              </div>
              
              <h4>Billing Terms:</h4>
              <ul>
                <li>Subscriptions are billed in advance on a recurring basis</li>
                <li>Prices include applicable VAT for EU customers</li>
                <li>Payment processing is PCI DSS compliant</li>
                <li>Refunds are processed according to EU consumer rights</li>
              </ul>
              
              <h4>Cancellation Rights:</h4>
              <ul>
                <li>Cancel your subscription at any time</li>
                <li>Access continues until the end of your billing period</li>
                <li>No cancellation fees or penalties</li>
              </ul>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card>
            <CardHeader>
              <CardTitle>6. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <h4>Platform Content:</h4>
              <p>
                All content, features, and functionality of the TherapySync platform, 
                including but not limited to text, graphics, logos, software, and AI models, 
                are owned by TherapySync Inc. and are protected by copyright, trademark, 
                and other intellectual property laws.
              </p>
              
              <h4>User Content:</h4>
              <p>
                You retain ownership of any content you provide to the platform. 
                By using our services, you grant us a limited license to use your content 
                solely for providing our therapeutic services to you.
              </p>
            </CardContent>
          </Card>

          {/* Liability & Disclaimers */}
          <Card>
            <CardHeader>
              <CardTitle>7. Liability & Disclaimers</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <div className="bg-red-50 p-4 rounded-lg mb-4">
                <h4 className="text-red-800 mb-2">⚠️ Medical Emergency Disclaimer</h4>
                <p className="text-red-700 text-sm">
                  Our platform is not designed for emergency situations. 
                  If you are experiencing a mental health emergency, contact emergency services immediately.
                </p>
              </div>
              
              <h4>Service Limitations:</h4>
              <ul>
                <li>We provide the platform "as is" without warranties</li>
                <li>We cannot guarantee specific therapeutic outcomes</li>
                <li>Technical issues may occasionally affect service availability</li>
                <li>AI responses are based on algorithms and may not always be appropriate</li>
              </ul>
              
              <h4>EU Consumer Rights:</h4>
              <p>
                Nothing in these terms limits your statutory rights as an EU consumer, 
                including rights under applicable consumer protection legislation.
              </p>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card>
            <CardHeader>
              <CardTitle>8. Termination</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <h4>Account Termination:</h4>
              <ul>
                <li>You may terminate your account at any time</li>
                <li>We may suspend or terminate accounts for terms violations</li>
                <li>Upon termination, you retain rights to your personal data under GDPR</li>
                <li>Data deletion follows our retention policy and legal requirements</li>
              </ul>
              
              <h4>Data After Termination:</h4>
              <p>
                Following account termination, we will delete or anonymize your personal data 
                according to our retention policy, except where we have a legal obligation to retain it.
              </p>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card>
            <CardHeader>
              <CardTitle>9. Governing Law & Dispute Resolution</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <div className="bg-purple-50 p-4 rounded-lg mb-4">
                <h4 className="text-purple-800 mb-2">🏛️ EU Jurisdiction</h4>
                <p className="text-purple-700 text-sm">
                  For EU consumers, disputes are governed by the laws of your country of residence, 
                  and you may bring legal proceedings in your local courts.
                </p>
              </div>
              
              <h4>Dispute Resolution:</h4>
              <ul>
                <li>We encourage resolving disputes through direct communication</li>
                <li>EU consumers can access the EU Online Dispute Resolution platform</li>
                <li>Mediation services are available before litigation</li>
              </ul>
              
              <p>
                <strong>EU ODR Platform:</strong> ec.europa.eu/consumers/odr
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                10. Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Legal & Compliance</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    For terms-related questions and legal matters
                  </p>
                  <Button variant="outline" className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    legal@therapysync.com
                  </Button>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Customer Support</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    For account and service-related inquiries
                  </p>
                  <Button variant="outline" className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    support@therapysync.com
                  </Button>
                </div>
              </div>
              
              <div className="mt-6 text-center text-sm text-muted-foreground">
                <p>
                  TherapySync Inc. • Registered in Delaware, USA • EU Representative: Available upon request
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;