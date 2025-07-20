
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, Languages, CheckCircle, Clock, TrendingUp, Users, Zap, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GlobalLanguageSelector } from '@/components/ui/GlobalLanguageSelector';
import { GlobalTranslationIndicator } from '@/components/ui/GlobalTranslationIndicator';
import { useGlobalTranslation } from '@/hooks/useGlobalTranslation';
import { toast } from 'sonner';

const SuperAdminTranslations = () => {
  const [selectedSourceLang, setSelectedSourceLang] = useState('en');
  const [selectedTargetLang, setSelectedTargetLang] = useState('es');
  const [testText, setTestText] = useState('Welcome to our therapy platform. How are you feeling today?');
  
  const {
    translate,
    translateWithVoice,
    isTranslating,
    lastResponse,
    error,
    supportedLanguages,
    languagesByRegion
  } = useGlobalTranslation();

  const handleTestTranslation = async () => {
    try {
      const result = await translate(testText, selectedTargetLang, selectedSourceLang);
      toast.success(`Translation Successful - Translated to ${supportedLanguages[selectedTargetLang as keyof typeof supportedLanguages]?.name}`);
    } catch (error) {
      toast.error(`Translation Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleVoiceTranslation = async () => {
    try {
      const result = await translateWithVoice(testText, selectedTargetLang, selectedSourceLang);
      toast.success("Voice Translation Successful - Translation with voice synthesis completed");
    } catch (error) {
      toast.error(`Voice Translation Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Get statistics
  const totalLanguages = Object.keys(supportedLanguages).length;
  const totalRegions = Object.keys(languagesByRegion).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <Globe className="h-6 w-6 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">Global Translation Management</h1>
              <p className="text-slate-400">Manage multilingual content and AI-powered translations worldwide</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-slate-300 border-slate-600">
              {totalLanguages} Languages
            </Badge>
            <Badge variant="outline" className="text-slate-300 border-slate-600">
              {totalRegions} Regions
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-100">{totalLanguages}</p>
                <p className="text-sm text-slate-400">Supported Languages</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">247,891</p>
                <p className="text-sm text-slate-400">Total Translations</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-400">1,247</p>
                <p className="text-sm text-slate-400">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">97.8%</p>
                <p className="text-sm text-slate-400">Quality Score</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-slate-800/50 border-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">
              Overview
            </TabsTrigger>
            <TabsTrigger value="test" className="data-[state=active]:bg-slate-700">
              Test Translation
            </TabsTrigger>
            <TabsTrigger value="regions" className="data-[state=active]:bg-slate-700">
              Regional Coverage
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-700">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Translation Pipeline
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    AI-powered translation system with global cultural adaptation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Claude Sonnet (Primary)</span>
                      <span className="text-slate-300">78.3%</span>
                    </div>
                    <Progress value={78.3} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">OpenAI GPT-4 (Fallback)</span>
                      <span className="text-slate-300">19.2%</span>
                    </div>
                    <Progress value={19.2} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Cache Hits</span>
                      <span className="text-slate-300">2.5%</span>
                    </div>
                    <Progress value={2.5} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Cultural Adaptation
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Regional customization and therapeutic context awareness
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-400">120+</p>
                      <p className="text-xs text-slate-400">Cultural Contexts</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-400">94.7%</p>
                      <p className="text-xs text-slate-400">Cultural Accuracy</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-slate-300 border-slate-600">
                      Therapeutic Context
                    </Badge>
                    <Badge variant="outline" className="text-slate-300 border-slate-600">
                      Religious Sensitivity
                    </Badge>
                    <Badge variant="outline" className="text-slate-300 border-slate-600">
                      Family Structure
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="test" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-100 flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Translation Testing
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Test the global translation system with custom text
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Source Language</label>
                    <GlobalLanguageSelector
                      selectedLanguage={selectedSourceLang}
                      onLanguageChange={setSelectedSourceLang}
                      compact={true}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Target Language</label>
                    <GlobalLanguageSelector
                      selectedLanguage={selectedTargetLang}
                      onLanguageChange={setSelectedTargetLang}
                      compact={true}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Test Text</label>
                  <textarea
                    value={testText}
                    onChange={(e) => setTestText(e.target.value)}
                    className="w-full h-24 px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-100 placeholder-slate-400"
                    placeholder="Enter text to translate..."
                  />
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={handleTestTranslation}
                    disabled={isTranslating}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isTranslating ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Translating...
                      </>
                    ) : (
                      <>
                        <Languages className="h-4 w-4 mr-2" />
                        Test Translation
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={handleVoiceTranslation}
                    disabled={isTranslating}
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Test with Voice
                  </Button>
                </div>

                {lastResponse && (
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <h4 className="text-sm font-medium text-slate-300 mb-2">Translation Result:</h4>
                      <p className="text-slate-100">{lastResponse.translatedText}</p>
                    </div>
                    
                    <GlobalTranslationIndicator
                      response={lastResponse}
                      isTranslating={isTranslating}
                      showDetails={true}
                      showVoiceStatus={true}
                    />
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg">
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="regions" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(languagesByRegion).map(([region, languages]) => (
                <Card key={region} className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-slate-100 text-lg">{region}</CardTitle>
                    <CardDescription className="text-slate-400">
                      {languages.length} languages supported
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {languages.slice(0, 5).map((lang) => (
                        <div key={lang.code} className="flex justify-between items-center">
                          <span className="text-slate-300 text-sm">{lang.name}</span>
                          <Badge variant="outline" className="text-xs text-slate-400 border-slate-600">
                            {lang.code.toUpperCase()}
                          </Badge>
                        </div>
                      ))}
                      {languages.length > 5 && (
                        <p className="text-xs text-slate-400">
                          +{languages.length - 5} more languages
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-100">Translation Analytics</CardTitle>
                <CardDescription className="text-slate-400">
                  Performance metrics and usage statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">Advanced analytics dashboard will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SuperAdminTranslations;
