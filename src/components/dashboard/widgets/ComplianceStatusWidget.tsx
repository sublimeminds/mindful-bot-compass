import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const ComplianceStatusWidget = () => {
  // Mock data - in real app, fetch from API
  const complianceStatus = {
    consentGiven: true,
    riskAssessmentComplete: false,
    lastUpdated: '2024-01-15',
    complianceScore: 75
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border border-therapy-100 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-therapy-700 flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Safety & Compliance
          </div>
          <Badge 
            variant={complianceStatus.complianceScore >= 80 ? "default" : "secondary"}
            className="text-xs"
          >
            {complianceStatus.complianceScore}%
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center">
                {complianceStatus.consentGiven ? (
                  <CheckCircle className="h-3 w-3 text-green-600 mr-1" />
                ) : (
                  <AlertCircle className="h-3 w-3 text-orange-500 mr-1" />
                )}
                Digital Consent
              </span>
              <span className={complianceStatus.consentGiven ? "text-green-600" : "text-orange-500"}>
                {complianceStatus.consentGiven ? "Complete" : "Pending"}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center">
                {complianceStatus.riskAssessmentComplete ? (
                  <CheckCircle className="h-3 w-3 text-green-600 mr-1" />
                ) : (
                  <AlertCircle className="h-3 w-3 text-orange-500 mr-1" />
                )}
                Risk Assessment
              </span>
              <span className={complianceStatus.riskAssessmentComplete ? "text-green-600" : "text-orange-500"}>
                {complianceStatus.riskAssessmentComplete ? "Complete" : "Needed"}
              </span>
            </div>
          </div>

          {!complianceStatus.riskAssessmentComplete && (
            <div className="bg-orange-50 border border-orange-200 rounded-md p-2">
              <div className="text-xs text-orange-700">
                Complete your risk assessment to improve your safety profile.
              </div>
            </div>
          )}

          <Link 
            to="/compliance"
            className="block w-full mt-3"
          >
            <div className="text-xs text-therapy-600 hover:text-therapy-700 transition-colors text-center py-1 border border-therapy-200 rounded-md hover:border-therapy-300">
              <FileText className="h-3 w-3 inline mr-1" />
              Manage Compliance
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplianceStatusWidget;