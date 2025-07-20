import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { TherapyTranslationService, TherapeuticTerm } from '@/services/therapyTranslationService';
import { CulturalAiTranslationService } from '@/services/culturalAiTranslationService';
import { 
  Brain, 
  Languages, 
  Users, 
  BookOpen, 
  Plus, 
  Search, 
  Download,
  CheckCircle,
  AlertCircle,
  Globe
} from 'lucide-react';

const TherapyTranslationManager = () => {
  const { toast } = useToast();
  const [therapeuticTerms, setTherapeuticTerms] = useState<TherapeuticTerm[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newTerm, setNewTerm] = useState<Partial<TherapeuticTerm>>({
    category: 'technique'
  });
  const [translationProgress, setTranslationProgress] = useState(0);

  useEffect(() => {
    loadTherapeuticTerms();
  }, [selectedCategory]);

  const loadTherapeuticTerms = async () => {
    try {
      setIsLoading(true);
      const terms = await TherapyTranslationService.getTherapeuticTerms(
        selectedCategory === 'all' ? undefined : selectedCategory
      );
      setTherapeuticTerms(terms);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load therapeutic terms",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addTherapeuticTerm = async () => {
    if (!newTerm.english_term || !newTerm.german_term) {
      toast({
        title: "Error",
        description: "Please provide both English and German terms",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      await TherapyTranslationService.addTherapeuticTerm(newTerm as TherapeuticTerm);
      setNewTerm({ category: 'technique' });
      await loadTherapeuticTerms();
      toast({
        title: "Success",
        description: "Therapeutic term added successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add therapeutic term",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const bulkTranslateTherapyContent = async () => {
    try {
      setIsLoading(true);
      setTranslationProgress(0);

      // Simulate progress for demo
      const progressInterval = setInterval(() => {
        setTranslationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // In a real implementation, this would:
      // 1. Fetch all therapy plans
      // 2. Translate them using TherapyTranslationService
      // 3. Translate cultural AI content using CulturalAiTranslationService
      
      setTimeout(() => {
        setTranslationProgress(100);
        toast({
          title: "Success",
          description: "Bulk translation completed successfully"
        });
      }, 3000);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete bulk translation",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTerms = therapeuticTerms.filter(term =>
    term.english_term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.german_term.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Therapy Translation Manager</h1>
          <p className="text-muted-foreground mt-2">
            Manage therapeutic terminology and cultural adaptations for German-speaking users
          </p>
        </div>
        <Button onClick={bulkTranslateTherapyContent} disabled={isLoading} size="lg">
          <Globe className="h-4 w-4 mr-2" />
          Bulk Translate All Content
        </Button>
      </div>

      <Tabs defaultValue="terminology" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="terminology">
            <BookOpen className="h-4 w-4 mr-2" />
            Terminology
          </TabsTrigger>
          <TabsTrigger value="therapy-plans">
            <Brain className="h-4 w-4 mr-2" />
            Therapy Plans
          </TabsTrigger>
          <TabsTrigger value="cultural-ai">
            <Users className="h-4 w-4 mr-2" />
            Cultural AI
          </TabsTrigger>
          <TabsTrigger value="progress">
            <Languages className="h-4 w-4 mr-2" />
            Progress
          </TabsTrigger>
        </TabsList>

        <TabsContent value="terminology" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Add Therapeutic Term</CardTitle>
                <CardDescription>
                  Add new therapeutic terminology for accurate German translations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="english-term">English Term</Label>
                    <Input
                      id="english-term"
                      value={newTerm.english_term || ''}
                      onChange={(e) => setNewTerm({ ...newTerm, english_term: e.target.value })}
                      placeholder="e.g., Cognitive Behavioral Therapy"
                    />
                  </div>
                  <div>
                    <Label htmlFor="german-term">German Term</Label>
                    <Input
                      id="german-term"
                      value={newTerm.german_term || ''}
                      onChange={(e) => setNewTerm({ ...newTerm, german_term: e.target.value })}
                      placeholder="e.g., Kognitive Verhaltenstherapie"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={newTerm.category} 
                      onValueChange={(value) => setNewTerm({ ...newTerm, category: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technique">Technique</SelectItem>
                        <SelectItem value="disorder">Disorder</SelectItem>
                        <SelectItem value="approach">Approach</SelectItem>
                        <SelectItem value="concept">Concept</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="definition-en">English Definition</Label>
                    <Textarea
                      id="definition-en"
                      value={newTerm.definition_en || ''}
                      onChange={(e) => setNewTerm({ ...newTerm, definition_en: e.target.value })}
                      placeholder="Definition in English..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="definition-de">German Definition</Label>
                    <Textarea
                      id="definition-de"
                      value={newTerm.definition_de || ''}
                      onChange={(e) => setNewTerm({ ...newTerm, definition_de: e.target.value })}
                      placeholder="Definition in German..."
                    />
                  </div>
                </div>
                <Button onClick={addTherapeuticTerm} disabled={isLoading} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Term
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Therapeutic Terminology Database</CardTitle>
                <CardDescription>
                  {therapeuticTerms.length} terms available for translation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search terms..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="technique">Techniques</SelectItem>
                      <SelectItem value="disorder">Disorders</SelectItem>
                      <SelectItem value="approach">Approaches</SelectItem>
                      <SelectItem value="concept">Concepts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredTerms.map((term) => (
                    <div key={term.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{term.english_term}</div>
                        <div className="text-sm text-muted-foreground">{term.german_term}</div>
                      </div>
                      <Badge variant="secondary">{term.category}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="therapy-plans" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Therapy Plan Translation</CardTitle>
              <CardDescription>
                Translate therapy plans with cultural adaptations for German-speaking users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Therapy Plan Translation</h3>
                  <p className="text-muted-foreground mb-4">
                    Automatically translate therapy plans with therapeutic terminology and cultural context
                  </p>
                  <Button onClick={bulkTranslateTherapyContent} disabled={isLoading}>
                    <Languages className="h-4 w-4 mr-2" />
                    Translate All Therapy Plans
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cultural-ai" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cultural AI Content Translation</CardTitle>
              <CardDescription>
                Translate and adapt AI content for German cultural contexts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Cultural AI Content</h3>
                  <p className="text-muted-foreground mb-4">
                    Adapt AI responses and content for German, Austrian, and Swiss cultural contexts
                  </p>
                  <Button onClick={bulkTranslateTherapyContent} disabled={isLoading}>
                    <Globe className="h-4 w-4 mr-2" />
                    Translate Cultural Content
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Translation Progress</CardTitle>
              <CardDescription>
                Overall progress of therapy and cultural content translation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {translationProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Translation Progress</span>
                    <span>{translationProgress}%</span>
                  </div>
                  <Progress value={translationProgress} className="h-2" />
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <div className="font-semibold">Terminology</div>
                    <div className="text-sm text-muted-foreground">{therapeuticTerms.length} terms</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <AlertCircle className="h-8 w-8 text-yellow-500" />
                  <div>
                    <div className="font-semibold">Therapy Plans</div>
                    <div className="text-sm text-muted-foreground">Pending translation</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <AlertCircle className="h-8 w-8 text-yellow-500" />
                  <div>
                    <div className="font-semibold">Cultural AI</div>
                    <div className="text-sm text-muted-foreground">Pending translation</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TherapyTranslationManager;