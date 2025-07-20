
import React from 'react';
import { Languages, Zap, Clock, CheckCircle, AlertCircle, Globe, Mic, Volume2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { GlobalTranslationResponse } from '@/services/globalTranslationService';

interface GlobalTranslationIndicatorProps {
  response: GlobalTranslationResponse | null;
  isTranslating: boolean;
  className?: string;
  showDetails?: boolean;
  showVoiceStatus?: boolean;
}

export function GlobalTranslationIndicator({
  response,
  isTranslating,
  className = "",
  showDetails = false,
  showVoiceStatus = false
}: GlobalTranslationIndicatorProps) {
  if (!response && !isTranslating) return null;

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'claude':
        return <Zap className="h-3 w-3" />;
      case 'openai':
        return <Languages className="h-3 w-3" />;
      case 'cache':
        return <CheckCircle className="h-3 w-3" />;
      default:
        return <Globe className="h-3 w-3" />;
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'claude':
        return 'bg-orange-500/20 text-orange-700 border-orange-200';
      case 'openai':
        return 'bg-green-500/20 text-green-700 border-green-200';
      case 'cache':
        return 'bg-blue-500/20 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-500/20 text-gray-700 border-gray-200';
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 0.9) return 'text-green-600';
    if (score >= 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCulturalAccuracyColor = (score: number) => {
    if (score >= 0.95) return 'text-emerald-600';
    if (score >= 0.85) return 'text-blue-600';
    if (score >= 0.75) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isTranslating) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="secondary" className={`animate-pulse ${className}`}>
              <Clock className="h-3 w-3 mr-1" />
              Translating...
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Global translation in progress</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (!response) return null;

  if (!showDetails) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge 
              variant="outline" 
              className={`${getProviderColor(response.provider)} ${className}`}
            >
              {getProviderIcon(response.provider)}
              <span className="ml-1 capitalize">{response.provider}</span>
              {response.cached && (
                <CheckCircle className="h-3 w-3 ml-1 text-blue-600" />
              )}
              {response.voiceContent && showVoiceStatus && (
                <Volume2 className="h-3 w-3 ml-1 text-purple-600" />
              )}
            </Badge>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Provider:</span>
                <span className="capitalize font-medium">{response.provider}</span>
              </div>
              <div className="flex justify-between">
                <span>Quality:</span>
                <span className={`font-medium ${getQualityColor(response.qualityScore)}`}>
                  {(response.qualityScore * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Cultural Accuracy:</span>
                <span className={`font-medium ${getCulturalAccuracyColor(response.culturalAccuracyScore)}`}>
                  {(response.culturalAccuracyScore * 100).toFixed(0)}%
                </span>
              </div>
              {!response.cached && (
                <div className="flex justify-between">
                  <span>Response Time:</span>
                  <span className="font-medium">{response.responseTime}ms</span>
                </div>
              )}
              {response.cached && (
                <div className="flex items-center gap-1 text-blue-600">
                  <CheckCircle className="h-3 w-3" />
                  <span>From cache</span>
                </div>
              )}
              {response.voiceContent && (
                <div className="flex items-center gap-1 text-purple-600">
                  <Volume2 className="h-3 w-3" />
                  <span>Voice available</span>
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className={`space-y-3 p-4 border rounded-lg bg-muted/20 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={getProviderColor(response.provider)}>
            {getProviderIcon(response.provider)}
            <span className="ml-1 capitalize">{response.provider}</span>
          </Badge>
          
          <Badge variant="secondary">
            {response.sourceLanguage.toUpperCase()} → {response.targetLanguage.toUpperCase()}
          </Badge>
          
          {response.cached && (
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              Cached
            </Badge>
          )}
          
          {response.voiceContent && (
            <Badge variant="outline" className="text-purple-600 border-purple-200">
              <Volume2 className="h-3 w-3 mr-1" />
              Voice
            </Badge>
          )}
        </div>
        
        <div className="text-xs text-muted-foreground">
          {response.responseTime}ms
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Quality</span>
            <span className={`text-sm font-medium ${getQualityColor(response.qualityScore)}`}>
              {(response.qualityScore * 100).toFixed(0)}%
            </span>
          </div>
          <Progress value={response.qualityScore * 100} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Cultural Accuracy</span>
            <span className={`text-sm font-medium ${getCulturalAccuracyColor(response.culturalAccuracyScore)}`}>
              {(response.culturalAccuracyScore * 100).toFixed(0)}%
            </span>
          </div>
          <Progress value={response.culturalAccuracyScore * 100} className="h-2" />
        </div>
      </div>

      {response.culturalAdaptations && Object.keys(response.culturalAdaptations).length > 0 && (
        <div className="pt-2 border-t">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Cultural Adaptations</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {Object.keys(response.culturalAdaptations).map((adaptation) => (
              <Badge key={adaptation} variant="outline" className="text-xs">
                {adaptation.replace('_', ' ')}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {response.formalityLevel && (
        <div className="pt-2 border-t">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Formality Level:</span>
            <span className="text-sm font-medium capitalize">{response.formalityLevel}</span>
          </div>
        </div>
      )}

      {response.regionalVariations && Object.keys(response.regionalVariations).length > 0 && (
        <div className="pt-2 border-t">
          <div className="flex items-center gap-2 mb-2">
            <Languages className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Regional Variations Available</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {Object.keys(response.regionalVariations).map((region) => (
              <Badge key={region} variant="secondary" className="text-xs">
                {region}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface GlobalTranslationStatusProps {
  isTranslating: boolean;
  error: string | null;
  sessionActive?: boolean;
  voiceEnabled?: boolean;
  className?: string;
}

export function GlobalTranslationStatus({
  isTranslating,
  error,
  sessionActive = false,
  voiceEnabled = false,
  className = ""
}: GlobalTranslationStatusProps) {
  if (error) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="destructive" className={className}>
              <AlertCircle className="h-3 w-3 mr-1" />
              Translation Error
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">{error}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (sessionActive) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Badge variant="secondary" className="bg-green-500/20 text-green-700 border-green-200">
          <Languages className="h-3 w-3 mr-1" />
          Global Session Active
        </Badge>
        {voiceEnabled && (
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-700 border-purple-200">
            <Mic className="h-3 w-3 mr-1" />
            Voice Enabled
          </Badge>
        )}
      </div>
    );
  }

  return null;
}
