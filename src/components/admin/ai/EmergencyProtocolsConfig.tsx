import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Shield, Phone, Mail, MessageSquare, Clock, Brain, Zap } from 'lucide-react';

interface EmergencyProtocol {
  id: string;
  name: string;
  triggerConditions: string[];
  aiModelEscalation: string;
  voiceSettings: {
    voiceId: string;
    tone: string;
    pace: string;
  };
  avatarBehavior: string;
  responseTime: number;
  contactMethods: string[];
  isActive: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

const EmergencyProtocolsConfig = () => {
  const [protocols, setProtocols] = useState<EmergencyProtocol[]>([
    {
      id: '1',
      name: 'Suicide Risk Detection',
      triggerConditions: ['self-harm keywords', 'suicide ideation', 'hopelessness indicators'],
      aiModelEscalation: 'claude-opus-4-20250514',
      voiceSettings: {
        voiceId: 'EXAVITQu4vr4xnSDxMaL', // Sarah - calm female voice
        tone: 'calm and compassionate',
        pace: 'slow and measured'
      },
      avatarBehavior: 'concerned but composed',
      responseTime: 5,
      contactMethods: ['emergency hotline', 'crisis counselor', 'emergency contact'],
      isActive: true,
      severity: 'critical'
    },
    {
      id: '2',
      name: 'Severe Anxiety Attack',
      triggerConditions: ['panic attack symptoms', 'severe anxiety markers', 'breathing difficulties'],
      aiModelEscalation: 'claude-sonnet-4-20250514',
      voiceSettings: {
        voiceId: 'TX3LPaxmHKxFdv7VOQHJ', // Liam - calm male voice
        tone: 'soothing and grounding',
        pace: 'steady and rhythmic'
      },
      avatarBehavior: 'calming presence',
      responseTime: 10,
      contactMethods: ['breathing exercises', 'therapist notification', 'family contact'],
      isActive: true,
      severity: 'high'
    },
    {
      id: '3',
      name: 'Substance Abuse Relapse',
      triggerConditions: ['substance use admission', 'relapse indicators', 'addiction triggers'],
      aiModelEscalation: 'claude-opus-4-20250514',
      voiceSettings: {
        voiceId: 'XB0fDUnXU5powFXDhCwa', // Charlotte - compassionate voice
        tone: 'non-judgmental and supportive',
        pace: 'gentle and patient'
      },
      avatarBehavior: 'understanding and supportive',
      responseTime: 15,
      contactMethods: ['addiction counselor', 'sponsor contact', 'support group'],
      isActive: true,
      severity: 'high'
    },
    {
      id: '4',
      name: 'Domestic Violence Disclosure',
      triggerConditions: ['abuse indicators', 'safety concerns', 'domestic violence keywords'],
      aiModelEscalation: 'claude-opus-4-20250514',
      voiceSettings: {
        voiceId: 'EXAVITQu4vr4xnSDxMaL', // Sarah - trustworthy voice
        tone: 'confidential and supportive',
        pace: 'careful and reassuring'
      },
      avatarBehavior: 'trustworthy and protective',
      responseTime: 8,
      contactMethods: ['domestic violence hotline', 'safety planning', 'legal resources'],
      isActive: true,
      severity: 'critical'
    }
  ]);

  const [generalSettings, setGeneralSettings] = useState({
    autoEscalation: true,
    culturalConsiderations: true,
    familyNotification: false,
    emergencyRecording: true,
    followUpScheduling: true,
    professionalHandoff: true,
    realTimeMonitoring: true,
    multiLanguageSupport: true
  });

  const [escalationRules, setEscalationRules] = useState({
    immediateResponse: 5, // seconds
    professionalContact: 60, // seconds
    emergencyServices: 300, // seconds for critical cases
    familyNotification: 900 // seconds
  });

  const crisisHotlines = [
    { name: 'National Suicide Prevention Lifeline', number: '988', region: 'US' },
    { name: 'Crisis Text Line', number: 'Text HOME to 741741', region: 'US' },
    { name: 'SAMHSA National Helpline', number: '1-800-662-4357', region: 'US' },
    { name: 'National Domestic Violence Hotline', number: '1-800-799-7233', region: 'US' }
  ];

  const availableModels = [
    { name: 'claude-opus-4-20250514', capability: 'Highest', responseTime: '2.5s' },
    { name: 'claude-sonnet-4-20250514', capability: 'High', responseTime: '1.2s' },
    { name: 'gpt-4.1-2025-04-14', capability: 'Medium', responseTime: '1.8s' }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-900/20 border-red-700 text-red-200';
      case 'high': return 'bg-orange-900/20 border-orange-700 text-orange-200';
      case 'medium': return 'bg-yellow-900/20 border-yellow-700 text-yellow-200';
      case 'low': return 'bg-green-900/20 border-green-700 text-green-200';
      default: return 'bg-gray-900/20 border-gray-700 text-gray-200';
    }
  };

