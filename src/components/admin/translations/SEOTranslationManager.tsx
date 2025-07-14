import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Search, 
  Plus, 
  Edit, 
  Globe, 
  Tag,
  Eye,
  Copy,
  ExternalLink
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SUPPORTED_LANGUAGES } from '@/utils/languageRouting';

interface SEOTranslation {
  id: string;
  page_key: string;
  language_code: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string[];
  og_title: string;
  og_description: string;
  og_image: string;
  twitter_title: string;
  twitter_description: string;
  schema_data: any;
  canonical_url: string;
  hreflang_data: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface SEOTranslationManagerProps {
  onStatsUpdate: () => void;
}

const SEOTranslationManager: React.FC<SEOTranslationManagerProps> = ({ onStatsUpdate }) => {
  const [seoTranslations, setSeoTranslations] = useState<SEOTranslation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSEO, setSelectedSEO] = useState<SEOTranslation | null>(null);
  const [newSEO, setNewSEO] = useState({
    pageKey: '',
    targetLanguage: '',
    metaTitle: '',
    metaDescription: '',
    keywords: ''
  });

  useEffect(() => {
    loadSEOTranslations();
  }, []);

  const loadSEOTranslations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('seo_translations')
        .select('*')
        .order('page_key', { ascending: true });

      if (error) throw error;
      setSeoTranslations(data || []);
    } catch (error) {
      console.error('Error loading SEO translations:', error);
      toast.error('Failed to load SEO translations');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSEOTranslation = async () => {
    if (!newSEO.pageKey || !newSEO.targetLanguage || !newSEO.metaTitle || !newSEO.metaDescription) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const keywords = newSEO.keywords.split(',').map(k => k.trim()).filter(k => k);
      
      const { data, error } = await supabase.functions.invoke('admin-ai-translation', {
        body: {
          action: 'translate_seo',
          pageKey: newSEO.pageKey,
          targetLanguage: newSEO.targetLanguage,
          metaTitle: newSEO.metaTitle,
          metaDescription: newSEO.metaDescription,
          keywords
        }
      });

      if (error) throw error;

      toast.success('SEO translation generated successfully');
      setIsAddDialogOpen(false);
      setNewSEO({ pageKey: '', targetLanguage: '', metaTitle: '', metaDescription: '', keywords: '' });
      loadSEOTranslations();
      onStatsUpdate();
    } catch (error) {
      console.error('Error generating SEO translation:', error);
      toast.error('Failed to generate SEO translation');
    }
  };

  const handleEditSEO = async (updatedSEO: Partial<SEOTranslation>) => {
    if (!selectedSEO) return;

    try {
      const { error } = await supabase
        .from('seo_translations')
        .update(updatedSEO)
        .eq('id', selectedSEO.id);

      if (error) throw error;

      toast.success('SEO translation updated successfully');
      setIsEditDialogOpen(false);
      loadSEOTranslations();
      onStatsUpdate();
    } catch (error) {
      console.error('Error updating SEO translation:', error);
      toast.error('Failed to update SEO translation');
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('seo_translations')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;

      toast.success(`SEO translation ${!isActive ? 'activated' : 'deactivated'}`);
      loadSEOTranslations();
      onStatsUpdate();
    } catch (error) {
      console.error('Error toggling SEO status:', error);
      toast.error('Failed to update SEO status');
    }
  };

  const filteredSEO = seoTranslations.filter(seo => {
    const matchesSearch = seo.page_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seo.meta_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seo.meta_description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLanguage = filterLanguage === 'all' || seo.language_code === filterLanguage;

    return matchesSearch && matchesLanguage;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">SEO Translations</h2>
          <p className="text-gray-400">Manage meta tags, descriptions, and SEO content</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add SEO Translation
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Generate SEO Translation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Page Key (e.g., pricing, about)"
                  value={newSEO.pageKey}
                  onChange={(e) => setNewSEO({ ...newSEO, pageKey: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Select value={newSEO.targetLanguage} onValueChange={(value) => setNewSEO({ ...newSEO, targetLanguage: value })}>
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue placeholder="Target Language" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    {SUPPORTED_LANGUAGES.filter(lang => lang.code !== 'en').map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Input
                placeholder="Meta Title (English)"
                value={newSEO.metaTitle}
                onChange={(e) => setNewSEO({ ...newSEO, metaTitle: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
              />
              
              <Textarea
                placeholder="Meta Description (English)"
                value={newSEO.metaDescription}
                onChange={(e) => setNewSEO({ ...newSEO, metaDescription: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                rows={3}
              />
              
              <Input
                placeholder="Keywords (comma-separated, English)"
                value={newSEO.keywords}
                onChange={(e) => setNewSEO({ ...newSEO, keywords: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
              />
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleGenerateSEOTranslation}>
                  Generate Translation
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search SEO translations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
            <Select value={filterLanguage} onValueChange={setFilterLanguage}>
              <SelectTrigger className="w-[150px] bg-gray-700 border-gray-600">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all">All Languages</SelectItem>
                {SUPPORTED_LANGUAGES.map(lang => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* SEO Translations List */}
      <div className="space-y-4">
        {filteredSEO.map((seo) => (
          <Card key={seo.id} className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">{seo.page_key}</Badge>
                    <Badge variant={seo.is_active ? 'default' : 'secondary'}>
                      {seo.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="outline">
                      {SUPPORTED_LANGUAGES.find(l => l.code === seo.language_code)?.name || seo.language_code}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedSEO(seo);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleActive(seo.id, seo.is_active)}
                    >
                      {seo.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Meta Title</label>
                      <p className="text-sm text-white bg-gray-700 p-3 rounded border">
                        {seo.meta_title || 'Not set'}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Meta Description</label>
                      <p className="text-sm text-gray-300 bg-gray-700 p-3 rounded border">
                        {seo.meta_description || 'Not set'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Keywords</label>
                      <div className="flex flex-wrap gap-1">
                        {seo.meta_keywords && seo.meta_keywords.length > 0 ? (
                          seo.meta_keywords.map((keyword, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {keyword}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">No keywords set</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Open Graph Title</label>
                      <p className="text-sm text-gray-300 bg-gray-700 p-3 rounded border">
                        {seo.og_title || 'Not set'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredSEO.length === 0 && (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-12 text-center">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No SEO translations found matching your criteria</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Edit SEO Translation</DialogTitle>
          </DialogHeader>
          {selectedSEO && (
            <div className="space-y-4">
              <Input
                placeholder="Meta Title"
                defaultValue={selectedSEO.meta_title}
                onChange={(e) => setSelectedSEO({ ...selectedSEO, meta_title: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
              />
              
              <Textarea
                placeholder="Meta Description"
                defaultValue={selectedSEO.meta_description}
                onChange={(e) => setSelectedSEO({ ...selectedSEO, meta_description: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                rows={3}
              />
              
              <Input
                placeholder="Keywords (comma-separated)"
                defaultValue={selectedSEO.meta_keywords?.join(', ')}
                onChange={(e) => setSelectedSEO({ 
                  ...selectedSEO, 
                  meta_keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)
                })}
                className="bg-gray-700 border-gray-600 text-white"
              />
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => handleEditSEO({
                  meta_title: selectedSEO.meta_title,
                  meta_description: selectedSEO.meta_description,
                  meta_keywords: selectedSEO.meta_keywords,
                  og_title: selectedSEO.meta_title,
                  og_description: selectedSEO.meta_description,
                  twitter_title: selectedSEO.meta_title,
                  twitter_description: selectedSEO.meta_description
                })}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SEOTranslationManager;