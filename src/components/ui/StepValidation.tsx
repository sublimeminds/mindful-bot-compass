import React from 'react';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ValidationField {
  name: string;
  label: string;
  isValid: boolean;
  isRequired: boolean;
}

interface StepValidationProps {
  fields: ValidationField[];
  className?: string;
}

export const StepValidation: React.FC<StepValidationProps> = ({ fields, className = '' }) => {
  const { t } = useTranslation();
  
  const requiredFields = fields.filter(f => f.isRequired);
  const optionalFields = fields.filter(f => !f.isRequired);
  
  const completedRequired = requiredFields.filter(f => f.isValid).length;
  const totalRequired = requiredFields.length;
  const canContinue = completedRequired === totalRequired;

  if (fields.length === 0) return null;

  return (
    <div className={`bg-background border rounded-lg p-4 space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">{t('onboarding.progress.fieldCompletion')}</h4>
        <div className="text-xs text-muted-foreground">
          {completedRequired}/{totalRequired} {t('onboarding.progress.requiredFieldsCompleted')}
        </div>
      </div>
      
      {/* Required Fields */}
      {requiredFields.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">
            {t('onboarding.progress.requiredFields')}
          </div>
          {requiredFields.map((field) => (
            <div key={field.name} className="flex items-center space-x-2 text-sm">
              {field.isValid ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <Circle className="h-4 w-4 text-gray-400" />
              )}
              <span className={field.isValid ? 'text-green-700' : 'text-muted-foreground'}>
                {field.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Optional Fields */}
      {optionalFields.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">
            {t('onboarding.progress.optionalFields')}
          </div>
          {optionalFields.map((field) => (
            <div key={field.name} className="flex items-center space-x-2 text-sm">
              {field.isValid ? (
                <CheckCircle className="h-4 w-4 text-blue-500" />
              ) : (
                <Circle className="h-4 w-4 text-gray-400" />
              )}
              <span className={field.isValid ? 'text-blue-700' : 'text-muted-foreground'}>
                {field.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Continue Hint */}
      {!canContinue && (
        <div className="flex items-center space-x-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
          <AlertCircle className="h-3 w-3" />
          <span>{t('onboarding.progress.nextStepHint')}</span>
        </div>
      )}
    </div>
  );
};