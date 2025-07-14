import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Link, 
  Plus, 
  Edit, 
  Globe, 
  Search,
  ExternalLink,
  Copy,
  Trash2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SUPPORTED_LANGUAGES } from '@/utils/languageRouting';

interface URLTranslation {
  id: string;
  page_key: string;
  language_code: string;
  original_path: string;
  translated_path: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface URLTranslationManagerProps {
  onStatsUpdate: () => void;
}

const URLTranslationManager: React.FC<URLTranslationManagerProps> = ({ onStatsUpdate }) => {
  const [urlTranslations, setUrlTranslations] = useState<URLTranslation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newURL, setNewURL] = useState({
    pageKey: '',
    originalPath: '',
    targetLanguage: '',
    translatedPath: ''
  });

  useEffect(() => {
    loadURLTranslations();
  }, []);

  const loadURLTranslations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('url_translations')
        .select('*')
        .order('page_key', { ascending: true });

      if (error) throw error;
      setUrlTranslations(data || []);
    } catch (error) {
      console.error('Error loading URL translations:', error);
      toast.error('Failed to load URL translations');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTranslation = async (pageKey: string, originalPath: string, targetLanguage: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-ai-translation', {
        body: {
          action: 'translate_url',
          pageKey,
          originalPath,
          targetLanguage,
          contextType: 'ui'
        }
      });

      if (error) throw error;

      toast.success('URL translation generated successfully');
      loadURLTranslations();
      onStatsUpdate();
    } catch (error) {
      console.error('Error generating URL translation:', error);
      toast.error('Failed to generate URL translation');
    }
  };

  const handleAddURL = async () => {
    if (!newURL.pageKey || !newURL.originalPath || !newURL.targetLanguage) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      let translatedPath = newURL.translatedPath;
      
      // If no custom path provided, generate one
      if (!translatedPath) {
        const { data, error } = await supabase.functions.invoke('admin-ai-translation', {
          body: {
            action: 'translate_url',
            pageKey: newURL.pageKey,
            originalPath: newURL.originalPath,
            targetLanguage: newURL.targetLanguage
          }
        });

        if (error) throw error;
        translatedPath = data.translatedPath;
      } else {
        // Store custom URL
        const { error } = await supabase
          .from('url_translations')
          .insert({
            page_key: newURL.pageKey,
            language_code: newURL.targetLanguage,
            original_path: newURL.originalPath,
            translated_path: translatedPath,
            is_active: true
          });

        if (error) throw error;
      }

      toast.success('URL translation added successfully');
      setIsAddDialogOpen(false);
      setNewURL({ pageKey: '', originalPath: '', targetLanguage: '', translatedPath: '' });
      loadURLTranslations();
      onStatsUpdate();
    } catch (error) {
      console.error('Error adding URL translation:', error);
      toast.error('Failed to add URL translation');
    }
  };

  const handleCopyURL = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('url_translations')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;

      toast.success(`URL ${!isActive ? 'activated' : 'deactivated'}`);
      loadURLTranslations();
      onStatsUpdate();
    } catch (error) {
      console.error('Error toggling URL status:', error);
      toast.error('Failed to update URL status');
    }
  };

  const handleDeleteURL = async (id: string) => {
    if (!confirm('Are you sure you want to delete this URL translation?')) return;

    try {
      const { error } = await supabase
        .from('url_translations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('URL translation deleted');
      loadURLTranslations();
      onStatsUpdate();
    } catch (error) {
      console.error('Error deleting URL translation:', error);
      toast.error('Failed to delete URL translation');
    }
  };

  const filteredURLs = urlTranslations.filter(url => {
    const matchesSearch = url.page_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      url.original_path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      url.translated_path.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLanguage = filterLanguage === 'all' || url.language_code === filterLanguage;

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
          <h2 className="text-xl font-semibold text-white">URL Translations</h2>
          <p className="text-gray-400">Manage multilingual URL paths and routing</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add URL Translation
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Add URL Translation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Page Key (e.g., pricing, about)"
                value={newURL.pageKey}
                onChange={(e) => setNewURL({ ...newURL, pageKey: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
              />
              <Input
                placeholder="Original Path (e.g., /pricing)"
                value={newURL.originalPath}
                onChange={(e) => setNewURL({ ...newURL, originalPath: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
              />
              <Select value={newURL.targetLanguage} onValueChange={(value) => setNewURL({ ...newURL, targetLanguage: value })}>
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
              <Input
                placeholder="Custom Translated Path (optional - AI will generate if empty)"
                value={newURL.translatedPath}
                onChange={(e) => setNewURL({ ...newURL, translatedPath: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddURL}>
                  Add Translation
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
                  placeholder="Search URLs..."
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

      {/* URL Translations List */}
      <div className="space-y-4">
        {filteredURLs.map((url) => (
          <Card key={url.id} className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <Badge variant="outline">{url.page_key}</Badge>
                    <Badge variant={url.is_active ? 'default' : 'secondary'}>
                      {url.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="outline">
                      {SUPPORTED_LANGUAGES.find(l => l.code === url.language_code)?.name || url.language_code}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Original Path</label>
                      <div className="flex items-center space-x-2">
                        <code className="text-sm text-gray-300 bg-gray-700 px-3 py-2 rounded border flex-1">
                          {url.original_path}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyURL(url.original_path)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Translated Path</label>
                      <div className="flex items-center space-x-2">
                        <code className="text-sm text-white bg-gray-700 px-3 py-2 rounded border flex-1">
                          {url.translated_path}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyURL(url.translated_path)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleActive(url.id, url.is_active)}
                  >
                    {url.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteURL(url.id)}
                    className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredURLs.length === 0 && (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-12 text-center">
              <Link className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No URL translations found matching your criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default URLTranslationManager;