  const toggleProtocolStatus = (protocolId: string) => {
    setProtocols(prev => prev.map(protocol => 
      protocol.id === protocolId ? { ...protocol, isActive: !protocol.isActive } : protocol
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Emergency & Crisis Protocols</h2>
          <p className="text-gray-400">Configure crisis detection and emergency response systems</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-900/20">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Test Emergency System
          </Button>
          <Button className="bg-red-600 hover:bg-red-700">
            <Shield className="h-4 w-4 mr-2" />
            Save Protocol Settings
          </Button>
        </div>
      </div>

      {/* Global Emergency Settings */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Global Emergency Response Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(generalSettings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <label className="text-white text-sm font-medium">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </label>
                <Switch 
                  checked={value}
                  onCheckedChange={(checked) => 
                    setGeneralSettings(prev => ({ ...prev, [key]: checked }))
                  }
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Protocols */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {protocols.map((protocol) => (
          <Card key={protocol.id} className={`border ${getSeverityColor(protocol.severity)}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-white flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  {protocol.name}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge className={`${getSeverityColor(protocol.severity)} border-0`}>
                    {protocol.severity.toUpperCase()}
                  </Badge>
                  <Switch 
                    checked={protocol.isActive}
                    onCheckedChange={() => toggleProtocolStatus(protocol.id)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Trigger Conditions */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Trigger Conditions</label>
                <div className="flex flex-wrap gap-1">
                  {protocol.triggerConditions.map(condition => (
                    <Badge key={condition} variant="outline" className="text-xs">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* AI Model Escalation */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block flex items-center">
                    <Brain className="h-4 w-4 mr-1" />
                    AI Model
                  </label>
                  <Select value={protocol.aiModelEscalation}>
                    <SelectTrigger className="bg-gray-600 border-gray-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableModels.map(model => (
                        <SelectItem key={model.name} value={model.name}>
                          {model.name.split('-')[1]} ({model.capability})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Response Time
                  </label>
                  <div className="flex items-center p-2 bg-gray-600 rounded border border-gray-500">
                    <span className="text-white font-medium">{protocol.responseTime}s</span>
                  </div>
                </div>
              </div>

              {/* Voice & Avatar Settings */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Voice & Avatar Response</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-gray-600 rounded">
                    <span className="text-gray-400">Tone:</span>
                    <span className="text-white ml-1">{protocol.voiceSettings.tone}</span>
                  </div>
                  <div className="p-2 bg-gray-600 rounded">
                    <span className="text-gray-400">Avatar:</span>
                    <span className="text-white ml-1">{protocol.avatarBehavior}</span>
                  </div>
                </div>
              </div>

              {/* Contact Methods */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Emergency Contacts</label>
                <div className="flex flex-wrap gap-1">
                  {protocol.contactMethods.map(method => (
                    <Badge key={method} className="bg-red-100 text-red-800 text-xs">
                      {method}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Escalation Timeline */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Emergency Escalation Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(escalationRules).map(([key, seconds]) => (
              <div key={key} className="text-center p-4 bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-red-400">{seconds}s</div>
                <div className="text-sm text-gray-400">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Crisis Hotlines */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Phone className="h-5 w-5 mr-2" />
            Crisis Hotlines & Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {crisisHotlines.map((hotline, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div>
                  <p className="text-white font-medium">{hotline.name}</p>
                  <p className="text-sm text-gray-400">{hotline.region}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-mono">{hotline.number}</p>
                  <Badge variant="outline" className="text-xs">Available 24/7</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Emergency System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-900/20 border border-green-700 rounded-lg">
              <div className="text-2xl font-bold text-green-400">Online</div>
              <div className="text-sm text-green-200">Crisis Detection</div>
            </div>
            <div className="text-center p-4 bg-green-900/20 border border-green-700 rounded-lg">
              <div className="text-2xl font-bold text-green-400">2.1s</div>
              <div className="text-sm text-green-200">Avg Response Time</div>
            </div>
            <div className="text-center p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">47</div>
              <div className="text-sm text-blue-200">Interventions Today</div>
            </div>
            <div className="text-center p-4 bg-purple-900/20 border border-purple-700 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">100%</div>
              <div className="text-sm text-purple-200">Success Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyProtocolsConfig;