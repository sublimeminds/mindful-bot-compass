
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Heart, MessageCircle } from "lucide-react";

interface SessionEndModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    moodAfter: number;
    notes: string;
    rating: number;
    breakthroughs: string[];
  }) => void;
}

const SessionEndModal = ({ isOpen, onClose, onSubmit }: SessionEndModalProps) => {
  const [moodAfter, setMoodAfter] = useState([7]);
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(0);
  const [breakthrough, setBreakthrough] = useState('');
  const [breakthroughs, setBreakthroughs] = useState<string[]>([]);

  const handleSubmit = () => {
    onSubmit({
      moodAfter: moodAfter[0],
      notes,
      rating,
      breakthroughs
    });
    
    // Reset form
    setMoodAfter([7]);
    setNotes('');
    setRating(0);
    setBreakthrough('');
    setBreakthroughs([]);
    onClose();
  };

  const addBreakthrough = () => {
    if (breakthrough.trim() && !breakthroughs.includes(breakthrough.trim())) {
      setBreakthroughs([...breakthroughs, breakthrough.trim()]);
      setBreakthrough('');
    }
  };

  const removeBreakthrough = (index: number) => {
    setBreakthroughs(breakthroughs.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Heart className="h-5 w-5 mr-2 text-therapy-500" />
            How was your session?
          </DialogTitle>
          <DialogDescription>
            Take a moment to reflect on your therapy session and track your progress.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Mood After */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">How are you feeling now?</Label>
            <div className="px-3">
              <Slider
                value={moodAfter}
                onValueChange={setMoodAfter}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1 (Very Low)</span>
                <span className="font-medium">Mood: {moodAfter[0]}</span>
                <span>10 (Excellent)</span>
              </div>
            </div>
          </div>

          {/* Session Rating */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">How helpful was this session?</Label>
            <div className="flex space-x-1">
              {Array.from({ length: 5 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setRating(i + 1)}
                  className="p-1"
                >
                  <Star
                    className={`h-6 w-6 ${
                      i < rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300 hover:text-yellow-200'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Key Insights */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Any key insights or breakthroughs?</Label>
            <div className="flex space-x-2">
              <Textarea
                placeholder="What did you learn about yourself today?"
                value={breakthrough}
                onChange={(e) => setBreakthrough(e.target.value)}
                className="min-h-[60px]"
              />
              <Button 
                onClick={addBreakthrough}
                disabled={!breakthrough.trim()}
                size="sm"
              >
                Add
              </Button>
            </div>
            {breakthroughs.length > 0 && (
              <div className="space-y-2">
                {breakthroughs.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-3 flex justify-between items-start">
                      <p className="text-sm">{item}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBreakthrough(index)}
                        className="h-6 w-6 p-0"
                      >
                        ×
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Session Notes */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Personal notes (optional)</Label>
            <Textarea
              placeholder="Any thoughts or reflections you'd like to remember..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Skip
            </Button>
            <Button onClick={handleSubmit}>
              Complete Session
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SessionEndModal;
