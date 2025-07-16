import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Mail, Phone, MapPin, Calendar } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground text-lg">
            Your privacy is our priority. Learn how we protect and handle your data.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* DPO Contact Card */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Data Protection Officer Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>dpo@therapysync.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>Data Protection Office, TherapySync Inc.</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Response within 72 hours</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle>1. Overview</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                TherapySync ("we," "our," or "us") is committed to protecting your privacy and ensuring GDPR compliance. 
                This Privacy Policy explains how we collect, use, process, and protect your personal information when you 
                use our mental health therapy platform.
              </p>
              <p>
                We process your data under the legal basis of <strong>explicit consent</strong> for therapy services and 
                <strong>legitimate interest</strong> for platform functionality, always in compliance with GDPR Articles 6 and 9.
              </p>
            </CardContent>
          </Card>

          {/* Data We Collect */}
          <Card>
            <CardHeader>
              <CardTitle>2. Data We Collect</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <h4>Personal Information:</h4>
              <ul>
                <li>Account details (name, email, phone number)</li>
                <li>Demographic information (age, location, cultural background)</li>
                <li>Billing and payment information</li>
              </ul>
              
              <h4>Special Category Data (Article 9 GDPR):</h4>
              <ul>
                <li>Mental health information and therapy session data</li>
                <li>Medical history and clinical assessments</li>
                <li>Mood tracking and wellness data</li>
              </ul>
              
              <h4>Technical Data:</h4>
              <ul>
                <li>Device information and IP addresses</li>
                <li>Usage analytics and session recordings</li>
                <li>Security logs and audit trails</li>
              </ul>
            </CardContent>
          </Card>

          {/* Legal Basis */}
          <Card>
            <CardHeader>
              <CardTitle>3. Legal Basis for Processing</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h4 className="text-blue-800 mb-2">Explicit Consent (GDPR Art. 9)</h4>
                <p className="text-blue-700">
                  For processing special category health data, we obtain your explicit consent before any therapy services begin.
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <h4 className="text-green-800 mb-2">Contractual Necessity (GDPR Art. 6.1b)</h4>
                <p className="text-green-700">
                  For providing our therapy platform services and fulfilling our contractual obligations.
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="text-purple-800 mb-2">Legitimate Interest (GDPR Art. 6.1f)</h4>
                <p className="text-purple-700">
                  For platform improvement, security, and fraud prevention, balanced against your privacy rights.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle>4. Your GDPR Rights</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">🔍 Right to Access</h4>
                  <p className="text-sm">Request copies of your personal data</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">✏️ Right to Rectification</h4>
                  <p className="text-sm">Correct inaccurate personal data</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">🗑️ Right to Erasure</h4>
                  <p className="text-sm">Request deletion of your data</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">⏸️ Right to Restrict</h4>
                  <p className="text-sm">Limit how we use your data</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">📦 Data Portability</h4>
                  <p className="text-sm">Receive your data in machine-readable format</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">🚫 Right to Object</h4>
                  <p className="text-sm">Object to certain processing activities</p>
                </div>
              </div>
              <p className="mt-4">
                <strong>To exercise these rights, contact our DPO at dpo@therapysync.com</strong>
              </p>
            </CardContent>
          </Card>

          {/* Data Protection Measures */}
          <Card>
            <CardHeader>
              <CardTitle>5. Data Protection & Security</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <ul>
                <li><strong>Encryption:</strong> End-to-end encryption for all therapy communications</li>
                <li><strong>Access Controls:</strong> Role-based access with multi-factor authentication</li>
                <li><strong>Audit Trails:</strong> Comprehensive logging of all data access and modifications</li>
                <li><strong>Data Minimization:</strong> We only collect data necessary for service provision</li>
                <li><strong>Retention Limits:</strong> Automatic deletion of data after specified retention periods</li>
                <li><strong>Regular Audits:</strong> Quarterly security assessments and penetration testing</li>
              </ul>
            </CardContent>
          </Card>

          {/* International Transfers */}
          <Card>
            <CardHeader>
              <CardTitle>6. International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                When data is transferred outside the EU/EEA, we ensure adequate protection through:
              </p>
              <ul>
                <li>European Commission adequacy decisions</li>
                <li>Standard Contractual Clauses (SCCs)</li>
                <li>Binding Corporate Rules where applicable</li>
              </ul>
              <p>
                All third-party processors are contractually bound to GDPR compliance standards.
              </p>
            </CardContent>
          </Card>

          {/* Complaints */}
          <Card>
            <CardHeader>
              <CardTitle>7. Filing Complaints</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                You have the right to lodge a complaint with your local supervisory authority if you believe 
                we have not handled your data in accordance with GDPR.
              </p>
              <div className="bg-amber-50 p-4 rounded-lg mt-4">
                <h4 className="text-amber-800 mb-2">Contact Your Local Authority:</h4>
                <ul className="text-amber-700 text-sm">
                  <li>🇩🇪 Germany: Federal Commissioner for Data Protection</li>
                  <li>🇫🇷 France: CNIL (Commission Nationale de l'Informatique et des Libertés)</li>
                  <li>🇮🇹 Italy: Garante per la Protezione dei Dati Personali</li>
                  <li>🇪🇸 Spain: AEPD (Agencia Española de Protección de Datos)</li>
                </ul>
                <p className="text-amber-700 text-sm mt-2">
                  Find your local authority at: <strong>edpb.europa.eu</strong>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>8. Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Data Protection Officer</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    For all privacy-related inquiries and rights requests
                  </p>
                  <Button variant="outline" className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    dpo@therapysync.com
                  </Button>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">General Inquiries</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    For other questions about our privacy practices
                  </p>
                  <Button variant="outline" className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    privacy@therapysync.com
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;