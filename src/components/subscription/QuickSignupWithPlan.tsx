
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, CreditCard, Lock, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface QuickSignupWithPlanProps {
  planName: string;
  planPrice: number;
  onSignupSuccess: () => void;
}

const QuickSignupWithPlan = ({ planName, planPrice, onSignupSuccess }: QuickSignupWithPlanProps) => {
  const { register } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await register(email, password);
      toast({
        title: t("signupSuccessTitle"),
        description: t("signupSuccessDescription"),
      });
      onSignupSuccess();
    } catch (error: any) {
      toast({
        title: t("signupErrorTitle"),
        description: error.message || t("genericErrorMessage"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="flex flex-col items-center space-y-2">
        <Sparkles className="h-8 w-8 text-blue-500" />
        <CardTitle className="text-2xl font-bold">
          {t("quickSignupTitle")}
        </CardTitle>
        <p className="text-muted-foreground">
          {t("quickSignupSubtitle", { planName, planPrice })}
        </p>
        <Badge className="bg-green-100 text-green-800">
          {planName} - ${planPrice}/month
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("emailLabel")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("passwordLabel")}</Label>
            <Input
              id="password"
              type="password"
              placeholder={t("passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t("signingUp") : t("signupButton")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default QuickSignupWithPlan;
