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
  Check, 
  X, 
  Eye,
  Languages,
  Filter,
  Download,
  Upload
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SUPPORTED_LANGUAGES } from '@/utils/languageRouting';

interface ContentTranslation {
  id: string;
  content_key: string;
  content_type: string;
  source_language: string;
  target_language: string;
  original_text: string;
  translated_text: string;
  context_type: string;
  quality_score: number;
  translation_method: string;
  is_approved: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ContentTranslationManagerProps {
  onStatsUpdate: () => void;
}

const ContentTranslationManager: React.FC<ContentTranslationManagerProps> = ({ onStatsUpdate }) => {
  const [translations, setTranslations] = useState<ContentTranslation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTranslation, setSelectedTranslation] = useState<ContentTranslation | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedText, setEditedText] = useState('');

  useEffect(() => {
    loadTranslations();
  }, []);

  const loadTranslations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('content_translations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTranslations(data || []);
    } catch (error) {
      console.error('Error loading translations:', error);
      toast.error('Failed to load translations');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveTranslation = async (translationId: string, approved: boolean) => {
    try {
      const { error } = await supabase.functions.invoke('admin-ai-translation', {
        body: {
          action: 'approve_translation',
          translationId,
          approved,
          userId: (await supabase.auth.getUser()).data.user?.id
        }
      });

      if (error) throw error;

      toast.success(`Translation ${approved ? 'approved' : 'rejected'} successfully`);
      loadTranslations();
      onStatsUpdate();
    } catch (error) {
      console.error('Error updating translation approval:', error);
      toast.error('Failed to update translation');
    }
  };

  const handleEditTranslation = async () => {
    if (!selectedTranslation) return;

    try {
      const { error } = await supabase
        .from('content_translations')
        .update({
          translated_text: editedText,
          is_approved: false // Require re-approval after edit
        })
        .eq('id', selectedTranslation.id);

      if (error) throw error;

      toast.success('Translation updated successfully');
      setIsEditDialogOpen(false);
      loadTranslations();
      onStatsUpdate();
    } catch (error) {
      console.error('Error editing translation:', error);
      toast.error('Failed to edit translation');
    }
  };

  const handleBulkAction = async (action: 'approve' | 'reject', translationIds: string[]) => {
    try {
      const promises = translationIds.map(id => 
        handleApproveTranslation(id, action === 'approve')
      );
      await Promise.all(promises);
      
      toast.success(`${translationIds.length} translations ${action === 'approve' ? 'approved' : 'rejected'}`);
    } catch (error) {
      console.error('Error with bulk action:', error);
      toast.error('Failed to perform bulk action');
    }
  };

  const filteredTranslations = translations.filter(translation => {
    const matchesSearch = translation.content_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      translation.original_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      translation.translated_text.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLanguage = filterLanguage === 'all' || translation.target_language === filterLanguage;
    
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'approved' && translation.is_approved) ||
      (filterStatus === 'pending' && !translation.is_approved) ||
      (filterStatus === 'active' && translation.is_active);

    return matchesSearch && matchesLanguage && matchesStatus;
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
          <h2 className="text-xl font-semibold text-white">Content Translations</h2>
          <p className="text-gray-400">Manage translated content across all languages</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search translations..."
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
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px] bg-gray-700 border-gray-600">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="active">Active</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Translations List */}
      <div className="space-y-4">
        {filteredTranslations.map((translation) => (
          <Card key={translation.id} className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="text-xs">
                      {translation.content_key}
                    </Badge>
                    <Badge variant={translation.is_approved ? 'default' : 'secondary'}>
                      {translation.is_approved ? 'Approved' : 'Pending'}
                    </Badge>
                    <Badge variant="outline">
                      {SUPPORTED_LANGUAGES.find(l => l.code === translation.target_language)?.name || translation.target_language}
                    </Badge>
                    <span className="text-xs text-gray-400">
                      Quality: {Math.round(translation.quality_score * 100)}%
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Original ({translation.source_language})</label>
                      <p className="text-sm text-gray-300 bg-gray-700 p-3 rounded border">
                        {translation.original_text}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Translation ({translation.target_language})</label>
                      <p className="text-sm text-white bg-gray-700 p-3 rounded border">
                        {translation.translated_text}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedTranslation(translation);
                      setEditedText(translation.translated_text);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  {!translation.is_approved && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApproveTranslation(translation.id, true)}
                        className="text-green-400 border-green-400 hover:bg-green-400 hover:text-white"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApproveTranslation(translation.id, false)}
                        className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredTranslations.length === 0 && (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-12 text-center">
              <Languages className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No translations found matching your criteria</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Translation</DialogTitle>
          </DialogHeader>
          {selectedTranslation && (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-2">
                  Original ({selectedTranslation.source_language})
                </label>
                <p className="text-sm text-gray-300 bg-gray-700 p-3 rounded border">
                  {selectedTranslation.original_text}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-2">
                  Translation ({selectedTranslation.target_language})
                </label>
                <Textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  rows={4}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditTranslation}>
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

export default ContentTranslationManager;