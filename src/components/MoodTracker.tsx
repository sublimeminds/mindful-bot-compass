import React, { useState, useEffect } from 'react';
import { useEnhancedAuth } from '@/components/EnhancedAuthProviderV2';
import { supabase } from '@/integrations/supabase/client';
import SafeErrorBoundary from '@/components/SafeErrorBoundary';

interface MoodEntry {
  id: string;
  created_at: string;
  overall: number;
  energy: number;
  anxiety: number;
  depression: number;
  stress: number;
  sleep_quality: number | null;
  social_connection: number | null;
  notes: string | null;
  activities: string[] | null;
  triggers: string[] | null;
  weather: string | null;
}

const MoodTracker = () => {
  const { user } = useEnhancedAuth();
  const [currentMood, setCurrentMood] = useState({
    overall: 5,
    energy: 5,
    anxiety: 5,
    depression: 5,
    stress: 5,
    sleep_quality: 5,
    social_connection: 5,
    notes: ''
  });
  const [recentEntries, setRecentEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadRecentEntries();
    }
  }, [user]);

  const loadRecentEntries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(7);

      if (error) throw error;
      setRecentEntries(data || []);
    } catch (error) {
      console.error('Error loading mood entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveMoodEntry = async () => {
    if (!user) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('mood_entries')
        .insert({
          user_id: user.id,
          overall: currentMood.overall,
          energy: currentMood.energy,
          anxiety: currentMood.anxiety,
          depression: currentMood.depression,
          stress: currentMood.stress,
          sleep_quality: currentMood.sleep_quality,
          social_connection: currentMood.social_connection,
          notes: currentMood.notes || null
        });

      if (error) throw error;

      // Reset form and reload entries
      setCurrentMood({
        overall: 5,
        energy: 5,
        anxiety: 5,
        depression: 5,
        stress: 5,
        sleep_quality: 5,
        social_connection: 5,
        notes: ''
      });
      await loadRecentEntries();
    } catch (error) {
      console.error('Error saving mood entry:', error);
    } finally {
      setSaving(false);
    }
  };

  const getMoodEmoji = (score: number) => {
    if (score <= 2) return '😢';
    if (score <= 4) return '😔';
    if (score <= 6) return '😐';
    if (score <= 8) return '🙂';
    return '😊';
  };

  const getMoodColor = (score: number) => {
    if (score <= 2) return 'text-red-600';
    if (score <= 4) return 'text-orange-600';
    if (score <= 6) return 'text-yellow-600';
    if (score <= 8) return 'text-green-600';
    return 'text-green-700';
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please sign in to track your mood.</p>
      </div>
    );
  }

  return (
    <SafeErrorBoundary name="MoodTracker">
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Mood Tracker</h2>
        
        {/* Current Mood Entry */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">How are you feeling today?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Mood */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Mood {getMoodEmoji(currentMood.overall)}
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={currentMood.overall}
                onChange={(e) => setCurrentMood(prev => ({ ...prev, overall: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 (Very Low)</span>
                <span className={`font-medium ${getMoodColor(currentMood.overall)}`}>
                  {currentMood.overall}
                </span>
                <span>10 (Very High)</span>
              </div>
            </div>

            {/* Energy Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Energy Level ⚡
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={currentMood.energy}
                onChange={(e) => setCurrentMood(prev => ({ ...prev, energy: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 (Exhausted)</span>
                <span className="font-medium">{currentMood.energy}</span>
                <span>10 (Energetic)</span>
              </div>
            </div>

            {/* Anxiety Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Anxiety Level 😰
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={currentMood.anxiety}
                onChange={(e) => setCurrentMood(prev => ({ ...prev, anxiety: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 (Calm)</span>
                <span className="font-medium">{currentMood.anxiety}</span>
                <span>10 (Very Anxious)</span>
              </div>
            </div>

            {/* Stress Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stress Level 😤
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={currentMood.stress}
                onChange={(e) => setCurrentMood(prev => ({ ...prev, stress: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 (Relaxed)</span>
                <span className="font-medium">{currentMood.stress}</span>
                <span>10 (Very Stressed)</span>
              </div>
            </div>
          </div>

          {/* Sleep Quality */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sleep Quality Last Night 💤
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={currentMood.sleep_quality}
              onChange={(e) => setCurrentMood(prev => ({ ...prev, sleep_quality: parseInt(e.target.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 (Terrible)</span>
              <span className="font-medium">{currentMood.sleep_quality}</span>
              <span>10 (Excellent)</span>
            </div>
          </div>

          {/* Notes */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={currentMood.notes}
              onChange={(e) => setCurrentMood(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="How are you feeling? What's on your mind?"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>

          <button
            onClick={saveMoodEntry}
            disabled={saving}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Mood Entry'}
          </button>
        </div>

        {/* Recent Entries */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Mood Entries</h3>
          
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : recentEntries.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No mood entries yet. Add your first entry above!</p>
          ) : (
            <div className="space-y-3">
              {recentEntries.map((entry) => (
                <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-gray-500">
                      {new Date(entry.created_at).toLocaleDateString()} at {new Date(entry.created_at).toLocaleTimeString()}
                    </span>
                    <span className={`text-lg ${getMoodColor(entry.overall)}`}>
                      {getMoodEmoji(entry.overall)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Mood:</span>
                      <span className={`ml-1 font-medium ${getMoodColor(entry.overall)}`}>
                        {entry.overall}/10
                      </span>
                    </div>
                    {entry.energy && (
                      <div>
                        <span className="text-gray-600">Energy:</span>
                        <span className="ml-1 font-medium">{entry.energy}/10</span>
                      </div>
                    )}
                    {entry.anxiety && (
                      <div>
                        <span className="text-gray-600">Anxiety:</span>
                        <span className="ml-1 font-medium">{entry.anxiety}/10</span>
                      </div>
                    )}
                    {entry.stress && (
                      <div>
                        <span className="text-gray-600">Stress:</span>
                        <span className="ml-1 font-medium">{entry.stress}/10</span>
                      </div>
                    )}
                    {entry.sleep_quality && (
                      <div>
                        <span className="text-gray-600">Sleep:</span>
                        <span className="ml-1 font-medium">{entry.sleep_quality}/10</span>
                      </div>
                    )}
                  </div>
                  
                  {entry.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                      <span className="text-gray-600">Notes:</span>
                      <p className="mt-1">{entry.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SafeErrorBoundary>
  );
};

export default MoodTracker;