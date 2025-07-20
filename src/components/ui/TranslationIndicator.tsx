import React from 'react';
import { Languages, Zap, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TranslationResponse } from '@/services/europeanTranslationService';

interface TranslationIndicatorProps {
  response: TranslationResponse | null;
  isTranslating: boolean;
  className?: string;
}

export function TranslationIndicator({
  response,
  isTranslating,
  className = ""
}: TranslationIndicatorProps) {
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
        return <Languages className="h-3 w-3" />;
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
            <p>Translation in progress</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (!response) return null;

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
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-1 text-sm">
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
            {response.culturalAdaptations && Object.keys(response.culturalAdaptations).length > 0 && (
              <div className="pt-1 border-t">
                <span className="text-xs text-muted-foreground">
                  Culturally adapted
                </span>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface TranslationStatusProps {
  isTranslating: boolean;
  error: string | null;
  sessionActive?: boolean;
  className?: string;
}

export function TranslationStatus({
  isTranslating,
  error,
  sessionActive = false,
  className = ""
}: TranslationStatusProps) {
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
      <Badge variant="secondary" className={`bg-green-500/20 text-green-700 border-green-200 ${className}`}>
        <Languages className="h-3 w-3 mr-1" />
        Real-time Active
      </Badge>
    );
  }

  return null;
}