import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { quantumInspiredAIService } from '@/services/quantumInspiredAIService';
import { Atom, Brain, Zap, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const QuantumTherapy = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quantumMatches, setQuantumMatches] = useState([]);
  const [quantumInsights, setQuantumInsights] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      const insights = quantumInspiredAIService.getQuantumInsights();
      setQuantumInsights(insights);
    }
  }, [user]);

  const runQuantumAnalysis = async () => {
    if (!user) return;
    
    setIsAnalyzing(true);
    try {
      const preferences = {
        therapy_style: 0.8,
        communication_preference: 0.7,
        session_frequency: 0.6
      };
      
      const matches = await quantumInspiredAIService.optimizeTherapyMatching(user.id, preferences);
      setQuantumMatches(matches);
      
      toast({
        title: "Quantum Analysis Complete",
        description: `Found ${matches.length} quantum-optimized therapy matches`,
      });
    } catch (error) {
      toast({
        title: "Analysis Error",
        description: "Failed to run quantum therapy analysis",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-quantum-50 to-therapy-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-quantum-600 mx-auto mb-4"></div>
          <p className="text-quantum-600 font-medium">Loading Quantum Therapy...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-quantum-50 to-therapy-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-quantum-900 mb-2">Quantum-Enhanced Therapy</h1>
          <p className="text-quantum-600 text-lg">AI-powered superposition therapy matching and optimization</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quantum Insights */}
          <Card className="border-quantum-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-quantum-700">
                <Atom className="h-5 w-5" />
                Quantum State
              </CardTitle>
            </CardHeader>
            <CardContent>
              {quantumInsights ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-quantum-600">Active Quantum States</p>
                    <p className="text-2xl font-bold text-quantum-900">{quantumInsights.totalQuantumStates}</p>
                  </div>
                  <div>
                    <p className="text-sm text-quantum-600">Average Coherence</p>
                    <Progress value={quantumInsights.averageCoherence * 100} className="mt-1" />
                    <p className="text-xs text-quantum-500 mt-1">{(quantumInsights.averageCoherence * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-quantum-600">Entanglement Density</p>
                    <Badge variant="secondary">{quantumInsights.entanglementDensity.toFixed(2)}</Badge>
                  </div>
                </div>
              ) : (
                <p className="text-quantum-500">No quantum data available</p>
              )}
            </CardContent>
          </Card>

          {/* Quantum Analysis */}
          <Card className="border-quantum-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-quantum-700">
                <Brain className="h-5 w-5" />
                Therapy Optimization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={runQuantumAnalysis} 
                disabled={isAnalyzing}
                className="w-full mb-4"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Run Quantum Analysis
                  </>
                )}
              </Button>
              <p className="text-sm text-quantum-600">
                Quantum superposition matching uses entanglement algorithms to find optimal therapy configurations
              </p>
            </CardContent>
          </Card>

          {/* Results Preview */}
          <Card className="border-quantum-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-quantum-700">
                <TrendingUp className="h-5 w-5" />
                Match Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {quantumMatches.length > 0 ? (
                <div className="space-y-3">
                  {quantumMatches.slice(0, 3).map((match, index) => (
                    <div key={index} className="border border-quantum-200 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <Badge variant="outline">{match.therapistId}</Badge>
                        <span className="text-sm font-medium text-quantum-700">
                          {(match.quantumScore * 100).toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={match.quantumScore * 100} className="mb-2" />
                      <div className="text-xs text-quantum-500">
                        Entanglement: {match.entanglementFactors.join(', ') || 'None'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-quantum-500">Run analysis to see quantum matches</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuantumTherapy;