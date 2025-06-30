
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  BookOpen, Plus, Search, Calendar, Brain, Heart,
  Mic, Download, Share, Tag, Filter, Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSafeSEO } from '@/hooks/useSafeSEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Notebook = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [showNewEntry, setShowNewEntry] = useState(false);

  useSafeSEO({
    title: 'Digital Notebook & Journal - AI-Enhanced Mental Health Journaling | TherapySync',
    description: 'Keep a digital journal with AI insights, voice-to-text, mood correlation, and therapeutic reflection prompts.',
    keywords: 'digital journal, mental health journaling, AI insights, therapeutic writing, mood tracking'
  });

  const tags = ['All', 'Therapy', 'Reflection', 'Goals', 'Gratitude', 'Dreams', 'Anxiety', 'Progress'];

  const entries = [
    {
      id: 1,
      title: 'Morning Reflection',
      content: 'Started the day with meditation. Feeling more centered and ready to tackle challenges...',
      date: '2024-01-15',
      tags: ['Reflection', 'Meditation'],
      mood: 4,
      aiInsight: 'Your morning routine seems to positively impact your mood. Consider maintaining this pattern.',
      wordCount: 247
    },
    {
      id: 2,
      title: 'Therapy Session Notes',
      content: 'Discussed coping strategies for work stress. Key takeaway: breathing exercises...',
      date: '2024-01-14',
      tags: ['Therapy', 'Stress'],
      mood: 3,
      aiInsight: 'Progress noted in stress management techniques. Consider daily practice.',
      wordCount: 156
    },
    {
      id: 3,
      title: 'Gratitude Practice',
      content: 'Three things I am grateful for today: family support, good health, new opportunities...',
      date: '2024-01-13',
      tags: ['Gratitude'],
      mood: 5,
      aiInsight: 'Gratitude entries correlate with your highest mood ratings. Excellent practice!',
      wordCount: 89
    }
  ];

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === 'All' || entry.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const getMoodIcon = (mood: number) => {
    const icons = ['😢', '😕', '😐', '😊', '😄'];
    return icons[mood - 1] || '😐';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-indigo-50">
      <Header />
      
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-therapy-500 to-indigo-500 text-white px-8 py-3 text-sm font-semibold shadow-lg border-0">
              <BookOpen className="h-4 w-4 mr-2" />
              Digital Notebook
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-therapy-600 to-indigo-600 bg-clip-text text-transparent">
                Your Mental Health Journal
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Capture thoughts, track progress, and gain insights with AI-enhanced journaling. Voice-to-text, mood correlation, and therapeutic prompts included.
            </p>

            <Button
              size="lg"
              onClick={() => setShowNewEntry(true)}
              className="bg-gradient-to-r from-therapy-500 to-indigo-500 hover:from-therapy-600 hover:to-indigo-600 text-white border-0 px-8 py-6 text-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Entry
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: BookOpen, label: 'Total Entries', value: '24', color: 'from-blue-500 to-indigo-500' },
              { icon: Calendar, label: 'Streak Days', value: '12', color: 'from-green-500 to-emerald-500' },
              { icon: Brain, label: 'AI Insights', value: '18', color: 'from-purple-500 to-violet-500' },
              { icon: Heart, label: 'Avg Mood', value: '4.2', color: 'from-pink-500 to-rose-500' }
            ].map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search your entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {tags.map((tag) => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag(tag)}
                  className={selectedTag === tag ? "bg-therapy-600 hover:bg-therapy-700" : ""}
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          {/* New Entry Form */}
          {showNewEntry && (
            <Card className="mb-8 bg-gradient-to-r from-therapy-50 to-indigo-50 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  <span className="bg-gradient-to-r from-therapy-600 to-indigo-600 bg-clip-text text-transparent">
                    New Journal Entry
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Entry title..." />
                <Textarea 
                  placeholder="What's on your mind today? Share your thoughts, feelings, or reflections..."
                  className="min-h-[200px]"
                />
                <div className="flex flex-wrap gap-2">
                  {tags.slice(1).map((tag) => (
                    <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-therapy-50">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button className="bg-gradient-to-r from-therapy-500 to-indigo-500 text-white border-0">
                    Save Entry
                  </Button>
                  <Button variant="outline">
                    <Mic className="h-4 w-4 mr-2" />
                    Voice Input
                  </Button>
                  <Button variant="outline" onClick={() => setShowNewEntry(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Journal Entries */}
          <div className="space-y-6">
            {filteredEntries.map((entry) => (
              <Card key={entry.id} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-therapy-600 mb-2">{entry.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(entry.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <span>{getMoodIcon(entry.mood)}</span>
                          Mood: {entry.mood}/5
                        </div>
                        <span>{entry.wordCount} words</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Star className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-700 leading-relaxed">{entry.content}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {entry.aiInsight && (
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Brain className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-purple-700 mb-1">AI Insight</h4>
                          <p className="text-sm text-purple-600">{entry.aiInsight}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredEntries.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 mb-4">No entries found matching your criteria.</p>
              <Button 
                variant="outline"
                onClick={() => { setSearchTerm(''); setSelectedTag('All'); }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Notebook;
